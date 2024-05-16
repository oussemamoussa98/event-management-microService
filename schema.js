const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Event {
    id: ID!
    name: String!
    description: String
    location: String!
    date: String!
    ticket_price: Float!
  }

  type Ticket {
    id: ID!
    event_id: ID!
    name: String!
    price: Float!
    quantity_available: Int!
  }

  type Query {
    events: [Event!]
    event(id: ID!): Event
    tickets: [Ticket!]
    ticket(id: ID!): Ticket
  }

  type Mutation {
    createEvent(
      name: String!
      description: String!
      location: String!
      date: String!
      ticket_price: Float!
    ): Event!

    createTicket(
      event_id: ID!
      name: String!
      price: Float!
      quantity_available: Int!
    ): Ticket!
  }
`;

module.exports = typeDefs;
