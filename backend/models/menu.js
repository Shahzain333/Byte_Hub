import { model, Schema, mongoose } from 'mongoose'

const menuSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Menu = model('Menu', menuSchema)

export default Menu