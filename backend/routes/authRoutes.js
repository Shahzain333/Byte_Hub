import express from 'express'
import { handleAdminLogin, handleUserLogin, handleUserLogout, handleCreateNewUser } 
from '../controllers/authController.js'

const authRoutes = express.Router()

authRoutes.post('/register', handleCreateNewUser)
authRoutes.post('/login', handleUserLogin)
authRoutes.post('/logout', handleUserLogout)
authRoutes.post('/admin/login', handleAdminLogin)

export default authRoutes