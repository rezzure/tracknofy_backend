const UserDetails = require("../../../Schema/UserDetails.schema/UserDetails.model");

const getUserDetails = async (req, res) => {
  try {
    const userDetails = await UserDetails.find({ status: "active" })
      .sort({ createdAt: -1 });

    // Add full URL to image paths
    const userDetailsWithFullUrls = userDetails.map((detail) => {
      const detailObj = detail.toObject ? detail.toObject() : detail;
      
      if (detailObj.images && detailObj.images.length > 0) {
        const imagesWithUrls = detailObj.images.map((image) => ({
          ...image,
          url: `${req.protocol}://${req.get("host")}/uploads/${image.filename}`,
        }));
        return {
          ...detailObj,
          images: imagesWithUrls,
        };
      }
      return detailObj;
    });

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: userDetailsWithFullUrls,
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
};

module.exports = getUserDetails;