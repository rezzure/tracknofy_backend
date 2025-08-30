const MaterialMaster = require('../../Schema/materialMaster.schema/materialMaster.model')
const Supervisor = require('../../Schema/supervisor.schema/supervisor.model')

const addMaterialMaster = async (req, res) =>{
    const email = req.query.email
    // console.log(email)
   
    try {
         const {materialType, materialName, materialSize, measurementType, materialRate, remarks, materialBrand, date} = req.body
          console.log(materialType, materialName,materialSize, measurementType, materialRate, remarks, materialBrand, date)

            
        if(!materialName){
            return res.status(400).send({
                success:false,
                message: "Material Name Required"
            })
        }
        const supervisor = await Supervisor.findOne({email:email})
        // console.log(supervisor)
        const materialPhotoFile = req.file?.['materialPhoto']?.[0];
        console.log(materialPhotoFile)
        if(!supervisor){
            return res.status(400).send({
                success:false,
                message: "Supervisor Not Found"
            })
        }
        const materialData = new MaterialMaster({
            materialType: materialType,
            materialName: materialName,
            materialRate:materialRate,
            materialSize:materialSize,
            measurementType:measurementType,
            materialBrand:materialBrand,
            remarks:remarks,
             ...(materialPhotoFile && { materialPhoto: materialPhotoFile.path }),
            createdBy: supervisor._id,
            createdAt: date
        })
        await materialData.save()
        return res.status(200).send({
            success:true,
            message: "Material Created",
            data:materialData
        })
    } catch (error) { 
        console.log(error.message)
        return res.status(500).send({
            success: false,
            message: `Internal server error:- ${error.message}`
        })
    }
}

module.exports = addMaterialMaster