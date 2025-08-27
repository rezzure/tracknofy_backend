const FundAllocation = require("../../Schema/fundAllocation.schema/fundAllocation.model")
const allocateFund = require("./fundAllocation")

const getAllotedAmountData= async(req,res) =>{
  try {
    const allocatedFund = await FundAllocation.find()
    if(allocatedFund.length === 0){
      return res.status(404).send({
        success:false,
        message:"Data Not Found !!!"
      })
    }
    return res.status(200).send({
      success:true,
      message:"Data Found",
      data:allocatedFund
    })
  } catch (error) {
    return res.status(500).send({
      success:false,
      message: `Internal Server Error :-  ${error.message}`
    })
  }
}
module.exports = getAllotedAmountData