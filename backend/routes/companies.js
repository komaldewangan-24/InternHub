const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect, authorize } = require('../middleware/auth');

// @desc      Get companies visible to the current role
// @route     GET /api/companies
// @access    Private (Student/Faculty see verified public listings, Recruiter sees own companies, Admin sees all)
router.get('/', protect, async (req, res) => {
    try {
        const query = {};

        if (req.user.role === 'recruiter') {
            query.user = req.user.id;
        } else if (req.user.role !== 'admin') {
            query.verificationStatus = 'verified';
        }

        const companies = await Company.find(query)
            .select('name description website logoUrl verificationStatus user createdAt')
            .sort('name');

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
        if (req.user.role !== 'admin') {
            delete req.body.verificationStatus;
        }

        const company = await Company.create(req.body);

        res.status(201).json({
            success: true,
            data: company,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc      Update company
// @route     PUT /api/companies/:id
// @access    Private (Recruiter, Admin)
router.put('/:id', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        let company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ success: false, error: `Company not found with id of ${req.params.id}` });
        }

        // Make sure user is company owner or admin
        if (company.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: `User ${req.user.id} is not authorized to update this company` });
        }

        if (req.user.role !== 'admin') {
            delete req.body.verificationStatus;
        }

        company = await Company.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: company,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc      Delete company
// @route     DELETE /api/companies/:id
// @access    Private (Recruiter, Admin)
router.delete('/:id', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ success: false, error: `Company not found with id of ${req.params.id}` });
        }

        // Make sure user is company owner or admin
        if (company.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: `User ${req.user.id} is not authorized to delete this company` });
        }

        await company.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
