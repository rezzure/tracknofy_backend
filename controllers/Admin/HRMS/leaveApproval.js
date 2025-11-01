const LeaveRequest = require("../../../Schema/leaveRequest.schema/leaveRequest.model");
const User = require("../../../Schema/users.schema/users.model");

// Get pending leaves for approval
const getPendingLeaves = async (req, res) => {
  try {
    const pendingLeaves = await LeaveRequest.find({ status: 'pending' })
      .populate('user_id', 'name email mobile role')
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      data: pendingLeaves,
      message: "Pending leaves fetched successfully"
    });
  } catch (error) {
    console.error('Error fetching pending leaves:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
};

// Approve leave request
const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved_by, remark } = req.body;

    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        approved_by: approved_by,
        approved_at: new Date(),
        workflow_remark: remark || 'Leave approved',
        $push: {
          comments: {
            text: remark || 'Leave request approved',
            user: approved_by || 'Admin',
            userRole: 'admin',
            date: new Date()
          }
        }
      },
      { new: true }
    ).populate('user_id', 'name email mobile role');

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found"
      });
    }

    res.status(200).json({
      success: true,
      data: leaveRequest,
      message: "Leave request approved successfully"
    });
  } catch (error) {
    console.error('Error approving leave:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
};

// Reject leave request
const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejected_by, remark } = req.body;

    if (!remark) {
      return res.status(400).json({
        success: false,
        message: "Rejection remark is required"
      });
    }

    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        rejected_by: rejected_by,
        rejected_at: new Date(),
        workflow_remark: remark,
        $push: {
          comments: {
            text: `Leave rejected: ${remark}`,
            user: rejected_by || 'Admin',
            userRole: 'admin',
            date: new Date()
          }
        }
      },
      { new: true }
    ).populate('user_id', 'name email mobile role');

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found"
      });
    }

    res.status(200).json({
      success: true,
      data: leaveRequest,
      message: "Leave request rejected successfully"
    });
  } catch (error) {
    console.error('Error rejecting leave:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
};

module.exports = {
  getPendingLeaves,
  approveLeave,
  rejectLeave
};