const Admin = require("../../Schema/admin.schema/admine.model");
const BoqRateMaster = require("../../Schema/boqRateMaster.schema/boqRateMaster.model");

const addBoqRateMaster = async (req, res) => {
  const email = req.query.email;
  console.log(email);
  const {workItem, base_rate, baseRateDescription, average_rate, averageRateDescription, premium_rate, premiumRateDescription, remarks} = req.body;

  console.log(workItem, base_rate, baseRateDescription, average_rate, averageRateDescription, premium_rate, premiumRateDescription, remarks)


  try {
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(404).send({
        success: false,
        message: "Admin data not found",
      });
    }

    const boqRateData = new BoqRateMaster({
      workItem: workItem,
      baseRate: {
        rate: base_rate,
        rateDescription: baseRateDescription,
      },
      averageRate: {
        rate: average_rate,
        rateDescription: averageRateDescription,
      },
      premiumRate: {
        rate: premium_rate,
        rateDescription: premiumRateDescription,
      },
      remarks:remarks,
      createdBy: admin._id,
      updatedAt: Date.now(),
    });
    await boqRateData.save();
    return res.status(200).send({
      success: true,
      message: "BoqRate Master created successfully",
      data: boqRateData,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

module.exports = addBoqRateMaster;
