const mongoose = require('mongoose');

const seedDemoUsers = async () => {
    try {
        const User = require('../models/User');
        const demoUsers = [
            { name: 'Demo Student', email: 'student@test.com', password: 'password123', role: 'student' },
            { name: 'Demo Faculty', email: 'faculty@test.com', password: 'password123', role: 'faculty' },
            { name: 'Demo Recruiter', email: 'recruiter@test.com', password: 'password123', role: 'recruiter' },
            { name: 'Demo Admin', email: 'admin@test.com', password: 'password123', role: 'admin' },
        ];

        for (const u of demoUsers) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                console.log(`Seeding demo user: ${u.email} [${u.role}]`);
                await User.create(u);
            }
        }
    } catch (err) {
        console.error('Demo seeding failed:', err.message);
    }
};

const connectDB = async () => {
    try {
        const dbUri = process.env.MONGO_URI;
        if (!dbUri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        console.log(`Attempting to connect to MongoDB at ${dbUri}...`);
        
        // Mongoose 6+ always uses useNewUrlParser and useUnifiedTopology, so we don't need to pass them.
        // If they are passed, they might cause errors in some environments/versions.
        const conn = await mongoose.connect(dbUri);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await seedDemoUsers();
    } catch (error) {
        const canUseMemoryDb = (process.env.NODE_ENV || 'development') === 'development';

        if (!canUseMemoryDb) {
            console.error(`MongoDB connection failed: ${error.message}`);
            process.exit(1);
        }

        console.warn(`External MongoDB connection failed (${error.message}). Falling back to in-memory database for development...`);
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const memoryUri = mongoServer.getUri();
            const conn = await mongoose.connect(memoryUri);
            console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
            await seedDemoUsers();
        } catch (memError) {
            console.error(`Error with in-memory DB: ${memError.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
