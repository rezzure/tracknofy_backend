const User = require("../../Schema/users.schema/users.model");
const Admin = require("../../Schema/admin.schema/admine.model");
const Client = require("../../Schema/client.schema/client.model");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");
const feature = require("../../Schema/addFeature.schema/addFeature.model")
const bcrypt = require("bcrypt")

const createUser = async (req, res) => {
  const { name, email, mobile, role, password ,features } = req.body;

  let user = await User.findOne({ email });
  let result = await feature.find({
      _id: { $all: features }

  })
  console.log(result)
  if (user) {
    res.send({
      success: false,
      message: "email already exist",
    });
  }

  let salt = await bcrypt.genSalt(10);
  let hashPassword = await bcrypt.hash(password, salt);
  console.log(hashPassword);
 const data ={
    name: name,
    role: role.toString().toLowerCase(),
    email: email.toLowerCase(),
    password: hashPassword,
    mobile: mobile,
    featureId:result,
    featuresName:result.map(feature => feature.featureName),
  }
  user = await User.create(data);
  if(role === "admin"){
    await Admin.create(data)
  }
  if(role === "client"){
    await Client.create(data)
  }
  if(role === "supervisor"){
    await Supervisor.create(data)
  }
  user.password = "";
  res.send({
    success: true,
    message: "user created sucessfully",
    data: user,
  });
}
module.exports=createUser