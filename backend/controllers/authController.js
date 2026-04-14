import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Generetae JWT Token
const generateToken = (res, payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.cookie('token', token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: 'strict',
        maxAge: 24*60*60*1000 
    })

    return token
}

// Register User
export const handleCreateNewUser = async(req,res) => {
    try {
        
        const { username, email, password } = req.body

        if(!username || !email || !password) {
            return res.json({ message: "Please fill all the fields", success: false})
        }

        const existingUser = await User.findOne({email})

        if(existingUser) {
            return res.json({ message: "User already exist", success: false })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({username, email, password: hashedPassword})

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
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24*60*60*1000
        })

        return res.json({ message: "Admin logged in successfully", success: true})

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
