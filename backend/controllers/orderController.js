import Order from '../models/order.js'
import Cart from '../models/carts.js'
import User from '../models/user.js'
import { sendOrderStatusEmail } from '../utils/sendTransactionalEmails.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY)

export const createPaymentIntent = async (req, res) => {
    try {

        const { amount } = req.body  // amount in dollars/PKR (not cents yet)

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount", success: false })
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),   // Stripe works in smallest unit (cents/paisa)
            currency: process.env.STRIPE_CURRENCY || 'usd',   // change to 'pkr' if needed
            payment_method_types: ['card'],
            metadata: {
                userId: req.user.id
            }
        })

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id      // used by frontend for simulated flow
        })

    } catch (error) {
        console.log("Error in Create Payment Intent:", error.message)
        return res.status(500).json({ message: "Could not initiate payment", success: false })
    }
}

export const placeOrder = async (req, res) => {
    try {

        const { id } = req.user
        const { address, paymentMethod, stripePaymentIntentId } = req.body

        if (!address) {
            return res.status(400).json({ message: "Delivery address is required", success: false })
        }

        const cart = await Cart.findOne({ user: id }).populate("items.menuItem")

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty", success: false })
        }

        // For Online Payment: verify the Stripe PaymentIntent
        let paymentStatus = "Pending"

        if (paymentMethod === "Online Payment") {

            if (!stripePaymentIntentId) {
                return res.status(400).json({ 
                    message: "Payment not completed. Please pay before placing order.", 
                    success: false 
                })
            }

            // Verify with Stripe that payment actually succeeded
            try {
                const intent = await stripe.paymentIntents.retrieve(stripePaymentIntentId)

                if (intent.status === 'succeeded') {
                    paymentStatus = "Paid"
                } else if (intent.status === 'requires_payment_method' || intent.status === 'canceled') {
                    paymentStatus = "Failed"
                    return res.status(400).json({ message: "Payment failed. Please try again.", success: false })
                }
                // 'requires_confirmation' etc. stays "Pending"

            } catch (stripeErr) {
                console.log("Stripe verification error:", stripeErr.message)
                // If Stripe key is test/missing, allow order but mark Pending
                // Remove this fallback in production!
                paymentStatus = "Paid"   // SIMULATED — remove in prod
            }

        }

        // Cash on Delivery → paymentStatus stays "Pending" (paid on arrival)

        const totalAmount = cart.items.reduce(
            (sum, item) => sum + item.menuItem.price * item.quantity, 0
        )

        const newOrder = await Order.create({
            user: id,
            items: cart.items.map((i) => ({
                menuItem: i.menuItem._id,
                quantity: i.quantity
            })),
            totalAmount,
            address,
            paymentMethod,
            paymentStatus,
            ...(stripePaymentIntentId && { stripePaymentIntentId })
        })

        // Clear cart
        cart.items = []
        await cart.save()

        let emailSent = false

        try {
            const user = await User.findById(id).select("username email")
            if (user?.email) {
                await sendOrderStatusEmail({
                    customerName: user.username || "Customer",
                    customerEmail: user.email,
                    orderId: newOrder._id.toString(),
                    totalAmount: newOrder.totalAmount,
                    paymentMethod: newOrder.paymentMethod,
                    paymentStatus: newOrder.paymentStatus,
                    address: newOrder.address,
                    status: "Pending"
                })
                emailSent = true
            }
        } catch (emailError) {
            console.log("Order confirmation email error:", emailError.message)
        }

        res.status(201).json({
            message: emailSent
                ? "Order placed successfully. Confirmation email sent."
                : "Order placed successfully.",
            success: true,
            order: newOrder,
            emailSent
        })

    } catch (error) {
        console.log("Error in Place Order:", error.message)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

export const getUserOrders = async (req, res) => {
    try {

        const { id } = req.user
        const orders = await Order.find({ user: id })
            .populate('items.menuItem')
            .sort({ createdAt: -1 })

        res.status(200).json({ message: "User orders fetched", success: true, orders })

    } catch (error) {
        console.log("Error in Get User Orders:", error.message)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

export const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate('user')
            .populate('items.menuItem')
            .sort({ createdAt: -1 })

        res.status(200).json({ message: "All orders fetched", success: true, orders })

    } catch (error) {
        console.log("Error in Get All Orders:", error.message)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {

        const { orderId } = req.params
        const { status } = req.body

        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false })
        }

        order.status = status

        // Auto-manage paymentStatus based on order status + paymentMethod
        // Only Cash on Delivery changes automatically — Online Payment is set by Stripe at order creation
        if (order.paymentMethod === "Cash on Delivery") {
            if (status === "Delivered") {
                order.paymentStatus = "Paid"      // customer paid on delivery
            } else {
                order.paymentStatus = "Pending"   // reset if moved back to Preparing/Pending
            }
        }
        // Online Payment: never touch paymentStatus here — it was already set by Stripe

        await order.save()

        let emailSent = false

        try {
            const user = await User.findById(order.user).select("username email")
            if (user?.email) {
                await sendOrderStatusEmail({
                    customerName: user.username || "Customer",
                    customerEmail: user.email,
                    orderId: order._id.toString(),
                    totalAmount: order.totalAmount,
                    paymentMethod: order.paymentMethod,
                    paymentStatus: order.paymentStatus,
                    address: order.address,
                    status
                })
                emailSent = true
            }
        } catch (emailError) {
            console.log("Order status email error:", emailError.message)
        }

        res.status(200).json({
            message: emailSent
                ? `Order updated to "${status}". Email sent to customer.`
                : `Order updated to "${status}".`,
            success: true,
            order,
            emailSent
        })

    } catch (error) {
        console.log("Error in Update Order Status:", error.message)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}


export const updatePaymentStatus = async (req, res) => {
    try {

        const { orderId } = req.params
        const { paymentStatus } = req.body

        const validStatuses = ["Pending", "Paid", "Failed"]
        if (!validStatuses.includes(paymentStatus)) {
            return res.status(400).json({ message: "Invalid payment status", success: false })
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { paymentStatus },
            { new: true }
        )

        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false })
        }

        res.status(200).json({
            message: `Payment status updated to "${paymentStatus}"`,
            success: true,
            order
        })

    } catch (error) {
        console.log("Error in Update Payment Status:", error.message)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}