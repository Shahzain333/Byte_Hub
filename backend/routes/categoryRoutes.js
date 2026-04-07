import express from 'express'
import { addCategory, deleteCategory, getAllCategory, updateCategory } from '../controllers/categoryController.js'
import { adminOnly } from '../middlewares/authMiddleware.js'
import upload from '../middlewares/multer.js'

const categoryRoutes = express.Router()

categoryRoutes.post('/add', adminOnly, upload.single("image"), addCategory)
categoryRoutes.put('/update/:id', adminOnly, upload.single("image"), updateCategory)
categoryRoutes.delete('/delete/:id', adminOnly, deleteCategory)
categoryRoutes.get('/all', getAllCategory)

export default categoryRoutes