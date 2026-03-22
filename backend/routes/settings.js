const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { protect, authorize } = require('../middleware/auth');

const getOrCreateSettings = async () => {
    let settings = await Setting.findOne();
    if (!settings) {
        settings = await Setting.create({});
    }
    return settings;
};

router.get('/', protect, async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.status(200).json({
            success: true,
            data: settings,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.put('/', protect, authorize('admin'), async (req, res) => {
    try {
        const settings = await getOrCreateSettings();

        settings.organizationName = req.body.organizationName || settings.organizationName;
        settings.departments = Array.isArray(req.body.departments) ? req.body.departments : settings.departments;
        settings.batches = Array.isArray(req.body.batches) ? req.body.batches : settings.batches;
        settings.placementCategories = Array.isArray(req.body.placementCategories)
            ? req.body.placementCategories
            : settings.placementCategories;
        settings.projectReviewSlaDays = Number(req.body.projectReviewSlaDays) || settings.projectReviewSlaDays;
        settings.companyVerificationEnabled =
            typeof req.body.companyVerificationEnabled === 'boolean'
                ? req.body.companyVerificationEnabled
                : settings.companyVerificationEnabled;

        if (req.body.activeCycle) {
            settings.activeCycle = {
                ...settings.activeCycle,
                ...req.body.activeCycle,
            };
        }

        if (Array.isArray(req.body.reviewRubric) && req.body.reviewRubric.length) {
            settings.reviewRubric = req.body.reviewRubric;
        }

        await settings.save();

        res.status(200).json({
            success: true,
            data: settings,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
