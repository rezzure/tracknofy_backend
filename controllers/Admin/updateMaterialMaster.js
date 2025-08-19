const MaterialMaster = require("../../Schema/materialMaster.schema/materialMaster.model")
const Admin = require("../../Schema/admin.schema/admine.model")

const updateMaterialMaster = async (req, res) =>{
    const {_id} = req.params
     const {materialType, materialName, email, date} = req.body

     try {
        const materialDetail = await MaterialMaster.findById(_id)
        const admin = await Admin.findOne({email:email})
        if(!materialDetail){
            return res.status(404).send({
                success: false,
                message: "Material data not found"
            })
        }
        if(materialType) materialDetail.materialType = materialType
        if(materialName) materialDetail.materialName = materialName
        if(materialDetail.createdBy.toString() !== admin._id.toString()) materialDetail.createdBy = admin._id
        materialDetail.createdAt = Date.now()
        const savedData = await materialDetail.save()
        return res.status(200).send({
            success: true,
            message: "Material details updated successfully",
            data: savedData
        })
     } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error ${error.message}`
        })
     }
}    

module.exports = updateMaterialMaster