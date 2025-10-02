const Quotation = require("../../Schema/interior.schema/quotation.model");

const addQuotationTask = async(req,res)=>{
  try {
        const {
            projectType,
            projectTypeName,
            scopeOfWork,
            scopeOfWorkName,
            workCategory,
            workItemName,
            workType,
            workTypeName,
            taskName
        } = req.body;

        const createdBy = req.query.email || "admin";

        console.log("Received task data:", req.body);

        // Find the quotation document
        const quotation = await Quotation.findOne({
            projectTypeId: projectType,
            scopeOfWork: scopeOfWorkName,
            "workCategory._id": workCategory,
            "workCategory.workType._id": workType,
            isActive: true
        });

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: "Quotation not found for the selected combination"
            });
        }

        // Find the specific work category
        const workCategoryObj = quotation.workCategory.id(workCategory);
        if (!workCategoryObj) {
            return res.status(404).json({
                success: false,
                message: "Work category not found"
            });
        }

        // Find the specific work type
        const workTypeObj = workCategoryObj.workType.id(workType);
        if (!workTypeObj) {
            return res.status(404).json({
                success: false,
                message: "Work type not found"
            });
        }

        // Check if task already exists
        const existingTask = workTypeObj.task.workTask.find(
            task => task === taskName
        );

        if (existingTask) {
            return res.status(400).json({
                success: false,
                message: "Task already exists for this work type"
            });
        }

        // Add the new task
        workTypeObj.task.workTask.push(taskName);
        quotation.updatedAt = new Date();

        await quotation.save();

        res.status(201).json({
            success: true,
            message: "Task added successfully",
            data: {
                quotationId: quotation._id,
                projectType: quotation.projectType,
                scopeOfWork: quotation.scopeOfWork,
                workCategory: workCategoryObj.item,
                workType: workTypeObj.subItem,
                taskName: taskName
            }
        });
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

  module.exports =addQuotationTask
