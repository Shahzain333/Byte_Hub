import mongoose from 'mongoose'

export const connectDB = async (req,res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Database Connected')
    } catch (error) {
        console.log(`Error in Connecting Database : ${error}`)
    }
}