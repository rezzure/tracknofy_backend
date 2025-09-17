
const mongoose = require('mongoose');
const Form = require('../../Schema/dynamicForm.schema/dynamicForm.model');
const FormSubmission = require('../../Schema/formSubmission.schema/formSubmission.model');
const FileUpload = require('../../middleware/dynamicForm.multer/multer');

// Submit form data
exports.submitForm = async (req, res) => {
  try {
    const formId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid form ID'
      });
    }

    const { submissionData, submittedBy = 'anonymous' } = req.body;
    
    // Find the form
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }
    
    let parsedSubmissionData;
    try {
      parsedSubmissionData = typeof submissionData === 'string' 
        ? JSON.parse(submissionData) 
        : submissionData;
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission data format'
      });
    }
    
    // Create form submission
    const submission = new FormSubmission({
      formId,
      formName: form.formName,
      submissionData: parsedSubmissionData,
      submittedBy,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    const savedSubmission = await submission.save();
    
    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      const fileUploads = req.files.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        formId,
        submissionId: savedSubmission._id
      }));
      
      await FileUpload.insertMany(fileUploads);
    }
    
    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: {
        submissionId: savedSubmission._id,
        submittedAt: savedSubmission.createdAt
      }
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting form',
      error: error.message
    });
  }
};

// Get form submissions
exports.getFormSubmissions = async (req, res) => {
  try {
    const formId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid form ID'
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const submissions = await FormSubmission.find({ formId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('formId', 'formName');
    
    const total = await FormSubmission.countDocuments({ formId });
    
    res.json({
      success: true,
      data: submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
};

// Get all submissions (admin view)
exports.getAllSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, formId } = req.query;

    if (formId && !mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid form ID'
      });
    }

    const skip = (page - 1) * limit;
    
    const query = formId ? { formId } : {};
    
    const submissions = await FormSubmission.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('formId', 'formName');
    
    const total = await FormSubmission.countDocuments(query);
    
    res.json({
      success: true,
      data: submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
};
