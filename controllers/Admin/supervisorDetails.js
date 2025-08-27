const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");


const getSupervisorDetail = async (req, res) => {
  try {
    const supervisors = await Supervisor.find();
    if (!supervisors || supervisors.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Supervisors Found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Supervisors Fetched Successfully",
      number_of_supervisors: supervisors.length,
      data: supervisors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: `Internal Server Error :- ${err.message}`,
    });
  }
}
module.exports=getSupervisorDetail