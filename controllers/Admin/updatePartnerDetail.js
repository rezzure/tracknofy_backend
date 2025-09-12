const PartnerManagement = require("../../Schema/partnerManagement.schema/partnerManagement.model");
const Admin = require("../../Schema/admin.schema/admine.model");

const updatePartnerDetail = async (req, res) => {
    const { _id } = req.params;
    console.log(_id);
    
    const { partnerType, partnerName, partnerMobile, partnerAddress, email } = req.body;
    console.log(partnerType, partnerName, partnerMobile, partnerAddress, email);
    
    const partnerPhotoFile = req.files?.['partnerPhoto']?.[0];
    const partnerIdProofFile = req.files?.['partnerIdProof']?.[0];

    try {
        const partner = await PartnerManagement.findById(_id);
        console.log(partner);
        
        if (!partner) {
            return res.status(404).send({
                success: false, // Changed to false
                message: "Partner data not found"
            });
        }

        const admin = await Admin.findOne({ email: email });
        console.log(admin);
        
        if (!admin) {
            return res.status(404).send({
                success: false,
                message: "Admin not found"
            });
        }

        // Update fields only if they are provided
        if (partnerType) partner.partnerType = partnerType;
        if (partnerName) partner.partnerName = partnerName;
        if (partnerMobile) partner.partnerMobile = Number(partnerMobile); // Convert to number
        if (partnerAddress) partner.partnerAddress = partnerAddress;
        if (partnerPhotoFile) partner.partnerPhoto = partnerPhotoFile.filename; // Use filename
        if (partnerIdProofFile) partner.partnerIdProof = partnerIdProofFile.filename; // Use filename
        
        // Update createdBy if needed (only if it's different)
        if (partner.createdBy.toString() !== admin._id.toString()) {
            partner.createdBy = admin._id;
            partner.createdByModel = 'Admin'; // Also update the model reference
        }
        
        partner.updatedAt = Date.now(); // Use updatedAt instead of createdAt for updates
        await partner.save();
        
        return res.status(200).send({
            success: true,
            message: "Partner data updated successfully",
            data: partner
        });
    } catch (error) {
        console.error(`Error:- ${error}`);
        return res.status(500).send({
            success: false,
            message: `Internal Server Error:- ${error.message}`
        });
    }
};

module.exports = updatePartnerDetail;