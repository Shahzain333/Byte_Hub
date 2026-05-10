import express from 'express'
import { handleAdminLogin, handleUserLogin, handleUserLogout, handleCreateNewUser, handleGetProfile, handleIsAuth, 
    handleIsAuthAdmin, handleForgotPassword, handleVerifyOtp, handleResetPassword } 
from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'
import upload from '../middlewares/multer.js'

const authRoutes = express.Router()

authRoutes.post('/register', upload.single('image'), handleCreateNewUser)
authRoutes.post('/login', handleUserLogin)
authRoutes.post('/logout', protect, handleUserLogout)
authRoutes.post('/admin/login', handleAdminLogin)

authRoutes.get('/profile', protect, handleGetProfile)
authRoutes.get('/is-auth', protect, handleIsAuth)
authRoutes.get('/is-admin', protect, handleIsAuthAdmin)

authRoutes.post('/forgot-password', handleForgotPassword)
authRoutes.post('/verify-otp', handleVerifyOtp)
authRoutes.post('/reset-password', handleResetPassword)

export default authRoutes