const express = require('express');
const cors = require('cors');
const { sequelize, Item } = require('./models');
const app = express();
const port = process.env.PORT || 5001;
require('dotenv').config();
const inventoryRoutes = require('./routes/inventory');
const checkoutRoutes = require('./routes/checkout');
const webhookRoutes = require('./routes/webhooks');

app.use(express.json());
app.use(cors());

app.use('/api/inventory', inventoryRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/webhooks', webhookRoutes);


app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected! Fuck on!');
    } catch (error) {
        console.error('Unable to connect to the database, probably because you\'re a bitch, but here\'s an additional reason:', error);
    }
    console.log(`Backend server running, dont question it b`);
});