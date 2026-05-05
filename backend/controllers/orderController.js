import Order from '../models/order.js'
import Cart from '../models/carts.js'
import User from '../models/user.js'
import { sendOrderConfirmationEmail } from '../utils/sendTransactionalEmails.js'

export const placeOrder = async(req,res) => {
    try {
        
        const { id } = req.user
        const { address, paymentMethod } = req.body

        if(!address) {
            return res.status(400).json({ message: "Delivered address is required", success: false })
        }

        const cart = await Cart.findOne({ user: id }).populate("items.menuItem")

        if(!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your Cart is Empty" })
        }

        const totalAmount = cart.items.reduce((sum,item) => sum+item.menuItem.price * item.quantity, 0)

        const newOrder = await Order.create({
            user: id,
            items: cart.items.map((i) => ({
                menuItem: i.menuItem._id,
                quantity: i.quantity
            })),
            totalAmount,
            address,
            paymentMethod
        })

        // clear cart
        cart.items = []
        await cart.save()

        let emailSent = false

        try {
            
            const user = await User.findById(id).select("username email")
            
            if (user?.email) {
                
                await sendOrderConfirmationEmail({
                    customerName: user.username || "Customer",
                    customerEmail: user.email,
                    orderId: newOrder._id.toString(),
                    totalAmount: newOrder.totalAmount,
                    paymentMethod: newOrder.paymentMethod,
                    address: newOrder.address,
                })

                emailSent = true

            }
        } catch (emailError) {
            console.log("Order confirmation email error:", emailError.message)
        }

        res.status(201).json({
            message: emailSent
                ? "Order placed successfully. Confirmation email sent."
                : "Order placed successfully, but confirmation email could not be sent right now.",
            success: true,
            order: newOrder,
            emailSent
        })

    } catch (error) {
        console.log("Error in Place Order : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const getUserOrders = async(req,res) => {
    try {
        
        const { id } = req.user
        const orders = await Order.find({ user: id }).sort({ createdAt: -1 })

        res.status(200).json({ message: "Get User Orders", success: true, orders })

    } catch (error) {
        console.log("Error in Get User Orders : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const getAllOrders = async(req,res) => {
    try {

        const orders = await Order.find().populate('user').populate('items.menuItem').sort({ createdAt: -1 })

        res.status(200).json({ message: "Get All Orders", success: true, orders })
        
    } catch (error) {
        console.log("Error in Get All Orders : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const updateOrderStatus = async(req,res) => {
    try {

        const { orderId } = req.params
        const { status } = req.body

        const order = await Order.findById(orderId)

        if(!order) {
            return res.status(404).json({ message: "Order Not Found" })
        }

        order.status = status

        await order.save()

        res.status(200).json({ message: "Order Status Updated", success: true })
        
    } catch (error) {
        console.log("Error in Update Order Status : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}
