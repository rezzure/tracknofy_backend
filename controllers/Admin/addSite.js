const Client = require("../../Schema/client.schema/client.model");
const Site = require("../../Schema/site.Schema/site.model");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");


const addSite = async (req, res) => {
  try {
    const { name, address, client, supervisor } = req.body;
    
    // Find client and supervisor
    const clientdata = await Client.findOne({ email: client });
    const supervisordata = await Supervisor.findOne({ email: supervisor });

    if (!clientdata) {
      return res.status(404).send({
        success: false,
        message: "Client not found",
      });
    }

    if (!supervisordata) {
      return res.status(404).send({
        success: false,
        message: "Supervisor not found",
      });
    }

    // Create new site
    const siteDetail = new Site({
      siteName: name,
      address,
      clientId: clientdata._id,
      clientName: clientdata.name,
      supervisorId: supervisordata._id,
      supervisorName: supervisordata.name,
      status: "active",
    });
    
    await siteDetail.save();

    // Update supervisor
    if (!supervisordata.site_name) {
      supervisordata.site_name = []; 
    }
    
    // Add site name if not already present
    if (!supervisordata.site_name.includes(name)) {
      supervisordata.site_name.push(name);
    }

    // Update allocated clients (corrected spelling)
    if (!supervisordata.allotted_client) {
      supervisordata.allotted_client = [];
    }
    
    if (!supervisordata.allotted_client.includes(clientdata._id)) {
      supervisordata.allotted_client.push(clientdata._id);
    }

    await supervisordata.save();

    // Update client
    clientdata.sitename = name;
    clientdata.supervisor_name = supervisordata.name; // Use DB value, not req.body
    await clientdata.save();

    res.status(200).send({
      success: true,
      message: "Site details saved successfully",
      data: siteDetail,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
}
module.exports=addSite