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

    // Handle profile photo upload (single file)
    let profilePhoto = existingDetails.profilePhoto;
    if (req.files && req.files.profilePhoto && req.files.profilePhoto.length > 0) {
      const file = req.files.profilePhoto[0];
      profilePhoto = {
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        uploadedAt: new Date(),
      };
    }

    // Handle other images upload (multiple files)
    let images = existingDetails.images || [];
    if (req.files && req.files.images && req.files.images.length > 0) {
      req.files.images.forEach((file) => {
        images.push({
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
    const updatedDetails = await UserDetails.findByIdAndUpdate(
      id,
      {
        reportingTo: reportingTo || "",
        reportingTo_name: reportingToName,
        employmentType: employmentType || "",
        probationPeriod: probationPeriod || "",
        dob: dob || null,
        doj: doj || null,
        contactNumber: contactNumber || "",
        aadharNumber: aadharNumber || "",
        panNumber: panNumber || "",
        bankName: bankName || "",
        accountNumber: accountNumber || "",
        ifscCode: ifscCode || "",
        profilePhoto: profilePhoto,
        images: images,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      data: updatedDetails,
    });
  } catch (err) {
    console.error("Error updating user details:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
};

module.exports = updateUserDetails;