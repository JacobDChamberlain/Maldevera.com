const express = require('express');
const cors = require('cors');
const { sequelize, Item } = require('./models');
const http = require('http'); // Required to integrate WebSocket
const { Server } = require('socket.io'); // Socket.io for WebSocket support
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
        origin: process.env.FRONTEND_URL, // Replace with your frontend URL
        methods: ['GET', 'POST'], // Allowed HTTP methods
    },
});


// WebSocket logic
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle incoming messages (example event)
    socket.on('message', (msg) => {
        console.log('Message received:', msg);

        // Broadcast message to all connected clients
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
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
    console.log(`Backend server running, dont question it b`);
});
