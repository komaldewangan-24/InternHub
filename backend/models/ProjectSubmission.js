const mongoose = require('mongoose');

const ProjectVersionSchema = new mongoose.Schema(
    {
        versionNumber: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        links: {
            type: [String],
            default: [],
        },
        tags: {
            type: [String],
            default: [],
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        submittedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { _id: true }
);

const FacultyCommentSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        action: {
            type: String,
            enum: ['commented', 'needs_resubmission', 'approved'],
            default: 'commented',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: true }
);

const ProjectSubmissionSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        faculty: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please provide a project title'],
            trim: true,
            maxlength: [120, 'Title can not be more than 120 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a project description'],
            maxlength: [3000, 'Description can not be more than 3000 characters'],
        },
        links: {
            type: [String],
            default: [],
        },
        tags: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ['draft', 'submitted', 'needs_resubmission', 'approved'],
            default: 'draft',
        },
        currentVersion: {
            type: Number,
            default: 1,
        },
        versions: {
            type: [ProjectVersionSchema],
            default: [],
        },
        comments: {
            type: [FacultyCommentSchema],
            default: [],
        },
        reviewDueAt: Date,
        reviewCompletedAt: Date,
        turnaroundDays: Number,
        rubricAssessment: {
            type: [
                new mongoose.Schema(
                    {
                        criterion: String,
                        score: Number,
                        maxScore: Number,
                        note: String,
                    },
                    { _id: true }
                ),
            ],
            default: [],
        },
        rubricScore: {
            type: Number,
            default: 0,
        },
        lastSubmittedAt: Date,
        approvedAt: Date,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ProjectSubmission', ProjectSubmissionSchema);
