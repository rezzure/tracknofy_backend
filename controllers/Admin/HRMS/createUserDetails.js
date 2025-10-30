const UserDetails = require("../../../Schema/UserDetails.schema/UserDetails.model");
const User = require("../../../Schema/users.schema/users.model");
const fs = require("fs");
const path = require("path");

const createUserDetails = async (req, res) => {
  try {
    const {
      userName,
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

    const createdBy = req.user.id;

    // Check if user exists and get user details
    const user = await User.findById(userName);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user details already exist for this user
    const existingDetails = await UserDetails.findOne({
      user: userName,
      status: "active",
    });

    if (existingDetails) {
      return res.status(400).json({
        success: false,
        message: "User details already exist for this user",
      });
    }

    // Get reporting manager details (if provided)
    let reportingToName = "";
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
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
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

    // Create user details with names
    const userDetails = new UserDetails({
      user: userName,
      user_name: user.name,
      user_email: user.email,
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
      images: images,
      createdBy: createdBy,
    });

    await userDetails.save();

    res.status(201).json({
      success: true,
      message: "User details created successfully",
      data: userDetails,
    });
  } catch (err) {
    console.error("Error creating user details:", err);

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

module.exports = createUserDetails;