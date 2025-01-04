const express = require('express');
const cors = require('cors');
const { sequelize, Item } = require('./models');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
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

    socket.on('message', async (msg) => {
        console.log(`Message received from ${userId}: ${msg}`);

        // Generate James Hetfield-style limerick
        const limerick = await generateHetfieldLimerick(msg);

        // Broadcast the original message and bot response
        io.emit('message', { userId: connectedUsers[socket.id], msg });
        io.emit('message', { userId: 'JamesHetfieldBot', msg: limerick });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${connectedUsers[socket.id]}`);
        delete connectedUsers[socket.id];
        io.emit('onlineUsers', Object.keys(connectedUsers).length); // Broadcast the updated user count
    });
});

// Function to fetch Hetfield-style limericks
async function generateHetfieldLimerick(input) {
    try {
        const prompt = `Write a limerick in the style of James Hetfield responding to: \"${input}\"`;
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo', // Correct model name
                messages: [
                    { role: 'system', content: 'You are James Hetfield. Always respond in limericks.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 100,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating limerick:', error.response?.data || error.message);
        return "Apologies, something went wrong with my lyrical prowess.";
    }
}



// Start the server
server.listen(port, async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected! Fuck on!');
    } catch (error) {
        console.error("Unable to connect to the database, probably because you're a bitch, but here's an additional reason:", error);
    }
    console.log(`Backend server running, don't question it b`);
});
