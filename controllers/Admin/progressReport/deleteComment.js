const Progress = require("../../../Schema/progressReport.schema/progressReport.model");


//router.delete('/:reportId/photos/:photoIndex/comments/:commentId'
const deleteComment = async (req, res) => {
  try {
    const { reportId, photoIndex, commentId } = req.params;

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

    // Remove comment
    progressReport.photos[photoIndex].comments = progressReport.photos[photoIndex].comments.filter(
      comment => comment.id !== commentId
    );

    await progressReport.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

module.exports=deleteComment;