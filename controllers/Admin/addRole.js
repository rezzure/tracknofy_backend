const Role = require("../../Schema/addRole.schema/addRole.model");
const Admin = require("../../Schema/admin.schema/admine.model");
const addRole = async (req, res) => {
  const { roleName, description, features, isActive, adminEmail } = req.body;
  console.log("Received data:", { roleName, description, features, adminEmail });
  
  try {
    // Check if role already exists
    const existingRole = await Role.findOne({ roleName: roleName });
    
    if (existingRole) {
      return res.status(409).send({
        success: false,
        message: "Role already exists"
      });
    }
    
    let createdBy = null;
    
   
    if (adminEmail) {
      const admin = await Admin.findOne({ email: adminEmail });
      if (!admin) {
        return res.status(404).send({
          success: false,
          message: "Admin not found"
        });
      }
      createdBy = admin._id;
    }
    
   
    const transformedFeatures = features.map(feature => ({
      featureName: feature.featureName,
      path: feature.path,
      icon:feature.icon
    }));
    
    // Create new role
    const newRole = new Role({
      roleName: roleName,
      description: description,
      features: transformedFeatures,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: createdBy
    });
    
    await newRole.save();
    
    return res.status(201).send({
      success: true,
      message: "New role created successfully",
      data: newRole
    });
    
  } catch (err) {
    console.error("Error creating role:", err);
    return res.status(500).send({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
};

module.exports = addRole