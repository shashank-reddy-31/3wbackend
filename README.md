This command will start the server on http://localhost:3000.
User Model
username: String, required, unique
room: String, required
Room Model
name: String, required, unique
users: Array of User references
Message Model
sender: User reference
room: Room reference
content: String, required
timestamp: Date, default to current date
Work Process
Server Setup:
Install and configure Express to serve the application.
Integrate Socket.io for handling real-time communication.
Socket.io Functionality:

Establish a socket connection to manage events.
Implement event handlers for joining rooms, sending messages, typing notifications, and broadcasting online users.
Database Integration:

Set up MongoDB and create models for Users, Rooms, and Messages.
Implement functionality to save messages to the database and load chat history when users enter a room or engage in 1-to-1 chats.
Testing:

Test the application by opening multiple browser tabs to simulate different users.
Verify that users can join rooms, send messages, and see real-time updates.
