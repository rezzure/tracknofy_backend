const Feature =require('../../Schema/addFeature.schema/addFeature.model')

const addFeature = async(req,res)=>{
    const{featureName,description,isActive,createdBy}=req.body;
    try {
        const feature = await Feature.findOne({name:featureName});
        if(feature){
            return res.send({
                success:false,
                message:"feature already exist"
            })
        }
        const data = new Feature({
            featureName:featureName,
            description:description,
            isActive:isActive,
            createdBy:createdBy
        })
        await data.save();
        return res.status(200).send({
            success:true,
            message:"feature created...",
            data:data
        })

    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"error:- "+error.message
        })
    }
}

module.exports =addFeature