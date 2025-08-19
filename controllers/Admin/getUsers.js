const User = require("../../Schema/users.schema/users.model");


const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.send({
        success: false,
        message: `there are no user with this role ${role}`,
      });
    }

    users.forEach((user) => {
      user.password = "";
    });

    res.status(200).send({
      success: true,
      message: "data fetch sucess",
      number_of_user: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Internal server error" + err.message,
    });
  }
}

module.exports=getUsers