const Quotation = require("../../Schema/interior.schema/quotation.model")
const addQuotationSubItems = async(req,res)=>{
    // const {itemId,subItems} = req.body
    const {workItem,subWorkItems} = req.body
    console.log(workItem,subWorkItems)
    try {
        const data = await Quotation.findOne({
            workItems:{
                $elemMatch:{
                    _id:workItem
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

        const workItemData = data.workItems.find(item => item._id.toString() === workItem.toString())
        if (workItemData) {
            workItemData.subItems = subWorkItems.map(item => ({ subItem: item }));
            await data.save();
            res.send({
                success: true,
                message: "SubItems Added",
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