const MaterialMaster = require('../../Schema/materialMaster.schema/materialMaster.model')
const Supervisor = require('../../Schema/supervisor.schema/supervisor.model')

const addMaterialMaster = async (req, res) =>{
    const email = req.query.email
    console.log(email)
    // const {materialType, materialName,materialSize, materialRate,remarks, materialBrand, date} = req.body
    try {
            const {materialType, materialName,materialSize, materialRate, remarks, materialBrand, date} = req.body
        if(!materialName){
            return res.status(400).send({
                success:false,
                message: "Material name required"
            })
        }
        const supervisor = await Supervisor.findOne({email:email})
        console.log(supervisor)
        const materialPhotoFile = req.files?.['materialPhoto']?.[0];
        if(!supervisor){
            return res.status(400).send({
                success:false,
                message: "Supervisor not found"
            })
        }
        const materialData = new MaterialMaster({
            materialType: materialType,
            materialName: materialName,
            materialRate:materialRate,
            materialSize:materialSize,
            materialBrand:materialBrand,
            remarks:remarks,
             ...(materialPhotoFile && { materialPhoto: materialPhotoFile.path }),
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