// ============================================
// routes/upload.js
// ============================================

const express = require('express');
const multer = require('multer');
const router = express.Router();
const config = require('../config');
const uploadService = require('../services/uploadService');
const { requireLogin, requireEditor } = require('../middleware/auth');
const { ALLOWED_MIMES } = require('../utils/fileValidation');
const logger = require('../utils/logger');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploads.maxSize },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WebP, GIF images are allowed'));
    }
  },
});

router.post('/', requireLogin, requireEditor, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large — max 2MB' });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const result = await uploadService.uploadMoviePoster(req.body.movie_id, req.file);
      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      }
      res.json(result);
    } catch (uploadErr) {
      logger.error({ err: uploadErr, requestId: req.id }, 'upload error');
      res.status(500).json({ error: 'Upload failed' });
    }
  });
});

module.exports = router;
