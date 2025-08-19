const Client = require("../../Schema/client.schema/client.model");


const getClientDetails = async (req, res) => {
  try {
    const clientdata = await Client.find();
    if (!clientdata || clientdata.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No supervisors found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Client fetched successfully",
      number_of_Client: clientdata.length,
      data: clientdata,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
}

module.exports=getClientDetails