const MaterialMaster = require("../../Schema/materialMaster.schema/materialMaster.model")
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model")

const updateMaterialMaster = async (req, res) =>{
    const {_id} = req.params
     const {materialType, materialName, materialSize, measurementType, materialRate, remarks, materialBrand, email, date} = req.body
     const materialPhotoFile = req.file?.['materialPhoto']?.[0];

     try {
        const materialDetail = await MaterialMaster.findById(_id)
        const supervisor = await Supervisor.findOne({email:email})
        if(!materialDetail){
            return res.status(404).send({
                success: false,
                message: "Material Data Not Found"
            })
        }
        if(materialType) materialDetail.materialType = materialType
        if(materialName) materialDetail.materialName = materialName
        if(materialSize) materialDetail.materialSize = materialSize
        if(measurementType) materialDetail.measurementType = measurementType
        if(materialRate) materialDetail.materialRate = materialRate
        if(materialBrand) materialDetail.materialBrand = materialBrand
        if(materialPhotoFile) materialDetail.materialPhoto = materialPhotoFile.filename;
        if(remarks) materialDetail.remarks = remarks
        if(materialDetail.createdBy.toString() !== supervisor._id.toString()) materialDetail.createdBy = supervisor._id
        materialDetail.createdAt = date
        const savedData = await materialDetail.save()
        return res.status(200).send({
            success: true,
            message: "Material Details Updated",
            data: savedData
        })
     } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error:- ${error.message}`
        })
     }
}    

module.exports = updateMaterialMaster