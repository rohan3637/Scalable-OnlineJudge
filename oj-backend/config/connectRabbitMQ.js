const amqp = require('amqplib');

const rabbitMQUrl = 'amqp://rabbitmq';

const setupRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue('submission-queue', { durable: true });
    await channel.assertQueue('userInput-queue', {durable: true});
    await channel.assertQueue('response-queue', { durable: true });
    await channel.assertQueue('ui-response-queue', {durable: true});

    return channel;
  } catch (error) {
    console.error('Error setting up RabbitMQ:', error);
    throw error;
  }
};

module.exports = { setupRabbitMQ };


