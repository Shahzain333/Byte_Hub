import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary'
import { sendOtpEmail } from '../utils/sendTransactionalEmails.js'
import crypto from 'node:crypto'

// Generetae JWT Token
const generateToken = (res, payload) => {
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })
    
    res.cookie('token', token, { 
        httpOnly: true,
        secure: true, 
        sameSite: 'none',
        maxAge: 24*60*60*1000 
    })

    return token
}

// Register User
export const handleCreateNewUser = async(req,res) => {
    try {
        
        const { username, email, password, confirmPassword } = req.body

        if(!username || !email || !password || !confirmPassword) {
            return res.json({ message: "Please fill all the fields", success: false})
        }

        let imageUrl = null
        
        if(req.file?.path) {
            const result = await cloudinary.uploader.upload(req.file.path)
            imageUrl = result.secure_url
        }

        const existingUser = await User.findOne({ email })

        if(existingUser) {
            return res.json({ message: "User already exist", success: false })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10)

        const user = await User.create({
            username, 
            email, 
            password: hashedPassword,
            confirmPassword: hashedConfirmPassword,
            image: imageUrl
        })

        return res.json({ message: "User registered successfully", success: true })

    } catch (error) {
        console.log("Error in HandleCreateNewUser : ",error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

// Login User
export const handleUserLogin = async(req,res) => {
    try {
        const { email, password } = req.body
        
        if(!email || !password) {
            return res.json({ message: "Please fill all the fields", success: false })
        }

        const user = await User.findOne({email})

        if(!user) {
            return res.json({ message: "User does not exist", success: false })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.json({ message: "Invalid Credentials", success: false })
        }

        generateToken(res,{ id: user._id, role: user.isAdmin ? "admin" : "user" })

        return res.json({ message: "User logged in successfully", success: true, user: {
            username: user.username,
            email: user.email
        } })


    } catch (error) {
        console.log("Error in HandleLoginUser : ",error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

// Logout User
export const handleUserLogout = async(req,res) => {
    try {
        res.clearCookie("token")
        return res.json({ message: "User logged out successfully", success: true })
    } catch (error) {
        console.log("Error in HandleLogoutUser : ",error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

// Admin Login
export const handleAdminLogin = async(req,res) => {
    try {

        const { email, password } = req.body

        if(!email || !password) {
            return res.json({ message: "Please fill all the fields", success: false })
        }

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if(email !== adminEmail || password !== adminPassword) {
            return res.json({ message: "Invalid Credentials", success: false })
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24*60*60*1000
        })

        return res.json({ 
            success: true,
            message: "Admin logged in successfully", 
            admin: {
                admin: adminEmail
            },
        })

    } catch (error) {
        console.log("Error in HandleAdminLoginUser : ",error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const handleGetProfile = async(req,res) => {
    try {

        const { id } = req.user
        const user = await User.findById(id).select("-password")

        if(!user) {
            return res.status(404).json({ message: "User not found", success: false })
        }

        res.json(user)

    } catch (error) {
        console.log("Error in HandleGetProfileUser : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const handleIsAuth = async(req,res) => {
    try {

        const { id } = req.user

        const user = await User.findById(id).select("-password")

        res.json({
            success: true,
            user
        })

    } catch (error) {
        console.log("Error in isAuth : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const handleIsAuthAdmin = async(req,res) => {
    try {

        const { email } = req.user

        if (email !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: "Not authorized Admin" })
        }

        res.json({ success: true })

    } catch (error) {
        console.log("Error in isAdmin : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

// Step 1 -- If User Forgot Password
export const handleForgotPassword = async(req,res) => {
    try {
        
        const { email } = req.body

        if(!email) {
            return res.json({ message: "Email is required", success: false })
        }

        const user = await User.findOne({ email })

        if(!user) {
            // Return success anyway to avoid email enumeration
            return res.json({ message: "If this email exists, an OTP has been sent", success: true })
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString()
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

        user.resetOtp = otp
        user.resetOtpExpiry = otpExpiry

        await user.save()

        await sendOtpEmail({ name: user.username, email: user.email, otp })

        return res.json({ message: "OTP sent to your email", success: true })

    } catch (error) {
        console.log("Error in Handle Forgot Password : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

// Step 2 -- Verify OTP
export const handleVerifyOtp = async(req,res) => {
    try {

        const { email, otp } = req.body

        if(!email, !otp) {
            return res.json({ message: "Email and OTP are required", success: false })
        }

        const user = await User.findOne({ email })

        if (!user || !user.resetOtp || !user.resetOtpExpiry) {
            return res.json({ message: "Invalid or expired OTP", success: false })
        }

        // Check expiry
        if(new Date() > user.resetOtpExpiry) {
            user.resetOtp = null
            user.resetOtpExpiry = null
            await user.save()
            return res.json({ message: "OTP has expired, please request a new one", success: false })
        }

        // check match
        if(user.resetOtp !== otp) {
            return res.json({ message: "Incorrect OTP", success: false })
        }

        return res.json({ message: "OTP verified successfully", success: true })
    
    } catch (error) {
        console.log("Error in handle Verify Otp:", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

// Step 3 — Reset Password
export const handleResetPassword = async(req,res) => {
    try {
        
        const { email, otp, newPassword, confirmPassword  } = req.body

        if (!email || !otp || !newPassword || !confirmPassword ) {
            return res.json({ message: "All fields are required", success: false })
        }

        if (newPassword !== confirmPassword ) {
            return res.json({ message: "Passwords do not match", success: false })
        }

        const user = await User.findOne({ email })

        if (!user || !user.resetOtp || !user.resetOtpExpiry) {
            return res.json({ message: "Invalid or expired OTP", success: false })
        }

        // Re-verify OTP expiry and match (don't trust client)
        if (new Date() > user.resetOtpExpiry) {
            user.resetOtp = null
            user.resetOtpExpiry = null
            await user.save()
            return res.json({ message: "OTP has expired, please request a new one", success: false })
        }

        if (user.resetOtp !== otp) {
            return res.json({ message: "Invalid OTP", success: false })
        }

        // Update password and clear OTP
        user.password = await bcrypt.hash(newPassword, 10)
        user.confirmPassword = await bcrypt.hash(confirmPassword , 10)
        user.resetOtp = null
        user.resetOtpExpiry = null
        await user.save()

        return res.json({ message: "Password reset successfully", success: true })

    } catch (error) {
        console.log("Error in handle Reset Password:", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}