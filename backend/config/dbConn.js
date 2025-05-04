const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.DATABASE_URI;
        if (!uri) {
            throw new Error('DATABASE_URI is not defined in the environment variables.');
        }
        await mongoose.connect(uri);
    } catch (err) {
        console.error('MongoDB connection error:', err);

        if (err.name === 'MongooseServerSelectionError') {
            console.error('Ensure your IP address is whitelisted in your MongoDB Atlas cluster.');
        } else if (err.name === 'MongoNetworkError') {
            console.error('Check your network connection and SSL/TLS settings.');
        }
    
        console.error('Connection URI:', process.env.DATABASE_URI);
        console.error('Environment:', process.env.NODE_ENV || 'development');
    }
};

module.exports = connectDB;