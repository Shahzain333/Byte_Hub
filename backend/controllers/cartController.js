import Cart from '../models/carts.js'
import Menu from '../models/menu.js'

export const addToCart = async(req,res) => {
    try {
        
        const { menuItemId, quantity } = req.body
        const { id } = req.user

        const menuItem = await Menu.findById(menuItemId)

        if(!menuItem) {
            return res.status(400).json({ message: "Menu Item Not found", success: false })
        }

        let cart = await Cart.findOne({ user: id })

        if(!cart) {
            cart = new Cart({ user: id, items: [] })
        }

        const existingItem = cart.items.find((item) => item.menuItem.toString() === menuItemId)

        if(existingItem) {
            existingItem.quantity += quantity 
        }else {
            cart.items.push({ menuItem: menuItemId, quantity })
        }

        await cart.save()

        res.status(200).json({ message: "Item Add To Cart", success: true, cart })

    } catch (error) {
        console.log("Error in Add To Cart : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const removeToCart = async(req,res) => {
    try {

        const { menuItemId } = req.params
        const { id } = req.user

        const cart = await Cart.findOne({ user: id })
        
        if(!cart) {
            return res.status(404).json({ message: "Cart Not found" })
        }

        cart.items = cart.items.filter((item) => item.menuItem.toString() !== menuItemId)

        await cart.save()

        res.status(200).json({ message: "Item Removed from Cart", success: true, cart })
        
    } catch (error) {
        console.log("Error in Remove To Cart : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

// Get User Cart
export const getCart = async(req,res) => {
    try {
        
        const { id } = req.user
        const cart = await Cart.findOne({ user: id }).populate("items.menuItem")
        
        if(!cart) {
            return res.status(200).json({ items: [] })
        }
        
        res.status(200).json({ success: true, cart })

    } catch (error) {
        console.log("Error in Get All Cart : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}
