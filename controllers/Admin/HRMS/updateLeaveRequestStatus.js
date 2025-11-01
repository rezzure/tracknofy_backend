const LeaveRequest = require('../../../Schema/leaveRequest.schema/leaveRequest.model');
const Attendance = require('../../../Schema/attendance.schema/attendance.model');

const updateLeaveRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const approved_by = req.user.id;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: approved, rejected"
      });
    }

    // Find leave request
    const leaveRequest = await LeaveRequest.findById(id).populate('user_id');
    
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found"
      });
    }

    // Check if already processed
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Leave request is already ${leaveRequest.status}`
      });
    }

    // Update leave request status
    leaveRequest.status = status;
    leaveRequest.approved_by = approved_by;
    leaveRequest.approved_at = new Date();

    await leaveRequest.save();

    // If approved, mark attendance as absent for each day in the leave period
    if (status === 'approved') {
      const startDate = new Date(leaveRequest.start_date);
      const endDate = new Date(leaveRequest.end_date);
      
      // Iterate through each day in the leave period
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const currentDate = new Date(date);
        
        // Skip weekends if needed (optional)
        // if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;

        // Check if attendance already exists for this date
        const existingAttendance = await Attendance.findOne({
          user_id: leaveRequest.user_id._id,
          date: currentDate
        });

        if (!existingAttendance) {
          // Create attendance record for absent
          const attendance = new Attendance({
            user_id: leaveRequest.user_id._id,
            user_name: leaveRequest.user_id.name,
            user_mobile: leaveRequest.user_id.mobile,
            date: currentDate,
            status: leaveRequest.duration === 'half-day' ? 'half-day' : 'absent',
            leave_type: leaveRequest.leave_type,
            duration: leaveRequest.duration,
            half_day_timing: leaveRequest.duration === 'half-day' ? 'first-half' : null,
            reason: leaveRequest.reason,
            marked_by: 'System (Leave Approval)',
            location: {
              latitude: 0,
              longitude: 0
            }
          });

          await attendance.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Leave request ${status} successfully`,
      data: leaveRequest
    });

  } catch (error) {
    console.error('Error updating leave request status:', error);
    
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

module.exports = updateLeaveRequestStatus;