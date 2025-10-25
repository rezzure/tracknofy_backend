const UserDetails = require("../../Schema/UserDetails.schema/UserDetails.model");

const getUserDetails = async (req, res) => {
  try {
    const userDetails = await UserDetails.find({ status: 'active' })
      .populate('user', 'name email role mobile')
      .populate('reportingTo', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: userDetails,
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
};

module.exports = getUserDetails;