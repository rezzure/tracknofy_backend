const express = require("express");
const router = express.Router();
const DailyPartnerDetails = require("../../Schema/dailyPartnerDetails.schema/dailyPartnerDetails.model.js");
const Admin = require("../../Schema/admin.schema/admine.model.js");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model.js");
const verification = require("../../middleware/verification.js");

router.post("/export/dailyPartners", verification, async (req, res) => {
  try {
    const { partners } = req.body;
    const email = req.query.email;

    if (!partners || !Array.isArray(partners) || partners.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No partners data provided" });
    }

    let user = await Admin.findOne({ email });
    let userModel = "Admin";

    if (!user) {
      user = await Supervisor.findOne({ email });
      userModel = "Supervisor";
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const dailyPartners = await Promise.all(
      partners.map(async (partner) => {
        // **FIX**: Use the date and time sent from the frontend
        if (!partner.checkInDate || !partner.checkInTime) {
          throw new Error("Missing check-in date or time for a partner.");
        }

        const dailyPartner = new DailyPartnerDetails({
          partnerType: partner.partnerType,
          partnerName: partner.partnerName,
          partnerMobile: partner.partnerMobile,
          partnerAddress: partner.partnerAddress || "",
          partnerPhoto: partner.partnerPhoto || "",
          partnerIdProof: partner.partnerIdProof || "",
          longitude: partner.longitude,
          latitude: partner.latitude,
          createdBy: user._id,
          createdByModel: userModel,
          checkInDate: partner.checkInDate, // <-- USE FRONTEND VALUE
          checkInTime: partner.checkInTime, // <-- USE FRONTEND VALUE
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
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Internal server error",
      });
  }
});

// --- (The rest of the routes in this file are correct and do not need changes) ---

router.get("/by-date", verification, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date)
      return res
        .status(400)
        .json({ success: false, message: "Date parameter is required" });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid date format. Use YYYY-MM-DD.",
        });

    const dailyPartners = await DailyPartnerDetails.find({
      checkInDate: date,
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: dailyPartners });
  } catch (error) {
    console.error("Get partners by date error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/dates-with-checkins", verification, async (req, res) => {
  try {
    const datesWithCheckins = await DailyPartnerDetails.distinct("checkInDate");
    res.status(200).json({ success: true, data: datesWithCheckins });
  } catch (error) {
    console.error("Get dates with checkins error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
