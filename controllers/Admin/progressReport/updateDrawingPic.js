const Progress = require("../../../Schema/progressReport.schema/progressReport.model");

// Update drawing for a photo
const updateDrawingPic = async (req, res) => {
  try {
    const { reportId, photoIndex } = req.params;
    const { drawingData } = req.body;
    //drawingData data:image/png;base64
    console.log("reportId", "photoIndex", reportId, photoIndex  )
    console.log("drawingData", drawingData)

    const progressReport = await Progress.findById(reportId);
    if (!progressReport) {
      return res.status(404).json({ 
        success: false, 
        message: 'Progress report not found' 
      });
    }

    if (photoIndex < 0 || photoIndex >= progressReport.photos.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid photo index' 
      });
    }

    // Update drawing data
    progressReport.photos[photoIndex].drawingData = drawingData;
    await progressReport.save();

    res.status(200).json({
      success: true,
      message: 'Drawing saved successfully'
    });
  } catch (error) {
    console.error('Error saving drawing:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

module.exports=updateDrawingPic;