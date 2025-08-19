const Admin = require('../../Schema/admin.schema/admine.model')
const MaterialMaster = require('../../Schema/materialMaster.schema/materialMaster.model')

const addMaterialMaster = async (req, res) =>{
    const {materialType, materialName, email, date} = req.body
    try {
        if(!materialName){
            return res.status(400).send({
                success:false,
                message: "Material name required"
            })
        }
        const admin = await Admin.findOne({email:email})
        if(!admin){
            return res.status(400).send({
                success:false,
                message: "Admin not found"
            })
        }
        const materialData = new MaterialMaster({
            materialType: materialType,
            materialName: materialName,
            createdBy: admin._id,
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