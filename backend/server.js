const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

if (!process.env.JWT_SECRET) {
    console.error('Missing required environment variable: JWT_SECRET');
    console.error('Create backend/.env from backend/.env.example and set JWT_SECRET before starting the server.');
    process.exit(1);
}

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const internships = require('./routes/internships');
const companies = require('./routes/companies');
const applications = require('./routes/applications');
const users = require('./routes/users');
const messages = require('./routes/messages');
const projects = require('./routes/projects');
const notifications = require('./routes/notifications');
const settings = require('./routes/settings');

const app = express();

// Body parser. Resume uploads are stored as profile data URLs and capped in the UI.
app.use(express.json({ limit: '8mb' }));

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/internships', internships);
app.use('/api/companies', companies);
app.use('/api/applications', applications);
app.use('/api/users', users);
app.use('/api/messages', messages);
app.use('/api/projects', projects);
app.use('/api/notifications', notifications);
app.use('/api/settings', settings);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
