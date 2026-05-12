import express from 'express'
import { protect, adminOnly } from '../middlewares/authMiddleware.js'
import { getAllOrders, getUserOrders, placeOrder, updateOrderStatus, 
    createPaymentIntent, updatePaymentStatus } from '../controllers/orderController.js'

const orderRoutes = express.Router()

// User Routes
orderRoutes.post('/create-payment-intent', protect, createPaymentIntent)  // Step 1: get clientSecret
orderRoutes.post('/place', protect, placeOrder)                            // Step 2: place order
orderRoutes.get('/my-orders', protect, getUserOrders)
 
// Admin Routes
orderRoutes.get('/orders', adminOnly, getAllOrders)
orderRoutes.put('/update-status/:orderId', adminOnly, updateOrderStatus)
orderRoutes.put('/update-payment-status/:orderId', adminOnly, updatePaymentStatus)

export default orderRoutes