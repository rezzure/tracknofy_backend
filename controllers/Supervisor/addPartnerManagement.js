const PartnerManagement = require("../../Schema/partnerManagement.schema/partnerManagement.model");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model")
const addPartnerManagement = async (req, res) => {
    try {
        const { partnerType, partnerName, partnerMobile, partnerAddress ,email} = req.body;
        const supervisor = await Supervisor.findOne({email:email})

        // Validate required fields
        if (!partnerType || !partnerName || !partnerMobile || !partnerAddress) {
            return res.status(400).send({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Handle file uploads - save only the file paths
        const partnerPhotoFile = req.files?.['partnerPhoto']?.[0];
        const partnerIdProofFile = req.files?.['partnerIdProof']?.[0];

        const newPartner = new PartnerManagement({
            partnerType,
            partnerName,
            partnerMobile,
            partnerAddress,
            createdBy:supervisor._id,
            ...(partnerPhotoFile && { partnerPhoto: partnerPhotoFile.path }),
            ...(partnerIdProofFile && { partnerIdProof: partnerIdProofFile.path })
        });

        await newPartner.save();
        
        res.status(201).send({
            success: true,
            message: 'Partner added successfully',
            data: newPartner
        });
    } catch (error) { 
        console.error('Error adding partner:', error);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

module.exports = addPartnerManagement;
