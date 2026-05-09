import express from 'express'
import { handleAdminLogin, handleUserLogin, handleUserLogout, handleCreateNewUser, handleGetProfile, handleIsAuth, handleIsAuthAdmin } 
from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'
import upload from '../middlewares/multer.js'

const authRoutes = express.Router()

authRoutes.post('/register', upload.single('image'), handleCreateNewUser)
authRoutes.post('/login', handleUserLogin)
authRoutes.post('/logout', handleUserLogout)
authRoutes.post('/admin/login', handleAdminLogin)
authRoutes.get('/profile', protect, handleGetProfile)
authRoutes.get('/is-auth', protect, handleIsAuth)
authRoutes.get('/is-admin', protect, handleIsAuthAdmin)

export default authRoutes