const UserDetails = require("../../Schema/UserDetails.schema/UserDetails.model");
const fs = require("fs");
const path = require("path");

const deleteUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user details first to get image paths
    const userDetails = await UserDetails.findById(id);
    
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User details not found",
      });
    }

    // Delete associated image files from the server
    if (userDetails.images && userDetails.images.length > 0) {
      userDetails.images.forEach((image) => {
        if (image.path && fs.existsSync(image.path)) {
          try {
            fs.unlinkSync(image.path);
            console.log(`Deleted image: ${image.path}`);
          } catch (fileError) {
            console.error(`Error deleting file ${image.path}:`, fileError);
          }
        }
      });
    }

    // Delete the user details from database
    const deletedDetails = await UserDetails.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User details deleted successfully",
      data: deletedDetails,
    });
  } catch (err) {
    console.error("Error deleting user details:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
};

module.exports = deleteUserDetails;