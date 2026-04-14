import express from 'express'
import { handleAdminLogin, handleUserLogin, handleUserLogout, handleCreateNewUser, handleGetProfile, handleIsAuth } 
from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'

const authRoutes = express.Router()

authRoutes.post('/register', handleCreateNewUser)
authRoutes.post('/login', handleUserLogin)
authRoutes.post('/logout', handleUserLogout)
authRoutes.post('/admin/login', handleAdminLogin)
authRoutes.get('/profile', protect, handleGetProfile)
authRoutes.get('/is-auth', protect, handleIsAuth)

export default authRoutes