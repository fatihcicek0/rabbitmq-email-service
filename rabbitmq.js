const amqp = require('amqplib');

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://rabbitmq');
        const channel = await connection.createChannel();
        console.log("Connected to RabbitMQ");
        return channel;
    } catch (error) {
        console.error("Failed to connect to RabbitMQ", error);
    }
}

module.exports = connectRabbitMQ;
