const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'event-management-consumer',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'event-management-group' });

const consumeMessages = async () => {
  try {
    // Connect the consumer to the Kafka broker
    await consumer.connect();
    console.log('Consumer connected to Kafka broker.');

    // Subscribe to the specified topic
    await consumer.subscribe({ topic: 'evenement', fromBeginning: true });
    console.log('Consumer subscribed to topic: evenement');

    // Start consuming messages from the topic
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message: ${message.value.toString()}`);
        // Additional logic to process message
      },
    });
  } catch (error) {
    console.error('Failed to start Kafka Consumer:', error.message);
    process.exit(1); // Exit the process with a non-zero exit code to indicate failure
  }
};

module.exports = { consumeMessages };
