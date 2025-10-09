// const User = require("../../Schema/users.schema/users.model");
// const Admin = require("../../Schema/admin.schema/admine.model");
// const Client = require("../../Schema/client.schema/client.model");
// const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");
// const feature = require("../../Schema/addFeature.schema/addFeature.model")
// const bcrypt = require("bcrypt")

// const createUser = async (req, res) => {
//   const { name, email, mobile, role, password ,features } = req.body;

//   let user = await User.findOne({ email });
//   let result = await feature.find({
//       _id: { $all: features }

//   })
//   console.log(result)
//   if (user) {
//     res.send({
//       success: false,
//       message: "Email Already Exist",
//     });
//   }

//   let salt = await bcrypt.genSalt(10);
//   let hashPassword = await bcrypt.hash(password, salt);
//   console.log(hashPassword);
//  const data ={
//     name: name,
//     role: role.toString().toLowerCase(),
//     email: email.toLowerCase(),
//     password: hashPassword,
//     mobile: mobile,
//     featureId:result,
//     featuresName:result.map(feature => feature.featureName),
//   }
//   user = await User.create(data);
//   if(role === "admin"){
//     await Admin.create(data)
//   }
//   if(role === "client"){
//     await Client.create(data)
//   }
//   if(role === "supervisor"){
//     await Supervisor.create(data)
//   }
//   user.password = "";
//   res.send({
//     success: true,
//     message: "User Created Sucessfully",
//     data: user,
//   });
// }
// module.exports=createUser



// fixed client 


const User = require("../../Schema/users.schema/users.model");
const Admin = require("../../Schema/admin.schema/admine.model");
const Client = require("../../Schema/client.schema/client.model");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");
const feature = require("../../Schema/addFeature.schema/addFeature.model")
const bcrypt = require("bcrypt")

const createUser = async (req, res) => {
  try {
    const { name, email, mobile, role, password, features } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.send({
        success: false,
        message: "Email Already Exist",
      });
    }

    // Hash password
    let salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);

    // Get features if provided
    let result = [];
    if (features && features.length > 0) {
      result = await feature.find({
        _id: { $in: features }
      });
    }

    // Create base user data
    const userData = {
      name: name,
      role: role.toString().toLowerCase(),
      email: email.toLowerCase(),
      password: hashPassword,
      mobile: mobile,
    };

    // Add features only if they exist
    if (result.length > 0) {
      userData.featureId = result;
      userData.featuresName = result.map(feature => feature.featureName);
    }

    // Create user in main User collection
    user = await User.create(userData);

    // Create role-specific document
    const roleSpecificData = {
      name: name,
      email: email.toLowerCase(),
      mobile: mobile,
      password: hashPassword,
      userId: user._id, // Reference to the main user
    };

    // Add features to role-specific data if they exist
    if (result.length > 0) {
      roleSpecificData.featureId = result;
      roleSpecificData.featuresName = result.map(feature => feature.featureName);
    }

    // Create role-specific document
    if (role.toLowerCase() === "admin") {
      await Admin.create(roleSpecificData);
    } else if (role.toLowerCase() === "client") {
      await Client.create(roleSpecificData);
    } else if (role.toLowerCase() === "supervisor") {
      await Supervisor.create(roleSpecificData);
    }

    // Remove password from response
    user.password = "";

    res.send({
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.send({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
}

module.exports = createUser;