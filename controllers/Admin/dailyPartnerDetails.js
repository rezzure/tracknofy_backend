const express = require("express");
const router = express.Router();
const DailyPartnerDetails = require("../../Schema/dailyPartnerDetails.schema/dailyPartnerDetails.model.js");
const Admin = require("../../Schema/admin.schema/admine.model.js");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model.js");
const verification = require("../../middleware/verification.js");

// Export partners endpoint - matches frontend call
router.post("/export/dailyPartners", verification, async (req, res) => {
  try {
    const { partners, checkInDate } = req.body; // Add checkInDate to request
    const email = req.query.email;

    if (!partners || !Array.isArray(partners) || partners.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No partners data provided",
      });
    }

    // Validate each partner
    for (const partner of partners) {
      if (!partner.partnerName || !partner.partnerType || !partner.partnerMobile) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields for partner",
        });
      }
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

    // Use provided date or current date
    const currentDate = checkInDate || new Date().toISOString().split('T')[0];
    
    // Create daily partner records with date
    const dailyPartners = await Promise.all(
      partners.map(async (partner) => {
        const dailyPartner = new DailyPartnerDetails({
          partnerType: partner.partnerType,
          partnerName: partner.partnerName,
          partnerMobile: partner.partnerMobile,
          partnerAddress: partner.partnerAddress || "",
          partnerPhoto: partner.partnerPhoto || "",
          partnerIdProof: partner.partnerIdProof || "",
          longitude: partner.longitude || 77.1025,
          latitude: partner.latitude || 28.7041,
          createdBy: user._id,
          createdByModel: userModel,
          checkInDate: currentDate, // Store the check-in date
        });

        return await dailyPartner.save();
      })
    );

    res.status(200).json({
      success: true,
      message: `${partners.length} partners checked in successfully`,
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

// Add a new endpoint to get today's check-ins
router.get("/dailyPartners/today", verification, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const dailyPartners = await DailyPartnerDetails.find({ checkInDate: today })
      .populate("createdBy")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: dailyPartners,
    });
  } catch (error) {
    console.error("Get today's partners error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;