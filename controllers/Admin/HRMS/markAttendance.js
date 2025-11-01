const Attendance = require("../../../Schema/attendance.schema/attendance.model");
const User = require("../../../Schema/users.schema/users.model");

const markAttendance = async (req, res) => {
  try {
    let { user_id, date, status, leave_type, duration, half_day_timing,  reason, marked_by, location } = req.body;

    // Validate required fields
    if (!user_id || !date || !status || !marked_by || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields including location are required"
      });
    }

    // Validate status
    if (!['present', 'absent', 'half-day'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Allowed values: present, absent, half-day"
      });
    }

    // Validate location
    if (!location.latitude || !location.longitude) {
      return res.status(400).json({
        success: false,
        message: "Location coordinates are required"
      });
    }

    // Handle different status types
    if (status === 'present') {
      // For present status, clear leave-related fields
      leave_type = '';
      duration = null;
      half_day_timing = null;
      reason = "";
    } else if (status === 'absent') {
      // For absent status, require leave type and duration
      if (!leave_type) {
        return res.status(400).json({
          success: false,
          message: "Leave type is required for absent status",
        });
      }
      if (!duration) {
        return res.status(400).json({
          success: false,
          message: "Duration is required for absent status",
        });
      }
      // For full-day absent, clear half-day timing
      if (duration === 'full-day') {
        half_day_timing = null;
      }
    } else if (status === 'half-day') {
      // For half-day status, require all leave-related fields
      if (!leave_type) {
        return res.status(400).json({
          success: false,
          message: "Leave type is required for half-day status",
        });
      }
      if (!duration) {
        return res.status(400).json({
          success: false,
          message: "Duration is required for half-day status",
        });
      }
      if (!half_day_timing) {
        return res.status(400).json({
          success: false,
          message: "Half-day timing is required for half-day status",
        });
      }
    }

    // Get user details to save name and mobile
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if attendance already exists for this user on this date
    const existingAttendance = await Attendance.findOne({
      user_id,
      date: new Date(date),
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date",
      });
    }

    // Create new attendance record with all details
    const attendance = new Attendance({
      user_id,
      user_name: user.name,
      user_mobile: user.mobile,
      date: new Date(date),
      status,
      leave_type: leave_type || "",
      duration: duration || null,
      half_day_timing: half_day_timing || null,
      reason: reason || "",
      marked_by,
      location,
    });

    await attendance.save();

    res.status(200).json({
      success: true,
      message: `Attendance marked as ${status} successfully`,
      data: attendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: `Validation error: ${error.message}`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

module.exports = markAttendance;
