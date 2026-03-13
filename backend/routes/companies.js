const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect, authorize } = require('../middleware/auth');

// @desc      Get all companies
// @route     GET /api/companies
// @access    Public
router.get('/', async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).json({
            success: true,
            count: companies.length,
            data: companies,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc      Create new company
// @route     POST /api/companies
// @access    Private (Recruiter, Admin)
router.post('/', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const company = await Company.create(req.body);

        res.status(201).json({
            success: true,
            data: company,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
