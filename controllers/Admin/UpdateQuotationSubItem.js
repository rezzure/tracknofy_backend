
const mongoose = require('mongoose');
const Quotation = require('../../Schema/interior.schema/quotation.model');

// Update sub-item
const updateQuotationSubItem = async (req, res) => {
  try {
    const { id } = req.params; // This is the subItem ID
    const {
      projectType,
      scopeOfWork,
      workItem,
      subWorkItems
    } = req.body;

    // Validate required fields
    if (!projectType || !scopeOfWork || !workItem || !subWorkItems || !Array.isArray(subWorkItems)) {
      return res.status(400).json({
        success: false,
        message: "Project Type, Scope of Work, Work Item, and Sub Work Items are required"
      });
    }

    // Find the quotation document
    const quotation = await Quotation.findOne({
      _id: scopeOfWork,
      projectTypeId: projectType
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found for the given Project Type and Scope of Work"
      });
    }

    // Find the work item within the quotation
    const workItemObj = quotation.workItems.id(workItem);

    if (!workItemObj) {
      return res.status(404).json({
        success: false,
        message: "Work Item not found"
      });
    }

    // Find the sub item to update
    const subItemToUpdate = workItemObj.subItems.id(id);

    if (!subItemToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Sub Item not found"
      });
    }

    // Update the sub item (assuming we're updating with the first subWorkItems entry)
    if (subWorkItems.length > 0 && subWorkItems[0].trim() !== '') {
      subItemToUpdate.subItem = subWorkItems[0].trim();
    }

    // Update the timestamp
    quotation.updatedAt = new Date();

    // Save the updated quotation
    await quotation.save();

    res.status(200).json({
      success: true,
      message: "Sub item updated successfully",
      data: subItemToUpdate
    });

  } catch (error) {
    console.error("Error updating sub item:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = updateQuotationSubItem;