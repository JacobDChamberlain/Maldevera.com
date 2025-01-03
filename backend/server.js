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
app.use(cors());

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/login', loginRoutes);

// Create HTTP server and integrate with WebSocket
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            const allowedOrigins = ['https://maldevera.com', 'https://www.maldevera.com', 'http://localhost:3000'];
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST'],
    },
});

// WebSocket logic
const connectedUsers = {}; // Store user IDs and associated sockets

io.on('connection', (socket) => {
    const userId = uuidv4(); // Generate a unique ID for the user
    connectedUsers[socket.id] = userId;

    console.log(`User connected: ${userId}`);
    io.emit('onlineUsers', Object.keys(connectedUsers).length); // Broadcast the user count

    socket.on('message', (msg) => {
        // Broadcast the message with the sender's ID
        io.emit('message', { userId: connectedUsers[socket.id], msg });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${connectedUsers[socket.id]}`);
        delete connectedUsers[socket.id];
        io.emit('onlineUsers', Object.keys(connectedUsers).length); // Broadcast the updated user count
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
