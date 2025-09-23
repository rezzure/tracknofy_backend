const Progress = require("../../../Schema/progressReport.schema/progressReport.model");



// Add comment to a photo
// router.patch('/:reportId/photos/:photoIndex/comments'
const addComment = async (req, res) => {
  try {
    const { reportId, photoIndex } = req.params;
    const { text, position, author } = req.body;
    console.log("text", "position", "author", text, position, author )
    console.log("reportId", "photoIndex" ,reportId, photoIndex  )

    const progressReport = await Progress.findById(reportId);
    if (!progressReport) {
      return res.status(404).json({ 
        success: false, 
        message: 'Progress report not found' 
      });
    }

    // Check if photo index is valid
    if (photoIndex < 0 || photoIndex >= progressReport.photos.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid photo index' 
      });
    }

    const newComment = {
      id: Date.now().toString(),
      text,
      author: author || 'Admin',
      date: new Date(),
      position: position || { x: 50, y: 50 },
      resolved: false
    };

    // Add comment to the specific photo
    progressReport.photos[photoIndex].comments.push(newComment);
    
    // Update report status to indicate it needs review
    progressReport.status = 'needs_revision';
    
    await progressReport.save();

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: newComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};


module.exports=addComment;