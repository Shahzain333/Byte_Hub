import Contact from "../models/contact.js"
import { sendContactConfirmationEmail } from "../utils/sendContactConfirmationEmail.js"

export const createContact = async (req, res) => {
    try {
        
        const userId = req.user?.id || null
        const { name, email, phone, subject, message } = req.body

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All required fields are missing", success: false })
        }

        const contact = await Contact.create({
            user: userId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone?.trim() || "",
            subject: subject.trim(),
            message: message.trim(),
        })

        let emailSent = false

        try {
            await sendContactConfirmationEmail({
                name: contact.name,
                email: contact.email,
                subject: contact.subject
            })
            emailSent = true
        } catch (emailError) {
            console.log("Contact confirmation email error:", emailError.message)
        }

        return res.status(201).json({
            message: "Message sent successfully",
            success: true,
            contact,
            emailSent
        })

    } catch (error) {
        console.log("Error in createContact:", error.message)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

export const getAllContacts = async (req, res) => {
    try {

        const contacts = await Contact.find().populate("user", "username email").sort({ createdAt: -1 })
        
        return res.status(200).json({
            message: "Contacts fetched successfully",
            success: true,
            contacts
        })
    
    } catch (error) {
        console.log("Error in getAllContacts:", error.message)
        return res.status(500).json({ message: "Internal server error", success: false })
    }

}
