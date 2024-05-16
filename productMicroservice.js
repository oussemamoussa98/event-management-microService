  // productMicroservice.js

  const grpc = require('@grpc/grpc-js');
  const protoLoader = require('@grpc/proto-loader');
  const connectDB = require('./db');
  const Event = require('./models/Event');

  // Load the event.proto file
  const eventProtoPath = 'event.proto';
  const eventProtoDefinition = protoLoader.loadSync(eventProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
  const eventProto = grpc.loadPackageDefinition(eventProtoDefinition).event;

  // Implement the EventService
  const eventService = {
    getEvent: async (call, callback) => {
      try {
        const event = await Event.findById(call.request.event_id);
        if (!event) {
          throw new Error('Event not found');
        }
        callback(null, { event });
      } catch (error) {
        console.error('Error fetching event:', error);
        callback(error);
      }
    },
    getAllEvents: async (call, callback) => {
      try {
        const events = await Event.find();
        callback(null, { events });
      } catch (error) {
        console.error('Error fetching events:', error);
        callback(error);
      }
    },
    createEvent: async (call, callback) => {
      const { name, description, location, date, ticket_price } = call.request;
      try {
        // Create a new event instance
        const event = new Event({ name, description, location, date, ticket_price });
        // Save the event asynchronously
        const savedEvent = await event.save();
        // Assuming 'id' is the unique identifier for the event in your database
        const response = { event_id: savedEvent.event_id};
        callback(null, { event });
      } catch (error) {
        console.error('Error creating event:', error);
        callback(error);
      }
    },
    deleteEvent: async (call, callback) => {
      try {
          const { event_id } = call.request;
          // Delete the event from the database
          await Event.findByIdAndDelete(event_id);
          callback(null, { message: 'Event deleted successfully' });
      } catch (error) {
          console.error('Error deleting event:', error);
          callback(error);
      }
  }

    
    
  };

  // Create and start the gRPC server
  const server = new grpc.Server();
  server.addService(eventProto.EventService.service, eventService);
  const port = 50052;
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error('Failed to bind server:', err);
        return;
      }
      console.log(`Event microservice running on port ${port}`);
      server.start();
    });

  // Connect to MongoDB
  connectDB();
