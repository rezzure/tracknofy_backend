const Client = require("../../Schema/client.schema/client.model");
const Site = require("../../Schema/site.Schema/site.model");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");


const addSite = async (req, res) => {
  try {
    const { siteName, address, client, supervisor } = req.body;
    
    // Find client and supervisor
    const clientdata = await Client.findOne({ email: client });
    const supervisordata = await Supervisor.findOne({ email: supervisor });

    if (!clientdata) {
      return res.status(404).send({
        success: false,
        message: "Client Not Found",
      });
    }

    if (!supervisordata) {
      return res.status(404).send({
        success: false,
        message: "Supervisor Not Found",
      });
    }

    // Create new site
    const siteDetail = new Site({
      siteName: siteName,
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
    if (!supervisordata.site_name.includes(siteName)) {
      supervisordata.site_name.push(siteName);
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
    clientdata.sitename = siteName;
    clientdata.supervisorId = supervisordata._id
    clientdata.supervisor_name = supervisordata.name; // Use DB value, not req.body
    await clientdata.save();

    res.status(200).send({
      success: true,
      message: "New Site Created",
      data: siteDetail,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error: " + err.message,
    });
  }
}
module.exports=addSite