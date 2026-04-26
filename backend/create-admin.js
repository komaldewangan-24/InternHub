const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const existing = await User.findOne({ email: 'admin@internhub.com' });
        if (existing) {
            console.log('Admin already exists');
            process.exit(0);
        }

        await User.create({
            name: 'System Admin',
            email: 'admin@internhub.com',
            password: 'password123',
            role: 'admin'
        });

        console.log('Admin account created successfully');
        console.log('Email: admin@internhub.com');
        console.log('Password: password123');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
