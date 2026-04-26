const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');

// Ensure upload directories exist
const UPLOAD_ROOT = 'uploads';
const CATEGORIES = ['avatars', 'resumes', 'certifications', 'achievements', 'company-logos'];

if (!fs.existsSync(UPLOAD_ROOT)) {
    fs.mkdirSync(UPLOAD_ROOT);
}

CATEGORIES.forEach(category => {
    const dir = path.join(UPLOAD_ROOT, category);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const category = req.params.category;
        if (!CATEGORIES.includes(category)) {
            return cb(new Error('Invalid category'), null);
        }
        cb(null, path.join(UPLOAD_ROOT, category));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File Filters
const fileFilter = (req, file, cb) => {
    const category = req.params.category;
    
    if (category === 'resumes') {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF resumes are allowed'), false);
        }
    } else {
        // Images for other categories
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for this category'), false);
        }
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// @desc      Upload a file
// @route     POST /api/uploads/:category
// @access    Private
router.post('/:category', protect, (req, res) => {
    const category = req.params.category;
    
    if (!CATEGORIES.includes(category)) {
        return res.status(400).json({ success: false, error: 'Invalid upload category' });
    }

    const uploadSingle = upload.single('file');

    uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a file' });
        }

        // Return relative URL that starts with /uploads
        const relativeUrl = `/uploads/${category}/${req.file.filename}`;
        
        res.status(200).json({
            success: true,
            data: {
                url: relativeUrl,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                filename: req.file.filename
            }
        });
    });
});

module.exports = router;
