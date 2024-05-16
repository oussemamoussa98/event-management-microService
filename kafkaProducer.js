const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'event-management-producer',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
};

const sendMessage = async (topic, eventData) => {
  try {
    const message = {
      value: JSON.stringify(eventData),
    };
    await producer.send({
      topic,
      messages: [message],
    });
    console.log(`Message sent to topic ${topic}: ${JSON.stringify(eventData)}`);
  } catch (error) {
    console.error(`Error sending message to topic ${topic}:`, error);
  }
};

module.exports = { connectProducer, sendMessage };
