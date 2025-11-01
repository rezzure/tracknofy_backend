const LeaveRequest = require("../../../Schema/leaveRequest.schema/leaveRequest.model");
const User = require("../../../Schema/users.schema/users.model");
const Attendance = require("../../../Schema/attendance.schema/attendance.model");

const createLeaveRequest = async (req, res) => {
  try {
    const { leave_type, start_date, end_date, duration, reason } = req.body;
    const email = req.query.email; // Get email from query params like in frontend

    console.log('Creating leave request for user with email:', email); // Debug log

    // Validate required fields
    if (!leave_type || !start_date || !duration) {
      return res.status(400).json({
        success: false,
        message: "Leave type, start date, and duration are required"
      });
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = end_date ? new Date(end_date) : startDate;

    if (isNaN(startDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date"
      });
    }

    if (duration === 'multiple-days' && !end_date) {
      return res.status(400).json({
        success: false,
        message: "End date is required for multiple days leave"
      });
    }

    if (end_date && isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid end date"
      });
    }

    if (endDate < startDate) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date"
      });
    }

    // Check if user exists - Find by email in User model
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email); // Debug log
      return res.status(404).json({
        success: false,
        message: "User not found with email: " + email
      });
    }

    console.log('User found:', user.name); // Debug log

    // Check for overlapping leave requests
    const existingLeave = await LeaveRequest.findOne({
      user_id: user._id,
      status: { $in: ['pending', 'approved'] },
      $or: [
        {
          start_date: { $lte: endDate },
          end_date: { $gte: startDate }
        }
      ]
    });

    if (existingLeave) {
      return res.status(400).json({
        success: false,
        message: "You already have a leave request for this period"
      });
    }

    // Create leave request (reason is now optional)
    const leaveRequest = new LeaveRequest({
      user_id: user._id,
      leave_type,
      start_date: startDate,
      end_date: endDate,
      duration,
      reason: reason || '', // Reason is optional
      created_by: user._id
    });

    await leaveRequest.save();

    // Populate user details for response
    await leaveRequest.populate('user_id', 'name email mobile role');

    res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      data: leaveRequest
    });

  } catch (error) {
    console.error('Error creating leave request:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: `Validation error: ${error.message}`
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
};

module.exports = createLeaveRequest;