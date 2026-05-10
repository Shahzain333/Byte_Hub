import { model, Schema } from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    resetOtp:{
        type: String,
        default: null
    },
    resetOtpExpiry: {
        type: Date,
        default: null
    }
}, { timestamps: true })

const User = model('User', userSchema)

export default User