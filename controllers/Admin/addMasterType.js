const Admin = require("../../Schema/admin.schema/admine.model");
const MasterTypeConfig = require("../../Schema/addMasterType.schema/addMasterType.model")

const addMasterType = async (req, res) => {
    const email = req.query.email

    try {
        const {master_type_id, master_type_name, master_type_description, date} = req.body

         // Validate required fields
        if (!master_type_id || !master_type_name || !master_type_description) {
            return res.status(400).send({
                success: false,
                message: 'All required fields must be provided'
            });
        }
        const admin = await Admin.findOne({email:email})

        const newMasterType = new MasterTypeConfig({
            master_type_id,
            master_type_name,
            master_type_description,
            created_by:admin._id,
            createdAt:date,
        });
        await newMasterType.save();

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