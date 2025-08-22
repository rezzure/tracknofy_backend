const Ledger = require("../../Schema/ledger.schema/ledger.model")

const getLedgerData = async (req,res)=>{
try {
  const ledgerData = await Ledger.find()
  console.log(ledgerData)
  if(ledgerData.length === 0){
    return res.status(404).send({
      success:flase,
      message:"Data not Found"
    })
  }
  return res.status(200).send({
    success:true,
    message:"data found",
    data:ledgerData
  })
} catch (error) {
  return res.status(500).send({
    success:flase,
    message:`Internal Server Error :- ${error.message}`
  })
}
}

module.exports = getLedgerData