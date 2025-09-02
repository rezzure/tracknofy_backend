const Role = require("../../Schema/addRole.schema/addRole.model");

const deleteRole = async (req, res) => {
  const { _id } = req.params;
  
  try {
    // Check if role exists
    const role = await Role.findById(_id);
    if (!role) {
      return res.status(404).send({
        success: false,
        message: "Role not found"
      });
    }
    
    // Delete role
    await Role.findByIdAndDelete(_id);
    
    return res.status(200).send({
      success: true,
      message: "Role deleted successfully"
    });
    
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error: " + err.message,
    });
  }
};

module.exports = deleteRole