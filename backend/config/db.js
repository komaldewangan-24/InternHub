const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log(`Attempting to connect to MongoDB at ${process.env.MONGO_URI}...`);
        const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`External MongoDB connection failed (${error.message}). Falling back to in-memory database...`);
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const memoryUri = mongoServer.getUri();
            const conn = await mongoose.connect(memoryUri);
            console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
        } catch (memError) {
            console.error(`Error with in-memory DB: ${memError.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
