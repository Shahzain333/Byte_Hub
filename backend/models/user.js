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
        required: true,
    },
    image: {
        type: String,
        //required: false,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const User = model('User', userSchema)

export default User