const LeaveRequest = require("../../../Schema/leaveRequest.schema/leaveRequest.model");

const getLeaveRequest = async (req, res) => {
  try {
    const { status, user_id, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (user_id) {
      filter.user_id = user_id;
    }

    // For admin, show all requests. For employees, show only their requests
    if (req.user.role !== 'admin' && req.user.role !== 'supervisor') {
      filter.user_id = req.user.id;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: 'user_id',
        select: 'name email mobile role'
      }
    };

    const leaveRequests = await LeaveRequest.find(filter)
      .populate('user_id', 'name email mobile role')
      .populate('approved_by', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LeaveRequest.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: leaveRequests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
};

module.exports = getLeaveRequest;