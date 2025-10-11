const Design = require("../../Schema/designApproval.schema/designApproval.model");
const Admin = require("../../Schema/admin.schema/admine.model");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");

const deleteDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.query.email || req.user?.email; // Get email from query or token

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Verify user exists and has permission
    let user = await Admin.findOne({ email });
    if (!user) {
      user = await Supervisor.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find and delete the design
    const design = await Design.findByIdAndDelete(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    res.json({
      success: true,
      message: "Design deleted successfully",
      data: design,
    });
  } catch (error) {
    console.error("Error deleting design:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

module.exports = deleteDesign;
