const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadImageToImageKit, deleteImageFromImageKit, bufferToDataURL } = require('../utils/imageKit');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload image - multipart/form-data (ImageKit only, no fallback)
router.post('/', protect, authorize('admin'), upload.single('image'), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file?.originalname);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // Convert buffer to data URL
    const dataURL = bufferToDataURL(req.file.buffer, req.file.mimetype);
    console.log('Uploading to ImageKit...');
    
    // Upload to ImageKit
    const imageKitResult = await uploadImageToImageKit(dataURL, `product-${Date.now()}-${req.file.originalname}`);
    
    if (!imageKitResult) {
      return res.status(500).json({
        success: false,
        message: 'ImageKit upload failed. Please check your ImageKit credentials and try again.'
      });
    }

    console.log('✅ ImageKit upload SUCCESS');
    console.log('URL:', imageKitResult.url);
    console.log('FileId:', imageKitResult.fileId);

    res.status(200).json({
      success: true,
      data: {
        url: imageKitResult.url,
        fileId: imageKitResult.fileId
      }
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Upload failed'
    });
  }
});

// Delete image from ImageKit
router.delete('/:fileId', protect, authorize('admin'), async (req, res) => {
  try {
    const { fileId } = req.params;
    
    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required'
      });
    }
    
    await deleteImageFromImageKit(fileId);
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully from ImageKit'
    });
  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image'
    });
  }
});

module.exports = router;
