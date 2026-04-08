import Order from '../models/order.js'
import Cart from '../models/carts.js'
import User from '../models/user.js'

export const placeOrder = async(req,res) => {
    try {
        
        const { id } = req.user
        const { address } = req.body

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
            address
        })

        // clear cart
        cart.items = []
        await cart.save()

        res.status(201).json({ message: "Order Placed Successfully", success: true, order: newOrder })

    } catch (error) {
        console.log("Error in Place Order : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const getUserOrders = async(req,res) => {
    try {
        
        const { id } = req.user
        const order = await Order.find({ user: id }).sort({ createdAt: -1 })

        res.status(200).json({ message: "Get User Orders", success: true, order })

    } catch (error) {
        console.log("Error in Get User Orders : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const getAllOrders = async(req,res) => {
    try {

        const orders = await Order.find().populate('user').sort({ createdAt: -1 })

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
