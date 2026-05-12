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
        enum: ["Cash on Delivery", "Online Payment"],
        default: "Cash on Delivery"
    },
    paymentStatus: {
        type: String,
        enum: ["Pending","Paid","Failed"],
        default: "Pending"
    },
    // Stripe PaymentIntent ID — stored to verify/reference payments
    stripePaymentIntentId: {
        type: String,
        default: null
    }
}, { timestamps: true })

const Order = model('Order', orderSchema)

export default Order
