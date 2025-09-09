const MasterItem = require("../../Schema/AddDataDictionary.schema/MasterItem.model");
const MasterTypeConfig = require("../../Schema/addMasterType.schema/addMasterType.model");
const Quotation = require("../../Schema/interior.schema/quotation.model");

const addQuotation = async (req, res) => {
  try {
    const { projectTypeId, scopeOfWork, workItems } = req.body;
    console.log(projectTypeId, scopeOfWork, workItems)

    // Validate required fields
    if (!projectTypeId || !scopeOfWork || !workItems || workItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Project type, scope of work, and at least one work item are required'
      });
    }
    
    // Validate that workItems is an array
    if (!Array.isArray(workItems)) {
      return res.status(400).json({
        success: false,
        message: 'Work items must be an array'
      });
    }
    
    const projectTypeData = await MasterItem.findById(projectTypeId);

    if (!projectTypeData) {
      return res.status(404).json({
        success: false,
        message: 'Project type not found'
      });
    }
    
    // Format workItems correctly - ensure each item is stored as {item: "text"}
    const formattedWorkItems = workItems.map(item => {
      // If item is already an object with item property, use it
      if (typeof item === 'object' && item.item) {
        return { item: item.item };
      }
      // If item is a string, wrap it in object
      return { item: String(item) };
    });
    
    const quotationItem = new Quotation({
      projectTypeId,
      projectType: projectTypeData.master_item_name,
      scopeOfWork,
      workItems: formattedWorkItems, // Use the formatted array
      createdBy: req.query.email || "admin",
    });
    
    const newQuotationItem = await quotationItem.save();
    res.status(200).send({
      success: true,
      message: 'Work item saved successfully',
      data: newQuotationItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = addQuotation