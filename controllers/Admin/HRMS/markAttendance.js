const Attendance = require('../../../Schema/attendance.schema/attendance.modal');
const User = require('../../../Schema/users.schema/users.model')

const markAttendance = async (req, res) => {
  try {
    const { user_id, date, status, reason, marked_by, location } = req.body;

    // Validate required fields
    if (!user_id || !date || !status || !marked_by || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields including location are required"
      });
    }

    // Validate status
    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    // Validate location
    if (!location.latitude || !location.longitude) {
      return res.status(400).json({
        success: false,
        message: "Location coordinates are required"
      });
    }

    // Get user details to save name and mobile
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if attendance already exists for this user on this date
    const existingAttendance = await Attendance.findOne({
      user_id,
      date: new Date(date)
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date"
      });
    }

    // Create new attendance record with user name and mobile
    const attendance = new Attendance({
      user_id,
      user_name: user.name,
      user_mobile: user.mobile,
      date: new Date(date),
      status,
      reason: reason || '',
      marked_by,
      location
    });

    await attendance.save();

    res.status(200).json({
      success: true,
      message: `Attendance marked as ${status} successfully`,
      data: attendance
    });

  } catch (error) {
    console.error('Error marking attendance:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = markAttendance;