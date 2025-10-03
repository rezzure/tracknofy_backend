const mongoose = require('mongoose');
const Quotation = require('../../Schema/interior.schema/quotation.model');

const updateWorkTypeTasks = async (req, res) => {
  try {
    const { id } = req.params; // This is the workType ID
    const { taskNames } = req.body; // Array of task names

    console.log("🔄 Updating tasks for workType ID:", id);
    console.log("New task names:", taskNames);

    // Validate input
    if (!taskNames || !Array.isArray(taskNames)) {
      return res.status(400).json({
        success: false,
        message: "taskNames array is required"
      });
    }

    // Find the quotation that contains this workType
    const quotation = await Quotation.findOne({
      "workCategory.workType._id": id
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "WorkType not found"
      });
    }

    // Find the workType in the quotation
    let workTypeFound = false;
    
    quotation.workCategory.forEach(category => {
      category.workType.forEach(workType => {
        if (workType._id.toString() === id) {
          workTypeFound = true;
          
          // Initialize task object if it doesn't exist
          if (!workType.task) {
            workType.task = { workTask: [] };
          }
          
          // Update the task array
          workType.task.workTask = taskNames.map(task => task.trim().toUpperCase().replace(/\s+/g, '_'));
        }
      });
    });

    if (!workTypeFound) {
      return res.status(404).json({
        success: false,
        message: "WorkType not found in quotation"
      });
    }

    // Update timestamp and save
    quotation.updatedAt = new Date();
    await quotation.save();

    console.log("✅ Tasks updated successfully");

    res.status(200).json({
      success: true,
      message: "Tasks updated successfully",
      data: {
        workTypeId: id,
        taskNames: taskNames
      }
    });

  } catch (error) {
    console.error("❌ Error updating tasks:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = updateWorkTypeTasks;