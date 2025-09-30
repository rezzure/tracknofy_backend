

// Resolve a comment - Supervisor's action

const Progress = require("../../Schema/progressReport.schema/progressReport.model");

// router.put('/comments/resolve/:commentId'
const resolveComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { resolvedMessage } = req.body;
    console.log("commentId", commentId)
    console.log("resolvedMessage", resolvedMessage)
    
    // Get supervisor info from token or request
    const supervisorName = req.user?.name || "Supervisor"; // Adjust based on your auth middleware

    if (!resolvedMessage || !resolvedMessage.trim()) {
      
      return res.status(400).json({
        success: false,
        message: 'Resolution message is required'
      });
    }

    // Find the progress report that contains this comment
    const progressReport = await Progress.findOne({
      "photos.comments.id": commentId
    });

    if (!progressReport) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Find the specific comment and photo
    let targetComment = null;
    let photoIndex = -1;
    let commentIndex = -1;

    // Search through all photos and comments
    for (let pIndex = 0; pIndex < progressReport.photos.length; pIndex++) {
      const photo = progressReport.photos[pIndex];
      for (let cIndex = 0; cIndex < photo.comments.length; cIndex++) {
        if (photo.comments[cIndex].id === commentId) {
          targetComment = photo.comments[cIndex];
          photoIndex = pIndex;
          commentIndex = cIndex;
          break;
        }
      }
      if (targetComment) break;
    }

    if (!targetComment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found in any photo'
      });
    }

    // Update the comment with resolution details
    progressReport.photos[photoIndex].comments[commentIndex].resolved = true;
    progressReport.photos[photoIndex].comments[commentIndex].resolvedAt = new Date();
    progressReport.photos[photoIndex].comments[commentIndex].resolvedBy = supervisorName;
    progressReport.photos[photoIndex].comments[commentIndex].resolvedMessage = resolvedMessage.trim();

    // Add to replies thread for communication history
    progressReport.photos[photoIndex].comments[commentIndex].replies.push({
      text: resolvedMessage.trim(),
      author: supervisorName,
      date: new Date(),
      type: "resolution"
    });

    // Add to status history
    progressReport.photos[photoIndex].comments[commentIndex].statusHistory.push({
      status: "resolved",
      changedBy: supervisorName,
      date: new Date(),
      note: "Issue resolved by supervisor"
    });

    // Update the overall report status and unresolved count
    progressReport.updateUnresolvedCount();

    // Save the updated document
    await progressReport.save();

    // Prepare response data
    const updatedComment = progressReport.photos[photoIndex].comments[commentIndex];

    res.status(200).json({
      success: true,
      message: 'Comment marked as resolved successfully',
      data: {
        comment: updatedComment,
        reportStatus: progressReport.status,
        unresolvedCount: progressReport.unresolvedCommentsCount
      }
    });

  } catch (error) {
    console.error('Error resolving comment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Additional controller for admin to respond to resolution
const adminRespondToResolution = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { responseMessage, action } = req.body; // action: 'accept' or 'reopen'
    const adminName = req.user?.name || "Admin";

    const progressReport = await Progress.findOne({
      "photos.comments.id": commentId
    });

    if (!progressReport) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Find the comment
    let targetComment = null;
    let photoIndex = -1;
    let commentIndex = -1;

    for (let pIndex = 0; pIndex < progressReport.photos.length; pIndex++) {
      const photo = progressReport.photos[pIndex];
      for (let cIndex = 0; cIndex < photo.comments.length; cIndex++) {
        if (photo.comments[cIndex].id === commentId) {
          targetComment = photo.comments[cIndex];
          photoIndex = pIndex;
          commentIndex = cIndex;
          break;
        }
      }
      if (targetComment) break;
    }

    if (!targetComment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Add admin response to replies
    progressReport.photos[photoIndex].comments[commentIndex].replies.push({
      text: responseMessage.trim(),
      author: adminName,
      date: new Date(),
      type: action === 'reopen' ? 'followup' : 'clarification'
    });

    // If admin reopens the issue
    if (action === 'reopen') {
      progressReport.photos[photoIndex].comments[commentIndex].resolved = false;
      progressReport.photos[photoIndex].comments[commentIndex].resolvedMessage += ` | Reopened by admin: ${responseMessage}`;
      
      progressReport.photos[photoIndex].comments[commentIndex].statusHistory.push({
        status: "reopened",
        changedBy: adminName,
        date: new Date(),
        note: "Issue reopened by admin"
      });
    }

    // Update overall status
    progressReport.updateUnresolvedCount();
    await progressReport.save();

    res.status(200).json({
      success: true,
      message: `Admin response ${action === 'reopen' ? 'and issue reopened' : 'added'} successfully`,
      data: progressReport.photos[photoIndex].comments[commentIndex]
    });

  } catch (error) {
    console.error('Error in admin response:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  resolveComment,
  adminRespondToResolution
};