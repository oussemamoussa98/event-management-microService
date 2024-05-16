const { ApolloError } = require('apollo-server-express');
const Event = require('./models/Event'); // Import the Mongoose Event model
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


// Load proto files for events
const eventProtoPath = 'event.proto';
const eventProtoDefinition = protoLoader.loadSync(eventProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const eventProto = grpc.loadPackageDefinition(eventProtoDefinition).event;

// Define the resolvers for GraphQL queries
const resolvers = {
    Query: {
        event: (_, { id }) => {
            const client = new eventProto.EventService('localhost:50052', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.GetEvent({ event_id: id }, (err, response) => {
                    if (err) {
                        console.error('Error in GetEvent:', err);
                        reject(new ApolloError('Failed to fetch event'));
                    } else {
                        resolve(response.event);
                    }
                });
            });
        },
        events: () => {
            const client = new eventProto.EventService('localhost:50052', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.GetAllEvents({}, (err, response) => {
                    if (err) {
                        console.error('Error in GetAllEvents:', err);
                        reject(new ApolloError('Failed to fetch events'));
                    } else {
                        resolve(response.events);
                    }
                });
            });
        }
    },
    Mutation: {
        createEvent: async (_, { name, description, location, date, ticket_price }) => {
            try {
                // Create a new instance of the Event model
                const newEvent = new Event({ name, description, location, date, ticket_price });
                // Save the new event to the database
                await newEvent.save();
                // Return the newly created event
                return newEvent;
            } catch (error) {
                // Throw an ApolloError if there's an error
                throw new ApolloError(`Error creating event: ${error.message}`, "INTERNAL_ERROR");
            }
        }
    }
};

module.exports = resolvers;
