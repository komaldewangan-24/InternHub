const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Company = require('../models/Company');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Message = require('../models/Message');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected for seeding...');

        // 0. Ensure we have users to associate with companies/internships
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('Creating demo admin for associations...');
            admin = await User.create({
                name: 'Demo Admin',
                email: 'admin@test.com',
                password: 'password123',
                role: 'admin'
            });
        }

        // 1. Seed Companies
        const companyCount = await Company.countDocuments();
        if (companyCount === 0) {
            console.log('Seeding companies...');
            const companies = await Company.insertMany([
                { name: 'Google', website: 'https://google.com', description: 'Tech giant', user: admin._id },
                { name: 'Microsoft', website: 'https://microsoft.com', description: 'Software leader', user: admin._id },
                { name: 'Meta', website: 'https://meta.com', description: 'Social media giant', user: admin._id }
            ]);
            console.log(`Seeded ${companies.length} companies`);
        }

        // 2. Seed Internships
        const internshipCount = await Internship.countDocuments();
        if (internshipCount === 0) {
            console.log('Seeding internships...');
            const google = await Company.findOne({ name: 'Google' });
            const microsoft = await Company.findOne({ name: 'Microsoft' });
            
            if (google && microsoft) {
                await Internship.insertMany([
                    {
                        title: 'Frontend Developer Intern',
                        company: google._id,
                        description: 'Work with React and modern UI libraries.',
                        requirements: ['React', 'JavaScript', 'Tailwind'],
                        location: 'Remote',
                        stipend: '$2000/month',
                        duration: '3 months',
                        user: admin._id
                    },
                    {
                        title: 'Backend Intern',
                        company: microsoft._id,
                        description: 'Help build scalable Node.js APIs.',
                        requirements: ['Node.js', 'Express', 'MongoDB'],
                        location: 'Hybrid',
                        stipend: '$2500/month',
                        duration: '6 months',
                        user: admin._id
                    }
                ]);
                console.log('Seeded internships');
            }
        }


        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exit(1);
    }
};

seedData();
