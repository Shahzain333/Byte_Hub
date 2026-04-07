import jwt from 'jsonwebtoken'

export const protect = (req,res,next) => {
    
    const token = req.cookies.token

    if(!token) {
        return res.status(401).json({ message: "Not Authorized", success: false })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" })
    }
}

export const adminOnly = (req,res,next) => {
    
    const token = req.cookies.token

    if(!token) {
        return res.status(401).json({ message: "Not Authorized Admin", success: false })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.admin = decoded
        if(req.admin.email === process.env.ADMIN_EMAIL ) {
            next()
        } 
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" })
    }

}