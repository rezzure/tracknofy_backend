// dailyPartnerDetails.routes.js
const express = require("express");
const router = express.Router();
const DailyPartnerDetails = require("../../Schema/dailyPartnerDetails.schema/dailyPartnerDetails.model.js");
const Admin = require("../../Schema/admin.schema/admine.model.js");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model.js");
const verification = require("../../middleware/verification.js");

// Export partners endpoint
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

    // Find the user
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
          checkInDate: partner.checkInDate || new Date().toISOString().split('T')[0],
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
    });
  }
});

// Get today's check-ins
router.get("/today", verification, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const dailyPartners = await DailyPartnerDetails.find({ checkInDate: today })
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

// Get check-ins by date range for calendar
router.get("/by-date-range", verification, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const dailyPartners = await DailyPartnerDetails.find({
      checkInDate: { $gte: startDate, $lte: endDate }
    }).sort({ checkInDate: -1, createdAt: -1 });

    // Group by date for calendar view
    const groupedByDate = dailyPartners.reduce((acc, partner) => {
      if (!acc[partner.checkInDate]) {
        acc[partner.checkInDate] = [];
      }
      acc[partner.checkInDate].push(partner);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: groupedByDate,
    });
  } catch (error) {
    console.error("Get partners by date range error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get dates with check-ins for calendar
router.get("/dates-with-checkins", verification, async (req, res) => {
  try {
    const { year, month } = req.query;
    
    let dateFilter = {};
    if (year && month) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endDate = `${year}-${month.padStart(2, '0')}-31`;
      dateFilter = { checkInDate: { $gte: startDate, $lte: endDate } };
    }

    const datesWithCheckins = await DailyPartnerDetails.distinct("checkInDate", dateFilter);
    
    res.status(200).json({
      success: true,
      data: datesWithCheckins,
    });
  } catch (error) {
    console.error("Get dates with checkins error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;