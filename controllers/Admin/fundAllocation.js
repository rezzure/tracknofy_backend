const Admin = require("../../Schema/admin.schema/admine.model")
const FundAllocation = require("../../Schema/fundAllocation.schema/fundAllocation.model");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");

const allocateFund = async (req, res) => {
  try {
    //  Get and validate input
    const { amount, date, purpose, site, supervisorId} = req.body;
    const email = req.query.email
    if (!amount || !date || !purpose || !site || !supervisorId) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }
    const supervisor = await Supervisor.findById(supervisorId);
    const admin = await Admin.findOne({email:email})
    console.log(admin)
    if (!supervisor) {
      return res.status(404).json({ 
        success: false, 
        message: "Supervisor not found" 
      });
    }

    //  Create fund allocation
    const fundAllocation = new FundAllocation({
      amount,
      date,
      purpose,
      site,
      supervisorName: supervisor.name,
      supervisorId,
      status: "approved"
    });

    //  Update 
    supervisor.total_payment += Number(amount);
    supervisor.balance_amount += Number(amount);
    // admin.totalReceived -=Number(amount)
    admin.totalAllocated +=Number(amount)

    //  Save everything
    await fundAllocation.save();
    await supervisor.save();
    await admin.save()

    //  Send success response
    res.status(200).json({
      success: true,
      message: "Fund allocated successfully",
      data: fundAllocation
    });

  } catch (error) {
    console.error("Allocation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during allocation"
    });
  }
};

module.exports = allocateFund;