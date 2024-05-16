const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { resolvers } = require('./resolver');
const typeDefs = require('./schema');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const connectDB = require('./db');
const { connectProducer, sendMessage } = require('./kafkaProducer');
const { consumeMessages } = require('./kafkaConsumer');

// Load proto files for events and tickets
const eventProtoPath = 'event.proto';
const ticketProtoPath = 'ticket.proto';

// Load and configure gRPC proto definitions
const ticketProtoDefinition = protoLoader.loadSync(ticketProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const eventProtoDefinition = protoLoader.loadSync(eventProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const ticketProto = grpc.loadPackageDefinition(ticketProtoDefinition).ticket;
const eventProto = grpc.loadPackageDefinition(eventProtoDefinition).event;

// Define gRPC clients
const ticketServiceClient = new ticketProto.TicketService('localhost:50051', grpc.credentials.createInsecure());
const eventServiceClient = new eventProto.EventService('localhost:50052', grpc.credentials.createInsecure());

// Connect to MongoDB
connectDB();

// Create Express application
const app = express();

// Enable CORS and JSON body parser middleware
app.use(cors());
app.use(express.json());

// Define RESTful endpoints for tickets
app.get('/tickets', (req, res) => {
  ticketServiceClient.getAllTickets({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.tickets);
    }
  });
});

app.get('/tickets/:id', (req, res) => {
  const id = req.params.id;
  ticketServiceClient.getTicket({ ticket_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.ticket);
    }
  });
});

app.post('/tickets', (req, res) => {
  const { event_id, name, price, quantity_available } = req.body; 
  ticketServiceClient.createTicket({ event_id, name, price, quantity_available }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.ticket);
    }
  });
});

app.delete('/tickets/:id', (req, res) => {
  const id = req.params.id;
  ticketServiceClient.deleteTicket({ ticket_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: 'Ticket deleted successfully' });
    }
  });
});

// Define RESTful endpoints for events
app.get('/events/:id', (req, res) => {
  const id = req.params.id;
  eventServiceClient.GetEvent({ event_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.event);
    }
  });
});

app.get('/events', (req, res) => {
  eventServiceClient.GetAllEvents({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.events);
    }
  });
});

app.post('/events', (req, res) => {
  const { name, description, location, date, ticket_price } = req.body;
  eventServiceClient.CreateEvent({ name, description, location, date, ticket_price }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.event);
    }
  });
});

app.delete('/events/:id', (req, res) => {
  const id = req.params.id;
  eventServiceClient.deleteEvent({ event_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response);
    }
  });
});

// Start the Apollo Server and Express application
async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  await connectProducer(); // Connect Kafka producer
  await consumeMessages(); // Start consuming Kafka messages

  const port = 3002;
  app.listen(port, () => {
    console.log(`API Gateway running on port ${port}`);
    console.log(`GraphQL endpoint available at http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer();
