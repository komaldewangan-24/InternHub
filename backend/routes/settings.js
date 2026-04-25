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

const normalizeArray = (value) => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.map((item) => String(item).trim()).filter(Boolean);
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

        if (req.body.resumeAtsCriteria) {
            settings.resumeAtsCriteria = normalizeResumeCriteria(req.body.resumeAtsCriteria);
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
