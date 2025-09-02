const Role = require("../../Schema/addRole.schema/addRole.model");

const editRole = async (req, res) => {
  const { _id } = req.params;
  const { roleName, description, features, isActive } = req.body;
  console.log(roleName, description, features, isActive )
  
  try {
    // Check if role exists
    const role = await Role.findById(_id);
    if (!role) {
      return res.status(404).send({
        success: false,
        message: "Role not found"
      });
    }
    
    
    if (roleName && roleName !== role.roleName) {
      const existingRole = await Role.findOne({ 
        roleName: roleName, 
        _id: { $ne: _id } // Exclude current role from check
      });
      
      if (existingRole) {
        return res.status(409).send({
          success: false,
          message: "Role name already exists"
        });
      }
    }
    
    // Update role
    const updatedRole = await Role.findByIdAndUpdate(
      _id,
      {
        roleName: roleName || role.roleName,
        description: description || role.description,
        features: features || role.features,
        isActive: isActive !== undefined ? isActive : role.isActive
      },
      { new: true } // Return the updated document
    );
    
    return res.status(200).send({
      success: true,
      message: "Role updated successfully",
      data: updatedRole
    });
    
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error: " + err.message,
    });
  }
};
module.exports = editRole