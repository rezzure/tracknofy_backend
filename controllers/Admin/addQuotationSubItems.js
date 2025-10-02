const Quotation = require("../../Schema/interior.schema/quotation.model")
const addQuotationSubItems = async(req,res)=>{
    // const {itemId,workType} = req.body
    const {workCategory,workType} = req.body
    console.log(workCategory)
    console.log(workCategory,workType)
    try {
        const data = await Quotation.findOne({
            workCategory:{
                $elemMatch:{
                    _id:workCategory
                }
            }
        })
        if(!data){
            return res.status(400).send({
                success:false,
                message:"Data Not Found"
            })
        }
        // console.log(data)

        const workTypeData = data.workCategory.find(item => item._id.toString() === workCategory.toString())
        console.log(workTypeData)
        if (workTypeData) {
            const newType = workType.map(item => ({ type: item }));
            // Then, push these new objects into the existing array
            workTypeData.workType.push(...newType); 
            await data.save();
            res.send({
                success: true,
                message: "WorkType Added",
                data:data
            });
        } else {
            res.send({
                success: false,
                message: "Work item not found"
            });
        }
    } catch (error) {
        console.log(error)
        res.send({
            success:false,
            message:`Internal Server Error:- ${error.message}`
        })
    }
}
module.exports = addQuotationSubItems