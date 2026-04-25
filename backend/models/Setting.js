const mongoose = require('mongoose');

const ReviewRubricItemSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            trim: true,
        },
        label: {
            type: String,
            required: true,
            trim: true,
        },
        description: String,
        maxScore: {
            type: Number,
            default: 5,
        },
    },
    { _id: true }
);

const ResumeAtsCriteriaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default: '',
            trim: true,
        },
        requiredKeywords: {
            type: [String],
            default: [],
        },
        preferredKeywords: {
            type: [String],
            default: [],
        },
        requiredSections: {
            type: [String],
            default: [],
        },
        weights: {
            keywords: { type: Number, default: 35 },
            sections: { type: Number, default: 20 },
            experience: { type: Number, default: 20 },
            education: { type: Number, default: 10 },
            links: { type: Number, default: 10 },
            formatting: { type: Number, default: 5 },
        },
        notes: {
            type: String,
            default: '',
        },
    },
    { _id: false }
);

const SettingSchema = new mongoose.Schema(
    {
        organizationName: {
            type: String,
            default: 'InternHub Campus',
        },
        departments: {
            type: [String],
            default: ['Computer Science', 'Information Technology', 'Electronics'],
        },
        batches: {
            type: [String],
            default: ['2025', '2026', '2027'],
        },
        placementCategories: {
            type: [String],
            default: ['Internship', 'Full-time', 'Capstone'],
        },
        activeCycle: {
            name: {
                type: String,
                default: 'Placement Season',
            },
            startDate: Date,
            endDate: Date,
        },
        projectReviewSlaDays: {
            type: Number,
            default: 7,
        },
        reviewRubric: {
            type: [ReviewRubricItemSchema],
            default: [
                { key: 'originality', label: 'Originality', maxScore: 5 },
                { key: 'technical_depth', label: 'Technical Depth', maxScore: 5 },
                { key: 'documentation', label: 'Documentation', maxScore: 5 },
                { key: 'presentation', label: 'Presentation', maxScore: 5 },
            ],
        },
        resumeAtsCriteria: {
            type: ResumeAtsCriteriaSchema,
            default: () => ({}),
        },
        companyVerificationEnabled: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Setting', SettingSchema);
