import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

const requiredMailEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"]

const hasRequiredMailConfig = requiredMailEnv.every((key) => Boolean(process.env[key]))

export const sendContactConfirmationEmail = async ({ name, email, phone, subject, message }) => {
    
    if (!hasRequiredMailConfig) {
        throw new Error("Mail configuration is missing in environment variables")
    }

    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || process.env.ADMIN_EMAIL 
    const safePhone = phone || "Not provided"

    // Send the submitted contact details to restaurant inbox Admin.
    await transporter.sendMail({
        from: `"${name}" <${fromEmail}>`, // your verified SMTP sender
        to: fromEmail,                    // admin inbox
        replyTo: email,                   // user's email
        subject: `New contact form message: ${subject}`,
        html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${safePhone}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
    })

    // Send acknowledgement email to user.
    await transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: "We received your message",
        html: `
            <h2>Thanks for contacting us, ${name}!</h2>
            <p>We received your message and will respond soon.</p>
            <p><strong>Your subject:</strong> ${subject}</p>
            <p><strong>Your message:</strong> ${message}</p>
        `,
    })
}
