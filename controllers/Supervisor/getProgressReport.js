const Progress = require("../../Schema/progressReport.schema/progressReport.model");

const getProgressReport = async (req, res) => {
    const { _id } = req.params;
    console.log("Fetching progress reports for supervisor:", _id);

    try {
        const progressReports = await Progress.find({ supervisorId: _id })
            .populate('site', 'siteName location') // Populate site details
            .populate('supervisorId', 'name email') // Populate supervisor details
            .sort({ createdAt: -1 }); // Sort by latest first

        if (!progressReports || progressReports.length === 0) {
            return res.status(404).send({
                success: false, // Changed to false when no data found
                message: "No progress reports found for this supervisor"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Progress data fetched successfully",
            data: progressReports,
            count: progressReports.length
        });

    } catch (error) {
        console.error("Error in getProgressReport:", error);
        return res.status(500).send({
            success: false,
            message: `Internal Server Error: ${error.message}`
        });
    }
};

module.exports = getProgressReport;

