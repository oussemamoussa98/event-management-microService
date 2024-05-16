const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity_available: {
    type: Number,
    required: true
  }
});

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;
