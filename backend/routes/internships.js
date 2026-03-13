const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const { protect, authorize } = require('../middleware/auth');

// @desc      Get all internships
// @route     GET /api/internships
// @access    Public
router.get('/', async (req, res) => {
    try {
        let query;
        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach((param) => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

        // Finding resource
        query = Internship.find(JSON.parse(queryStr)).populate({
            path: 'company',
            select: 'name description logoUrl',
        });

        // Executing query
        const internships = await query;

        res.status(200).json({
            success: true,
            count: internships.length,
            data: internships,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc      Get single internship
// @route     GET /api/internships/:id
// @access    Public
router.get('/:id', async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id).populate({
            path: 'company',
            select: 'name description logoUrl',
        });

        if (!internship) {
            return res.status(404).json({ success: false, error: `Internship not found with id of ${req.params.id}` });
        }

        res.status(200).json({
            success: true,
            data: internship,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc      Create new internship
// @route     POST /api/internships
// @access    Private (Recruiter, Admin)
router.post('/', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const internship = await Internship.create(req.body);

        res.status(201).json({
            success: true,
            data: internship,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc      Update internship
// @route     PUT /api/internships/:id
// @access    Private (Recruiter, Admin)
router.put('/:id', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        let internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ success: false, error: `Internship not found with id of ${req.params.id}` });
        }

        // Make sure user is internship owner
        if (internship.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: `User ${req.user.id} is not authorized to update this internship` });
        }

        internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
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

// @desc      Delete internship
// @route     DELETE /api/internships/:id
// @access    Private (Recruiter, Admin)
router.delete('/:id', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ success: false, error: `Internship not found with id of ${req.params.id}` });
        }

        // Make sure user is internship owner
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
