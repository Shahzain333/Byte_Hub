import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import connectCloudinary from './config/cloudinary.js'

dotenv.config()

const app = express()

// Database Connection
connectDB()

// Cloudinary
connectCloudinary()

// Middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())

const PORT = process.env.PORT || 8001;

app.get('/', (req,res) => {
    res.send("Hello from resturant server")
})

app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
