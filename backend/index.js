import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'

dotenv.config()

const app = express()

// Database Connection
connectDB()

// Middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())

const PORT = process.env.PORT || 8001;

app.get('/', (req,res) => {
    res.send("Hello from resturant server")
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
