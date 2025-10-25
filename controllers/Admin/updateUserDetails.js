const UserDetails = require("../../Schema/UserDetails.schema/UserDetails.model");
const User = require("../../Schema/users.schema/users.model");
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
      ifscCode
    } = req.body;

    // Find existing user details
    const existingDetails = await UserDetails.findById(id);
    if (!existingDetails) {
      return res.status(404).json({
        success: false,
        message: "User details not found"
      });
    }

    // Check if reportingTo user exists (if provided)
    if (reportingTo && reportingTo !== "") {
      const reportingUser = await User.findById(reportingTo);
      if (!reportingUser) {
        return res.status(404).json({
          success: false,
          message: "Reporting manager not found"
        });
      }
    }

    // Handle file uploads
    const newImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        newImages.push({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
          uploadedAt: new Date()
        });
      });
    }

    // Prepare update data
    const updateData = {
      reportingTo: reportingTo !== undefined ? reportingTo : existingDetails.reportingTo,
      employmentType: employmentType !== undefined ? employmentType : existingDetails.employmentType,
      probationPeriod: probationPeriod !== undefined ? probationPeriod : existingDetails.probationPeriod,
      dob: dob !== undefined ? (dob === "" ? null : dob) : existingDetails.dob,
      doj: doj !== undefined ? (doj === "" ? null : doj) : existingDetails.doj,
      contactNumber: contactNumber !== undefined ? contactNumber : existingDetails.contactNumber,
      aadharNumber: aadharNumber !== undefined ? aadharNumber : existingDetails.aadharNumber,
      panNumber: panNumber !== undefined ? panNumber : existingDetails.panNumber,
      bankName: bankName !== undefined ? bankName : existingDetails.bankName,
      accountNumber: accountNumber !== undefined ? accountNumber : existingDetails.accountNumber,
      ifscCode: ifscCode !== undefined ? ifscCode : existingDetails.ifscCode,
      updatedAt: Date.now()
    };

    // Add new images if any
    if (newImages.length > 0) {
      updateData.$push = { images: { $each: newImages } };
    }

    // Update user details
    const updatedDetails = await UserDetails.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('user', 'name email role mobile')
    .populate('reportingTo', 'name email role')
    .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      data: updatedDetails,
    });
  } catch (err) {
    console.error("Error updating user details:", err);
    
    // Clean up uploaded files if there was an error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
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