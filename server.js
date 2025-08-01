require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./configs/environments');

const connectToDatabase = async () => {
    try {
        await mongoose.connect(config.MONGODB_CONNECTION_STRING, {
            authSource: 'admin' // Add this line if necessary
        });
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

const startServer = async () => {
    // await connectToDatabase();
    app.listen(config.PORT, () => {
        console.log(`Server Port: ${config.PORT}`);
        console.log('Server Is Running');
    });
};

startServer();
