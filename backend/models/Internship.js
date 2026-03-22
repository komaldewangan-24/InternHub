const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [50, 'Title can not be more than 50 characters'],
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description can not be more than 1000 characters'],
    },
    requirements: {
        type: [String],
        required: [true, 'Please add requirements'],
    },
    skillTags: {
        type: [String],
        default: [],
    },
    eligibleDepartments: {
        type: [String],
        default: [],
    },
    eligibleBatches: {
        type: [String],
        default: [],
    },
    location: {
        type: String,
        required: [true, 'Please add a location (e.g., Remote, City)'],
    },
    stipend: {
        type: String,
        default: 'Unpaid',
    },
    duration: {
        type: String, // e.g., '3 months'
    },
    applyBy: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Internship', InternshipSchema);
