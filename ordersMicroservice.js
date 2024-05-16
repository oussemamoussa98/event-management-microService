const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const connectDB = require('./db');
const Ticket = require('./models/Ticket');

// Load the ticket.proto file
const ticketProtoPath = 'ticket.proto';
const ticketProtoDefinition = protoLoader.loadSync(ticketProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const ticketProto = grpc.loadPackageDefinition(ticketProtoDefinition).ticket;

// Implement the TicketService
const ticketService = {
    getTicket: async (call, callback) => {
        try {
            const ticket = await Ticket.findById(call.request.ticket_id);
            if (!ticket) {
                throw new Error('Ticket not found');
            }
            callback(null, { ticket });
        } catch (error) {
            console.error('Error fetching ticket:', error);
            callback(error);
        }
    },
    getAllTickets: async (call, callback) => {
        try {
            const tickets = await Ticket.find();
            callback(null, { tickets });
        } catch (error) {
            console.error('Error fetching tickets:', error);
            callback(error);
        }
    },
    createTicket: async (call, callback) => {
        const { event_id, name, price, quantity_available } = call.request;
        try {
            const ticket = new Ticket({ event_id, name, price, quantity_available });
            
            const savedTicket = await ticket.save();
            
            const response = { id: savedTicket.id };
            callback(null, { ticket });
        } catch (error) {
            console.error('Error creating ticket:', error);
            callback(error);
        }
    },

    deleteTicket: async (call, callback) => {
        try {
            const ticketId = call.request.ticket_id;
            const deletedTicket = await Ticket.findByIdAndDelete(ticketId);
            if (!deletedTicket) {
                throw new Error('Ticket not found');
            }
            callback(null, { message: 'Ticket deleted successfully' });
        } catch (error) {
            console.error('Error deleting ticket:', error);
            callback(error);
        }
    },
};

// Create and start the gRPC server
const server = new grpc.Server();
server.addService(ticketProto.TicketService.service, ticketService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error('Failed to bind server:', err);
            return;
        }
        console.log(`Ticket microservice running on port ${port}`);
        server.start();
    });

// Connect to MongoDB
connectDB();
