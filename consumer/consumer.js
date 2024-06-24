const nodemailer = require('nodemailer');
const connectRabbitMQ = require('../rabbitmq');
require('dotenv').config(); 
async function receiveEmailFromQueue() {
    const channel = await connectRabbitMQ();
    const queue = 'email_queue';

    await channel.assertQueue(queue, { durable: false });
    console.log(queue);

    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const { email } = JSON.parse(msg.content.toString());
            console.log("Received:", email);

            await sendEmail(email);
            channel.ack(msg);
        }
    });
}

async function sendEmail(email) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.EMAIL_PASSWORD 
        }
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Verification Email',
        text: 'Please verify your email address.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
}

receiveEmailFromQueue();
