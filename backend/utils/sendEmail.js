import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        },
    });


    //Send email with defined transport object
    const message = {
        from: `${process.env.SMTP_EMAIL} <${process.env.SMTP_NAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
