const express = require('express');
const router = express.Router();
const {
  createDemoBooking,
  getAllDemoBookings,
  getDemoBookingById,
  updateDemoBooking,
  deleteDemoBooking,
  getBookingStats
} = require('../../controllers/bookDemoController/bookDemoController');

// Import your auth middleware if you have one
// const { protect, authorize } = require('../middleware/auth');

// Public route
router.post('/', createDemoBooking);

// Protected routes (uncomment and add your auth middleware)
// router.get('/', protect, authorize('admin'), getAllDemoBookings);
// router.get('/stats', protect, authorize('admin'), getBookingStats);
// router.get('/:id', protect, authorize('admin'), getDemoBookingById);
// router.patch('/:id', protect, authorize('admin'), updateDemoBooking);
// router.delete('/:id', protect, authorize('admin'), deleteDemoBooking);

// For now, without auth (remove in production)
router.get('/', getAllDemoBookings);
router.get('/stats', getBookingStats);
router.get('/:id', getDemoBookingById);
router.patch('/:id', updateDemoBooking);
router.delete('/:id', deleteDemoBooking);

module.exports = router;