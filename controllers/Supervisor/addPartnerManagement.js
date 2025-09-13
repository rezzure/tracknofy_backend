const PartnerManagement = require("../../Schema/partnerManagement.schema/partnerManagement.model");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model")


const addPartnerManagement = async (req, res) => {
    const email = req.query.email;
    console.log(email);
    
    try {
        const { partnerType, partnerName, partnerMobile, partnerAddress } = req.body;

        // Validate required fields
        if (!partnerType || !partnerName || !partnerMobile || !partnerAddress) {
            return res.status(400).send({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        const supervisor = await Supervisor.findOne({ email: email });
        if (!supervisor) {
            return res.status(404).send({
                success: false,
                message: 'Supervisor not found'
            });
        }

        // Handle file uploads - save only the file names (not full paths)
        const partnerPhotoFile = req.files?.['partnerPhoto']?.[0];
        const partnerIdProofFile = req.files?.['partnerIdProof']?.[0];

        const newPartner = new PartnerManagement({
            partnerType,
            partnerName,
            partnerMobile: Number(partnerMobile), // Ensure it's a number
            partnerAddress,
            createdBy: supervisor._id,
            createdByModel: 'Supervisor', // You need to set this field
            ...(partnerPhotoFile && { partnerPhoto: partnerPhotoFile.filename }), // Use filename, not path
            ...(partnerIdProofFile && { partnerIdProof: partnerIdProofFile.filename }) // Use filename, not path
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

