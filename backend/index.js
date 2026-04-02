import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

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
