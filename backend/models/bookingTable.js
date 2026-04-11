import { model, Schema, mongoose } from 'mongoose'

const bookingTableSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    numberOfPeople: {
        type: Number,
        required: true,
        min: 1
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    note: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["Pending","Approved","Cancelled"],
        default: "Pending"
    }
}, { timestamps: true })

const BookingTable = model("Booking Table", bookingTableSchema)

export default BookingTable