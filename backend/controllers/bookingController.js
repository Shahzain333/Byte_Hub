import BookingTable from "../models/bookingTable.js";
import { sendReservationConfirmationEmail } from "../utils/sendTransactionalEmails.js";

export const createBooking = async(req,res) => {
    try {

        const { id } = req.user
        const { name, phone, numberOfPeople, date, time, note, email } = req.body

        if(!name || !phone || !numberOfPeople || !date || !time || !note || !email) {
            return res.status(400).json({ message: "All fields are required", success: false })
        }
        
        // check for overlapping Booking
        const existingBooking = await BookingTable.findOne({
            date, time,
            status: { $ne: "Cancelled" },
        })

        if(existingBooking) {
            return res.status(400).json({ message: "This time slot is already Booked", success: false })
        }

        const booking = await BookingTable.create({
            user: id,
            name,
            phone,
            numberOfPeople,
            date,
            time,
            note, email
        })

        let emailSent = false

        try {
        
            await sendReservationConfirmationEmail({
                customerName: booking.name,
                customerEmail: booking.email,
                numberOfPeople: booking.numberOfPeople,
                date: booking.date,
                time: booking.time,
                note: booking.note,
            })
        
            emailSent = true
        
        } catch (emailError) {
            console.log("Reservation confirmation email error:", emailError.message)
        }

        res.status(201).json({
            message: emailSent
                ? "Table booked successfully. Confirmation email sent."
                : "Table booked successfully, but confirmation email could not be sent right now.",
            success: true,
            booking,
            emailSent
        })

    } catch (error) {
        console.log("Error in Create Booking : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const getUserBookings = async(req,res) => {
    try {
        
        const { id } = req.user
        const bookings = await BookingTable.find({ user: id }).sort({ createdAt: -1 })

        res.status(200).json({ message: "Get User Bookings", success: true, bookings })

    } catch (error) {
        console.log("Error in Get User Bookings : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const getAllBookings = async(req,res) => {
    try {

        const bookings = await BookingTable.find().populate("user", "username email")

        res.status(200).json({ message: "Get All Booking", success: true, bookings })
        
    } catch (error) {
        console.log("Error in Get All Bookings : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const updateBookingStatus = async(req,res) => {
    try {

        const { bookingId } = req.params
        const { status } = req.body

        const booking = await BookingTable.findById(bookingId)

        if(!booking) {
            return res.status(404).json({ message: "Booking not found", success: false })
        }

        booking.status = status

        await booking.save()

        res.status(200).json({ message: "Booking Status Updated", success: true, booking })
        
    } catch (error) {
        console.log("Error in Update Bookings : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}