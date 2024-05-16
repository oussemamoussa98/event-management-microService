Microservices Documentation : 

This documentation provides an overview of the Event Management 
System microservices, their data schemas, entry points, and interactions. 
Microservice: EventService The EventService microservice handles events 
within the system, allowing users to manage events, their details, and 
ticket prices. 

Data Schemas  

The EventService microservice utilizes the following data schema:  
Event: Represents an event in the system. The schema includes the 
following fields: 

• id (string): Unique identifier of the event.  
• name (string): Name of the event. 
• description (string): Description of the event.  
• location (string): Location where the event will take place.  
• date (string): Date of the event.  
• ticket_price (float): Price of tickets for the event.  

Entry Points  

The EventService microservice exposes the following entry points to 
interact with events:  

• getEvent: Retrieves the details of a specific event by providing the event identifier.  
• getAllEvents: Retrieves the list of all available events.  
• createEvent: Allows creating a new event by providing the event information.  
• deleteEvent: Deletes a specific event by providing its identifier. 

Interactions 

The EventService microservice can be interacted with through gRPC. 
It provides the following methods:  

• GetEvent: Retrieves the details of a specific event.  
• GetAllEvents: Retrieves all events available in the system.  
• CreateEvent: Allows the creation of a new event.  
• DeleteEvent: Deletes a specific event from the system.  

Microservice: TicketService  

The TicketService microservice manages tickets associated with 
events, including ticket availability and pricing. 

Data Schemas  

The TicketService microservice utilizes the following data schema:  
Ticket: Represents a ticket for an event. The schema includes the 
following fields:  

• id (string): Unique identifier of the ticket.  
• event_id (string): Identifier of the associated event.  
• name (string): Name of the ticket.  
• price (float): Price of the ticket.  
• quantity_available (integer): Quantity of tickets available for purchase. 

Entry Points  

The TicketService microservice exposes the following entry points to 
interact with tickets:  

• getTicket: Retrieves the details of a specific ticket by providing the ticket identifier.  
• getAllTickets: Retrieves the list of all available tickets.  
• createTicket: Allows creating a new ticket by providing the ticket information.  
• deleteTicket: Deletes a specific ticket by providing its identifier.  

Interactions  

The TicketService microservice can be interacted with through gRPC. 
It provides the following methods:  

• GetTicket: Retrieves the details of a specific ticket.  
• GetAllTickets: Retrieves all tickets available in the system.  
• CreateTicket: Allows the creation of a new ticket.  
• DeleteTicket: Deletes a specific ticket from the system. 
