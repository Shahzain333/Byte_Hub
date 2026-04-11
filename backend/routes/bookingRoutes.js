import express from 'express'
import { protect, adminOnly } from '../middlewares/authMiddleware.js'
import { createBooking, getAllBookings, getUserBookings, updateBookingStatus } from '../controllers/bookingController.js'

const bookingRoutes = express.Router()

bookingRoutes.post('/create', protect, createBooking)
bookingRoutes.get('/my-bookings', protect, getUserBookings)
bookingRoutes.get('/bookings', adminOnly, getAllBookings)
bookingRoutes.put('/update-status/:bookingId', adminOnly, updateBookingStatus)

export default bookingRoutes