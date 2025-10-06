const Admin = require("../../Schema/admin.schema/admine.model");
const MasterTypeConfig = require("../../Schema/addMasterType.schema/addMasterType.model")

const addMasterType = async (req, res) => {
    const email = req.query.email

    try {
        const { master_type_name, master_type_description, date} = req.body
        console.log(master_type_name, master_type_description)

         // Validate required fields
        // if (!master_type_name) {
        //     return res.status(400).send({
        //         success: false,
        //         message: 'master_type_name is required fields must be provided'
        //     });
        // }
        const admin = await Admin.findOne({email:email})
console.log("line 1")
        const newMasterType = new MasterTypeConfig({
            master_type_name,
            master_type_description,
            created_by:admin._id,
            createdAt:date,
        });
        console.log("line 2")
        await newMasterType.save();
console.log("line 3")
        res.status(201).send({
            success: true,
            message: 'Master Type added successfully',
            data: newMasterType
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

module.exports=addMasterType