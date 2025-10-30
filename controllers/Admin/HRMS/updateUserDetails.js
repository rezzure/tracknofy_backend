const UserDetails = require("../../../Schema/UserDetails.schema/UserDetails.model");
const User = require("../../../Schema/users.schema/users.model");
const fs = require("fs");
const path = require("path");

const updateUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      reportingTo,
      employmentType,
      probationPeriod,
      dob,
      doj,
      contactNumber,
      aadharNumber,
      panNumber,
      bankName,
      accountNumber,
      ifscCode,
    } = req.body;

    // Find existing user details
    const existingDetails = await UserDetails.findById(id);
    if (!existingDetails) {
      return res.status(404).json({
        success: false,
        message: "User details not found",
      });
    }

    // Get reporting manager details (if provided)
    let reportingToName = existingDetails.reportingTo_name;
    if (reportingTo && reportingTo !== "") {
      const reportingUser = await User.findById(reportingTo);
      if (!reportingUser) {
        return res.status(404).json({
          success: false,
          message: "Reporting manager not found",
        });
      }
      reportingToName = reportingUser.name;
    }

    // Handle file uploads
    const newImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        newImages.push({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
          uploadedAt: new Date(),
        });
      });
    }

    // Update user details
    const updatedData = {
      reportingTo: reportingTo || existingDetails.reportingTo,
      reportingTo_name: reportingToName,
      employmentType: employmentType || existingDetails.employmentType,
      probationPeriod: probationPeriod || existingDetails.probationPeriod,
      dob: dob || existingDetails.dob,
      doj: doj || existingDetails.doj,
      contactNumber: contactNumber || existingDetails.contactNumber,
      aadharNumber: aadharNumber || existingDetails.aadharNumber,
      panNumber: panNumber || existingDetails.panNumber,
      bankName: bankName || existingDetails.bankName,
      accountNumber: accountNumber || existingDetails.accountNumber,
      ifscCode: ifscCode || existingDetails.ifscCode,
    };

    // Add new images if any
    if (newImages.length > 0) {
      updatedData.images = [...existingDetails.images, ...newImages];
    }

    const updatedDetails = await UserDetails.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      data: updatedDetails,
    });
  } catch (err) {
    console.error("Error updating user details:", err);

    // Clean up uploaded files if there was an error
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch (fileError) {
            console.error(`Error cleaning up file ${file.path}:`, fileError);
          }
        }
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
};

module.exports = updateUserDetails;