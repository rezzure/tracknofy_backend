const Admin = require("../../Schema/admin.schema/admine.model");
const MasterItem = require("../../Schema/AddDataDictionary.schema/MasterItem.model")

const addDataDictionary = async (req, res) => {
    const email = req.query.email

    try {
        const {master_type, master_item_id, master_item_name, master_item_description, date} = req.body

         // Validate required fields
        if (!master_type || !master_item_id || !master_item_name || !master_item_description) {
            return res.status(400).send({
                success: false,
                message: 'All required fields must be provided'
            });
        }
        const admin = await Admin.findOne({email:email})

        const newDataDictionary = new MasterItem({
            master_type: "",
            master_item_id: "",
            master_item_name: "",
            master_item_description: "",
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
        res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

module.exports= addDataDictionary