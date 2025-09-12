const Progress = require("../../Schema/progressReport.schema/progressReport.model");
const Site = require("../../Schema/site.Schema/site.model");
const User = require("../../Schema/users.schema/users.model");

const progressReport = async (req, res) => {
    const { id } = req.params;
    const { projectId, description, date } = req.body;
    const photos = req.files;

    console.log("Progress report request:", { id, projectId, description, date, files: req.files });

    try {
        // Validate required fields
        if (!projectId || !description || !date) {
            return res.status(400).send({
                success: false,
                message: "Missing required fields: projectId, description, or date"
            });
        }

        // Validate files
        if (!photos || photos.length === 0) {
            return res.status(400).send({
                success: false,
                message: "At least one photo is required"
            });
        }

        const siteData = await Site.findById({ _id: projectId });
        const supervisorData = await User.findById({ _id: id });

        if (!siteData) {
            return res.status(404).send({
                success: false,
                message: "Site not found"
            });
        }

        if (!supervisorData) {
            return res.status(404).send({
                success: false,
                message: "Supervisor not found"
            });
        }

        const reportData = new Progress({
            siteName: siteData.siteName,
            site: projectId,
            supervisor: supervisorData.name,
            supervisorId: id,
            reportDate: date,
            description: description,
            photos: photos.map(file => ({
                fieldname: file.fieldname,
                originalname: file.originalname,
                mimetype: file.mimetype,
                destination: file.destination,
                filename: file.filename,
                path: file.path,
                size: file.size
            })),
        });

        const updatedData = await reportData.save();
        
        // Populate the saved data for better response
        const populatedData = await Progress.findById(updatedData._id)
            .populate('site', 'siteName location')
            .populate('supervisorId', 'name email');

        return res.status(200).send({
            success: true,
            message: "Progress report submitted successfully",
            data: populatedData
        });

    } catch (err) {
        console.error("Error in progressReport:", err);
        return res.status(500).send({
            success: false,
            message: `Internal Server Error: ${err.message}`
        });
    }
};

module.exports = progressReport;