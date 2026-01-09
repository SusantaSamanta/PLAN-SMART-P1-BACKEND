import nodemailer from 'nodemailer'

//Transporter using SMTP
// const transporter = nodemailer.createTransport({
//     host: 'smtp-relay.brevo.com',
//     port: 587,
//     auth:{
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//     }
// })

//Transporter using GoogleAuth
const transporter = nodemailer.createTransport({
    services: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export default transporter;