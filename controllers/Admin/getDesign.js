const Design = require("../../Schema/designApproval.schema/designApproval.model");

// In your getDesign controller
// In your getDesign controller
const getDesign = async (req, res) => {
  try {
    const { siteId } = req.params;

    const designs = await Design.find({ 
      siteId: siteId,
      isActive: true // Only show active designs
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

    const formattedDesigns = designs.map(design => ({
      _id: design._id,
      siteId: design.siteId,
      siteName: design.siteName,
      floorName: design.floorName || '',
      scopeOfWork: design.scopeOfWork || '',
      workItem: design.workItem || '',
      workType: design.workType || '',
      imageType: design.imageType || '',
      title: design.title || '',
      description: design.description || '',
      
      // Current version data
      images: design.images || [],
      fileName: design.fileName || '',
      fileType: design.fileType || '',
      status: design.status || 'pending',
      versionNumber: design.versionNumber || 0,
      versionChanges: design.versionChanges || '',
      
      // Include version history count
      versionHistoryCount: design.versionHistory?.length || 0,
      
      createdBy: design.createdBy?._id,
      createdByName: design.createdBy?.name || design.createdByName || 'Unknown',
      createdByModel: design.createdByModel || '',
      createdAt: design.createdAt,
      updatedAt: design.updatedAt,
      comments: design.comments || [],
      workflow_remark: design.workflow_remark || '',
      isChatEnabled: design.isChatEnabled !== false
    }));

    return res.status(200).send({
      success: true,
      message: "Designs fetched successfully",
      data: formattedDesigns
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

// In your backend - Fix the getDesignVersions function
const getDesignVersions = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching versions for design ID:", id);

    const design = await Design.findById(id);
    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found"
      });
    }

    console.log("Current design version:", design.versionNumber);
    console.log("Version history count:", design.versionHistory?.length || 0);

    // Create current version object
    const currentVersion = {
      _id: design._id,
      versionNumber: design.versionNumber,
      images: design.images || [],
      fileName: design.fileName,
      fileType: design.fileType,
      versionChanges: design.versionChanges || "",
      status: design.status,
      comments: design.comments || [],
      isChatEnabled: design.isChatEnabled !== false,
      createdAt: design.createdAt,
      updatedAt: design.updatedAt,
      createdBy: design.createdBy,
      createdByModel: design.createdByModel,
      isLatestVersion: true,
      // Include all design metadata
      siteId: design.siteId,
      siteName: design.siteName,
      floorName: design.floorName,
      scopeOfWork: design.scopeOfWork,
      workItem: design.workItem,
      workType: design.workType,
      imageType: design.imageType,
      title: design.title,
      description: design.description,
      workflow_remark: design.workflow_remark || ""
    };

    // Create version history objects
    const versionHistory = (design.versionHistory || []).map(version => ({
      _id: design._id, // Same design ID for all versions
      versionNumber: version.versionNumber,
      images: version.images || [],
      fileName: version.fileName,
      fileType: version.fileType,
      versionChanges: version.versionChanges || "",
      status: version.status,
      comments: version.comments || [],
      isChatEnabled: version.isChatEnabled !== false,
      createdAt: version.createdAt,
      updatedAt: version.updatedAt,
      createdBy: version.createdBy,
      createdByModel: version.createdByModel,
      isLatestVersion: false,
      // Include all design metadata
      siteId: design.siteId,
      siteName: design.siteName,
      floorName: design.floorName,
      scopeOfWork: design.scopeOfWork,
      workItem: design.workItem,
      workType: design.workType,
      imageType: design.imageType,
      title: design.title,
      description: design.description,
      workflow_remark: version.workflow_remark || ""
    }));

    // Combine all versions (current + history)
    const allVersions = [currentVersion, ...versionHistory];
    
    // Sort by version number (newest first)
    allVersions.sort((a, b) => b.versionNumber - a.versionNumber);

    console.log("Returning versions:", allVersions.length);
    allVersions.forEach(v => console.log(`- V${v.versionNumber}, status: ${v.status}, images: ${v.images?.length}`));

    res.json({
      success: true,
      data: allVersions,
      message: "Design versions retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching design versions:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
}

module.exports = {
  getDesign,
  getDesignVersions
};