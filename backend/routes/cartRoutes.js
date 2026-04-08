import express from 'express'
import { addToCart, getCart, removeToCart } from '../controllers/cartController.js'
import { protect } from '../middlewares/authMiddleware.js'

const cartRoutes = express.Router()

cartRoutes.post('/add', protect, addToCart)
cartRoutes.delete('/remove', protect, removeToCart)
cartRoutes.get('/get', protect, getCart)

export default cartRoutes