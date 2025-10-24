const mongoose = require("mongoose");
const UserDetails = require("../../Schema/UserDetails.schema/UserDetails.model");
const User = require("../../Schema/users.schema/users.model");

const createUserDetails = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    
    // Handle both cases (capital and lowercase)
    const userName = req.body.UserName || req.body.userName;
    const reportingTo = req.body.ReportingTo || req.body.reportingTo || "";
    const employmentType = req.body.EmploymentType || req.body.employmentType || "";
    const probationPeriod = req.body.ProbationPeriod || req.body.probationPeriod || "";

    if (!userName) {
      return res.send({
        success: false,
        message: "User name is required",
      });
    }

    // Check if user exists
    const user = await User.findById(userName);
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    // Create user details
    const userDetails = new UserDetails({
      user: userName,
      reportingTo: reportingTo,
      employmentType: employmentType,
      probationPeriod: probationPeriod,
    });

    await userDetails.save();

    res.status(200).send({
      success: true,
      message: "User details created successfully",
      data: userDetails,
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
};

module.exports = createUserDetails;