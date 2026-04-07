import express from 'express'
import { addToCart, getCart, removeToCart } from '../controllers/cartController.js'

const cartRoutes = express.Router()

cartRoutes.post('/add', addToCart)
cartRoutes.put('/remove', removeToCart)
cartRoutes.get('/get', getCart)

export default cartRoutes