import express from 'express'
import { protect, adminOnly } from '../middlewares/authMiddleware.js'
import { createContact, getAllContacts } from '../controllers/contactController.js'

const contactRoutes = express.Router()

contactRoutes.post('/create', protect, createContact)
contactRoutes.get('/all', adminOnly, getAllContacts)

export default contactRoutes
