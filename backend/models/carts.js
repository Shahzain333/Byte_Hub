import { model, Schema, mongoose } from 'mongoose'

const cartSchema = new Schema({
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
}, { timestamps: true })

const Cart = model('Cart', cartSchema)

export default Cart