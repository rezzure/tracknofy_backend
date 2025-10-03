const Quotation = require("../../Schema/interior.schema/quotation.model");

 const getQuotationTask = async (req, res) => {

    try {
        const quotations = await Quotation.find()
        if(quotations.length === 0){
          return res.status(400).send({
            success:true,
            message:"Data not found"
          })
        }

        // // Extract all tasks from the nested structure
        // const allTasks = quotations.flatMap(quotation => 
        //     quotation.workCategory.flatMap(workCategory =>
        //         workCategory.workType.flatMap(workType =>
        //             workType.task.workTask.map(task => ({
        //                 _id: `${quotation._id}-${workCategory._id}-${workType._id}-${task}`,
        //                 quotationId: quotation._id,
        //                 projectTypeId: quotation.projectTypeId,
        //                 projectTypeName: quotation.projectType,
        //                 scopeOfWorkId: quotation._id,
        //                 scopeOfWorkName: quotation.scopeOfWork,
        //                 workCategoryId: workCategory._id,
        //                 workItemName: workCategory.item,
        //                 workTypeId: workType._id,
        //                 workTypeName: workType.subItem,
        //                 taskName: task,
        //                 createdAt: quotation.createdAt,
        //                 updatedAt: quotation.updatedAt
        //             }))
        //         )
        //     )
        // );

        res.status(200).json({
            success: true,
            message: "Tasks fetched successfully",
            data: quotations
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
module.exports = getQuotationTask