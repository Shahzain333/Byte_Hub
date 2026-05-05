import { model, Schema } from 'mongoose'

const contactSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ""
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["Unread", "Read"],
        default: "Unread"
    },
}, { timestamps: true })

const Contact = model('Contact', contactSchema)

export default Contact