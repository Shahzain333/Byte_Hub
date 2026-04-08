import { model, Schema, mongoose } from 'mongoose'

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Menu",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                // min: 1
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending","Preparing","Delivered"],
        default: "Pending"
    },
    paymentMethod: {
        type: String,
        default: "Cash on Delivery"
    }
}, { timestamps: true })

const Order = model('Order', orderSchema)

export default Order
