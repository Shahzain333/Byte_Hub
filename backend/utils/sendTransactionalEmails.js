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

const getFromEmail = () => process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || process.env.ADMIN_EMAIL

export const sendContactConfirmationEmail = async ({ name, email, phone, subject, message }) => {
    
    if (!hasRequiredMailConfig) {
        throw new Error("Mail configuration is missing in environment variables")
    }

    const fromEmail = getFromEmail()
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

export const sendReservationConfirmationEmail = async ({
    customerName,
    customerEmail,
    numberOfPeople,
    date,
    time,
    note,
}) => {
    
    if (!hasRequiredMailConfig) {
        throw new Error("Mail configuration is missing in environment variables")
    }

    const fromEmail = getFromEmail()

    await transporter.sendMail({
        from: fromEmail,
        to: customerEmail,
        subject: "Your table reservation is confirmed",
        html: `
            <h2>Reservation Confirmed</h2>
            <p>Hi ${customerName}, your reservation request has been received.</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Guests:</strong> ${numberOfPeople}</p>
            <p><strong>Note:</strong> ${note || "N/A"}</p>
            <p>We look forward to serving you.</p>
        `,
    })
}

export const sendOrderConfirmationEmail = async ({
    customerName,
    customerEmail,
    orderId,
    totalAmount,
    paymentMethod,
    address,
}) => {
    if (!hasRequiredMailConfig) {
        throw new Error("Mail configuration is missing in environment variables")
    }

    const fromEmail = getFromEmail()

    await transporter.sendMail({
        from: fromEmail,
        to: customerEmail,
        subject: "Your order has been placed successfully",
        html: `
            <h2>Order Confirmation</h2>
            <p>Hi ${customerName}, thanks for your order.</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Total Amount:</strong> ${totalAmount}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Delivery Address:</strong> ${address}</p>
            <p>We will start preparing your order shortly.</p>
        `,
    })
}
