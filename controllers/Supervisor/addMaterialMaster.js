const MaterialMaster = require('../../Schema/materialMaster.schema/materialMaster.model')
const Supervisor = require('../../Schema/supervisor.schema/supervisor.model')

const addMaterialMaster = async (req, res) =>{
    const {materialType, materialName, email, date} = req.body
    try {
        if(!materialName){
            return res.status(400).send({
                success:false,
                message: "Material name required"
            })
        }
        const supervisor = await Supervisor.findOne({email:email})
        if(!supervisor){
            return res.status(400).send({
                success:false,
                message: "Supervisor not found"
            })
        }
        const materialData = new MaterialMaster({
            materialType: materialType,
            materialName: materialName,
            createdBy: supervisor._id,
            createdAt: date
        })
        await materialData.save()
        return res.status(200).send({
            success:true,
            message: "Material data saved successfully",
            data:materialData
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error ${error.message}`
        })
    }
}

module.exports = addMaterialMaster