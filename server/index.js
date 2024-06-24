const express = require('express');
const bodyParser = require('body-parser');
const connectRabbitMQ = require('../rabbitmq');

const app = express();
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required');
    }

    const channel = await connectRabbitMQ();
    const queue = 'email_queue';

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ email })));

    console.log("Sent to queue:", email);

    res.send('Registration successful. A verification email has been sent.');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
