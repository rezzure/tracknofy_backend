const MasterItem = require("../../Schema/AddDataDictionary.schema/MasterItem.model");
const MasterTypeConfig = require("../../Schema/addMasterType.schema/addMasterType.model");
const Quotation = require("../../Schema/interior.schema/quotation.model");

const updateQuotation = async (req, res) => {
  try {
    const { _id } = req.params;
    const { projectTypeId, scopeOfWork, workItems } = req.body;
    const email = req.query.email || "admin";
    console.log(projectTypeId, scopeOfWork, workItems)
    // Validate required fields
    if (!projectTypeId || !scopeOfWork || !workItems || workItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Project type, scope of work, and at least one work item are required"
      });
    }

    // Check if quotation exists
    const existingQuotation = await Quotation.findById(_id);
    
    if (!existingQuotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found"
      });
    }

    const projectTypeData = await MasterItem.findById(projectTypeId);
    
    if (!projectTypeData) {
      return res.status(404).json({
        success: false,
        message: "Project type not found"
      });
    }

    // Transform workItems array of strings or objects to array of objects with item field
    const formattedWorkItems = workItems.map(item => {
      if (typeof item === 'object' && item.item) {
        return { item: item.item };
      }
      return { item: String(item) };
    });

    // Update quotation
    const updatedQuotation = await Quotation.findByIdAndUpdate(
      _id,
      {
        projectTypeId,
        projectType: projectTypeData.master_type_name,
        scopeOfWork,
        workItems: formattedWorkItems,
        updatedAt: new Date(),
        // Remove $set for createdBy as it should not be updated here
      },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      message: 'Quotation updated successfully',
      data: updatedQuotation
    });
  } catch (error) {
    console.error("Error updating quotation:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = updateQuotation;