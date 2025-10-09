const Design = require("../../Schema/designApproval.schema/designApproval.model");

const getDesign = async (req, res) => {
  try {
    const { siteId } = req.params;

    const designs = await Design.find({ siteId: siteId }).sort({ createdAt: -1 });

    // Log each design's image data
    designs.forEach((design, index) => {
      console.log(`Design ${index + 1}:`, {
        title: design.title,
        imagePath: design.image?.path,
        fileName: design.fileName,
        fileType: design.fileType
      });
    });

    return res.status(200).send({
      success: true,
      message: "Designs fetched successfully",
      data: designs
    });
  }
  catch (err) {
    console.error("Error fetching designs:", err);
    res.status(500).send({
      success: false,
      message: "Internal server error: " + err.message
    });
  }
}

module.exports = getDesign;