import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'   
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import menuRoutes from './routes/menuRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import contactRoutes from './routes/contactRoutes.js'

dotenv.config({ path: new URL('.env', import.meta.url).pathname })

const app = express()

// Database Connection
connectDB()

// Cloudinary
connectCloudinary()

// Middleware
app.use(express.json())
app.use(cors({
    origin: `${process.env.CLIENT_SIDE_URL}`,
    credentials: true
}))
app.use(cookieParser())

const PORT = process.env.PORT || 8001;

app.get('/', (req,res) => {
    res.send("Hello from resturant server")
})

app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/booking', bookingRoutes)
app.use('/api/contact', contactRoutes)

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
