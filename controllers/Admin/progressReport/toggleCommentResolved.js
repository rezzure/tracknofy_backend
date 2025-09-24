const Progress = require("../../../Schema/progressReport.schema/progressReport.model");


// Toggle comment resolved status
const toggleCommentResolved = async (req, res) => {
  try {
    const { reportId, photoIndex, commentId } = req.params;
    const { resolved } = req.body;

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

    // Find and update the comment
    const comment = progressReport.photos[photoIndex].comments.find(
      comment => comment.id === commentId
    );

    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Comment not found' 
      });
    }

    comment.resolved = resolved !== undefined ? resolved : !comment.resolved;
    
    if (comment.resolved) {
      comment.resolvedAt = new Date();
    } else {
      comment.resolvedAt = undefined;
      comment.resolvedMessage = undefined;
    }

    await progressReport.save();

    res.status(200).json({
      success: true,
      message: `Comment ${comment.resolved ? 'resolved' : 'unresolved'} successfully`,
      data: comment
    });
  } catch (error) {
    console.error('Error updating comment status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};


module.exports=toggleCommentResolved;