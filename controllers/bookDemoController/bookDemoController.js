const DemoBooking = require('../../Schema/bookDemo.schema/bookDemo.model');

// @desc    Create new demo booking
// @route   POST /api/demo-bookings
// @access  Public
exports.createDemoBooking = async (req, res) => {
  try {
    const { name, email, company, employees, phone, demoDate, demoTime, status } = req.body;
    console.log(name, email, company)

    // Validate required fields
    if (!name || !email || !company || !employees || !demoDate || !demoTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if email already has a pending booking for the same date/time
    const existingBooking = await DemoBooking.findOne({
      email,
      demoDate: new Date(demoDate),
      demoTime,
      status: 'scheduled'
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a demo scheduled for this date and time'
      });
    }

    // Create booking
    const booking = await DemoBooking.create({
      name,
      email,
      company,
      employees,
      phone: phone || null,
      demoDate: new Date(demoDate),
      demoTime,
      status: status || 'scheduled',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });

    // TODO: Send confirmation email here
    // await sendConfirmationEmail(booking);

    res.status(201).json({
      success: true,
      message: 'Demo booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error creating demo booking:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get all demo bookings (Admin)
// @route   GET /api/demo-bookings
// @access  Private/Admin
exports.getAllDemoBookings = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (startDate || endDate) {
      query.demoDate = {};
      if (startDate) query.demoDate.$gte = new Date(startDate);
      if (endDate) query.demoDate.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const bookings = await DemoBooking.find(query)
      .sort({ demoDate: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await DemoBooking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching demo bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get single demo booking
// @route   GET /api/demo-bookings/:id
// @access  Private/Admin
exports.getDemoBookingById = async (req, res) => {
  try {
    const booking = await DemoBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Demo booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching demo booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Update demo booking status
// @route   PATCH /api/demo-bookings/:id
// @access  Private/Admin
exports.updateDemoBooking = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const booking = await DemoBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Demo booking not found'
      });
    }

    if (status) booking.status = status;
    if (notes !== undefined) booking.notes = notes;

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Demo booking updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating demo booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Delete demo booking
// @route   DELETE /api/demo-bookings/:id
// @access  Private/Admin
exports.deleteDemoBooking = async (req, res) => {
  try {
    const booking = await DemoBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Demo booking not found'
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Demo booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting demo booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get booking statistics (Admin)
// @route   GET /api/demo-bookings/stats
// @access  Private/Admin
exports.getBookingStats = async (req, res) => {
  try {
    const stats = await DemoBooking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await DemoBooking.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingCount = await DemoBooking.countDocuments({
      demoDate: { $gte: today },
      status: 'scheduled'
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        upcoming: upcomingCount,
        byStatus: stats
      }
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};