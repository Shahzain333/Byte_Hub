import express from 'express'
import { adminOnly, protect } from '../middlewares/authMiddleware.js'
import { createContact, getAllContacts } from '../controllers/contactController.js'

const contactRoutes = express.Router()

contactRoutes.post('/create', createContact)
contactRoutes.get('/all', adminOnly, getAllContacts)

export default contactRoutes
