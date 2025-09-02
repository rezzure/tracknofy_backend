const Admin = require("../../Schema/admin.schema/admine.model");
const MasterItem = require("../../Schema/AddDataDictionary.schema/MasterItem.model")
const MasterTypeConfig = require("../../Schema/addMasterType.schema/addMasterType.model")

const addDataDictionary = async (req, res) => {
    const email = req.query.email
    // console.log(email)

    try {
        const {master_id, master_item_id, master_item_name, master_item_description} = req.body
        // console.log(master_id, master_item_id, master_item_name, master_item_description)

         // Validate required fields
        if (!master_id || !master_item_id || !master_item_name || !master_item_description || !master_id) {
            return res.status(400).send({
                success: false,
                message: 'All required fields must be provided'
            });
        }
        const masterType = await MasterTypeConfig.findById(master_id)
        console.log(masterType)
        const admin = await Admin.findOne({email:email})
        // console.log(admin)

        const newDataDictionary = new MasterItem({
            master_id,
            master_type_name: masterType.master_type_name,
            master_item_id,
            master_item_name,
            master_item_description,
            created_by:admin._id,
            createdAt: Date.now(),
        });
        await newDataDictionary.save();

        res.status(201).send({
            success: true,
            message: 'Data dictionary added successfully',
            data: newDataDictionary
        });

    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

module.exports= addDataDictionary