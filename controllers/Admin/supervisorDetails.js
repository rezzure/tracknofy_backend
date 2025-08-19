const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");


const getSupervisorDetail = async (req, res) => {
  try {
    const supervisors = await Supervisor.find();
    if (!supervisors || supervisors.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No supervisors found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Supervisors fetched successfully",
      number_of_supervisors: supervisors.length,
      data: supervisors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}
module.exports=getSupervisorDetail