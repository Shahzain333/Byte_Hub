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
const hasRequiredMailConfig = () => requiredMailEnv.every((key) => Boolean(process.env[key]))

const getFromEmail = () => process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || process.env.ADMIN_EMAIL

export const sendContactConfirmationEmail = async ({ name, email, phone, subject, message }) => {
    
    if (!hasRequiredMailConfig()) {
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

export const sendReservationStatusEmail = async ({
    customerName,
    customerEmail,
    numberOfPeople,
    date,
    time,
    note,
    status,
}) => {

    if (!hasRequiredMailConfig()) {
        throw new Error("Mail configuration is missing in environment variables")
    }

    const fromEmail = getFromEmail()

    const statusConfig = {
        Approved: {
            subject: "Your Reservation is Confirmed!",
            heading: "Reservation Confirmed",
            bodyLine: `Great news, ${customerName}! Your table reservation has been <strong>confirmed</strong>. We look forward to welcoming you.`,
            footerLine: "See you soon!",
        },
        Cancelled: {
            subject: "Your Reservation has been Cancelled",
            heading: "Reservation Cancelled",
            bodyLine: `Hi ${customerName}, unfortunately your table reservation has been <strong>cancelled</strong>. Please contact us if you have any questions or would like to make a new booking.`,
            footerLine: "We hope to serve you another time.",
        },
        Pending: {
            subject: "Your Reservation is Pending",
            heading: "Reservation Pending",
            bodyLine: `Hi ${customerName}, your reservation is currently <strong>pending</strong> review. We will notify you once it is confirmed.`,
            footerLine: "Thank you for your patience.",
        },
    }

    const config = statusConfig[status] || {
        subject: `Reservation Status Update: ${status}`,
        heading: "Reservation Update",
        bodyLine: `Hi ${customerName}, your reservation status has been updated to <strong>${status}</strong>.`,
        footerLine: "Thank you.",
    }

    await transporter.sendMail({
        from: fromEmail,
        to: customerEmail,
        subject: config.subject,
        html: `
            <h2>${config.heading}</h2>
            <p>${config.bodyLine}</p>
            <hr />
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Guests:</strong> ${numberOfPeople}</p>
            <p><strong>Note:</strong> ${note || "N/A"}</p>
            <hr />
            <p>${config.footerLine}</p>
        `,
    })
}

export const sendOrderStatusEmail = async ({
    customerName,
    customerEmail,
    orderId,
    totalAmount,
    paymentMethod,
    address,
    status,
}) => {

    if (!hasRequiredMailConfig()) {
        throw new Error("Mail configuration is missing in environment variables")
    }

    const fromEmail = getFromEmail()

    const statusConfig = {
        Pending: {
            subject: "Your Order is Pending",
            heading: "Order Pending",
            bodyLine: `Hi ${customerName}, your order is currently <strong>pending</strong> review. We will notify you once it is approved.`,
            footerLine: "Thank you for your patience.",
        },
        Preparing: {
            subject: "Your Order is Being Prepared! 👨‍🍳",
            heading: "Order Being Prepared",
            bodyLine: `Hi ${customerName}, great news! Your order is currently being <strong>prepared</strong> by our kitchen. Sit tight, it will be on its way soon.`,
            footerLine: "We're cooking something delicious for you!",
        },
        Delivered: {
            subject: "Your Order has been Delivered!",
            heading: "Order Delivered",
            bodyLine: `Hi ${customerName}, your order has been <strong>delivered</strong>. We hope you enjoy your meal!`,
            footerLine: "Thank you for choosing us. We'd love to see you again!",
        },
    }

    const config = statusConfig[status] || {
        subject: `Order Status Update: ${status}`,
        heading: "Order Update",
        bodyLine: `Hi ${customerName}, your order status has been updated to <strong>${status}</strong>.`,
        footerLine: "Thank you.",
    }

    await transporter.sendMail({
        from: fromEmail,
        to: customerEmail,
        subject: config.subject,
        html: `
            <h2>${config.heading}</h2>
            <p>${config.bodyLine}</p>
            <hr />
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Total Amount:</strong> ${totalAmount}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Delivery Address:</strong> ${address}</p>
            <hr />
            <p>${config.footerLine}</p>
        `,
    })
}