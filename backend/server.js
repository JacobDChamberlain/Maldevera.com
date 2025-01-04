const express = require('express');
const cors = require('cors');
const { sequelize, Item } = require('./models');
const http = require('http'); // Required to integrate WebSocket
const { Server } = require('socket.io'); // Socket.io for WebSocket support
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = process.env.PORT || 5001;
require('dotenv').config();

const inventoryRoutes = require('./routes/inventory');
const checkoutRoutes = require('./routes/checkout');
const webhookRoutes = require('./routes/webhooks');
const loginRoutes = require('./routes/login');

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Frontend URL
        methods: ['GET', 'POST'],
    })
);

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/login', loginRoutes);

// Create HTTP server and integrate with WebSocket
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Frontend URL
        methods: ['GET', 'POST'],
    },
});

// WebSocket logic
const connectedUsers = {}; // Store user IDs and associated sockets

io.on('connection', (socket) => {
    const userId = uuidv4(); // Generate a unique ID for the user
    connectedUsers[socket.id] = userId;

    console.log(`User connected: ${userId}`);

    socket.on('message', (msg) => {
        // Broadcast the message with the sender's ID
        io.emit('message', { userId: connectedUsers[socket.id], msg });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${connectedUsers[socket.id]}`);
        delete connectedUsers[socket.id];
    });
});

// Start the server
server.listen(port, async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected! Fuck on!');
    } catch (error) {
        console.error('Unable to connect to the database, probably because you\'re a bitch, but here\'s an additional reason:', error);
    }
    console.log(`Backend server running, don't question it b`);
});
