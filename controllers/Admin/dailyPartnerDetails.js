const express = require("express");
const router = express.Router();
const DailyPartnerDetails = require("../../Schema/dailyPartnerDetails.schema/dailyPartnerDetails.model.js");
const Admin = require("../../Schema/admin.schema/admine.model.js");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model.js");
const verification = require("../../middleware/verification.js");

// Export partners endpoint - matches frontend call
router.post("/export/dailyPartners", verification, async (req, res) => {
  try {
    const { partners } = req.body;
    const email = req.query.email;

    if (!partners || !Array.isArray(partners) || partners.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No partners data provided",
      });
    }

    // Find the user who is creating the record
    let user = await Admin.findOne({ email });
    let userModel = "Admin";

    if (!user) {
      user = await Supervisor.findOne({ email });
      userModel = "Supervisor";
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create daily partner records
    const dailyPartners = await Promise.all(
      partners.map(async (partner) => {
        const dailyPartner = new DailyPartnerDetails({
          partnerType: partner.partnerType,
          partnerName: partner.partnerName,
          partnerMobile: partner.partnerMobile,
          partnerAddress: partner.partnerAddress,
          partnerPhoto: partner.partnerPhoto,
          partnerIdProof: partner.partnerIdProof,
          longitude: partner.longitude || 77.1025, // Default longitude if not provided
          latitude: partner.latitude || 28.7041,   // Default latitude if not provided
          createdBy: user._id,
          createdByModel: userModel,
        });

        return await dailyPartner.save();
      })
    );

    res.status(200).json({
      success: true,
      message: `${partners.length} partners exported successfully`,
      data: dailyPartners,
    });
  } catch (error) {
    console.error("Export partners error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

// Get daily partners endpoint
router.get("/dailyPartners", verification, async (req, res) => {
  try {
    const dailyPartners = await DailyPartnerDetails.find()
      .populate("createdBy")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: dailyPartners,
    });
  } catch (error) {
    console.error("Get daily partners error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;