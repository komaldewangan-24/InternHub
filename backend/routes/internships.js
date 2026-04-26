const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const { protect, authorize } = require('../middleware/auth');

const normalizeArray = (value) => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => String(item).trim())
        .filter(Boolean);
};

const normalizeResumeCriteria = (criteria = {}) => ({
    title: String(criteria.title || '').trim(),
    requiredKeywords: normalizeArray(criteria.requiredKeywords),
    preferredKeywords: normalizeArray(criteria.preferredKeywords),
    requiredSections: normalizeArray(criteria.requiredSections),
    weights: {
        keywords: Number(criteria.weights?.keywords) || 35,
        sections: Number(criteria.weights?.sections) || 20,
        experience: Number(criteria.weights?.experience) || 20,
        education: Number(criteria.weights?.education) || 10,
        links: Number(criteria.weights?.links) || 10,
        formatting: Number(criteria.weights?.formatting) || 5,
    },
    notes: String(criteria.notes || '').trim(),
});

const internshipPopulate = {
    path: 'company',
    select: 'name description logoUrl verificationStatus',
};

const userPopulate = {
    path: 'user',
    select: 'name email role profile.department profile.designation',
};

router.get('/', protect, async (req, res) => {
    try {
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach((param) => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
        const query = JSON.parse(queryStr);

        // If recruiter, filter by their own internships
        if (req.user.role === 'recruiter') {
            query.user = req.user.id;
        }

        const internships = await Internship.find(query)
            .populate(internshipPopulate)
            .populate(userPopulate)
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: internships.length,
            data: internships,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.get('/:id', protect, async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id)
            .populate(internshipPopulate)
            .populate(userPopulate);

        if (!internship) {
            return res.status(404).json({ success: false, error: `Internship not found with id of ${req.params.id}` });
        }

        // Only owner, student, or admin can see details
        if (req.user.role === 'recruiter' && String(internship.user) !== String(req.user.id)) {
            return res.status(403).json({ success: false, error: 'You are not authorized to view this internship' });
        }

        res.status(200).json({
            success: true,
            data: internship,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post('/', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        req.body.user = req.user.id;

        // Verify company ownership for recruiters
        if (req.user.role === 'recruiter' && req.body.company) {
            const Company = require('../models/Company');
            const company = await Company.findById(req.body.company);
            if (!company || String(company.user) !== String(req.user.id)) {
                return res.status(403).json({ success: false, error: 'You are not authorized to post for this company' });
            }
        }

        req.body.requirements = normalizeArray(req.body.requirements);
        req.body.skillTags = normalizeArray(req.body.skillTags);
        req.body.eligibleDepartments = normalizeArray(req.body.eligibleDepartments);
        req.body.eligibleBatches = normalizeArray(req.body.eligibleBatches);
        req.body.resumeAtsCriteria = normalizeResumeCriteria(req.body.resumeAtsCriteria);

        const internship = await Internship.create(req.body);

        res.status(201).json({
            success: true,
            data: internship,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.put('/:id', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        let internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ success: false, error: `Internship not found with id of ${req.params.id}` });
        }

        if (internship.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: `User ${req.user.id} is not authorized to update this internship` });
        }

        const payload = { ...req.body };
        if (payload.requirements) payload.requirements = normalizeArray(payload.requirements);
        if (payload.skillTags) payload.skillTags = normalizeArray(payload.skillTags);
        if (payload.eligibleDepartments) payload.eligibleDepartments = normalizeArray(payload.eligibleDepartments);
        if (payload.eligibleBatches) payload.eligibleBatches = normalizeArray(payload.eligibleBatches);
        if (payload.resumeAtsCriteria) payload.resumeAtsCriteria = normalizeResumeCriteria(payload.resumeAtsCriteria);

        internship = await Internship.findByIdAndUpdate(req.params.id, payload, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: internship,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.delete('/:id', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ success: false, error: `Internship not found with id of ${req.params.id}` });
        }

        if (internship.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: `User ${req.user.id} is not authorized to delete this internship` });
        }

        await internship.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
