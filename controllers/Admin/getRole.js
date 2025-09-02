const Role = require("../../Schema/addRole.schema/addRole.model")
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    if(roles.length === 0){
        return res.status(400).send({
            success:true,
            message:"Role not found"
        })
    }
    
    return res.status(200).send({
      success: true,
      message: "Roles retrieved successfully",
      data: roles
    });
    
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error: " + err.message,
    });
  }
};
module.exports = getRoles