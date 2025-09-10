// const Form = require('../models/Form');
// const FormSubmission = require('../models/FormSubmission');
// const FileUpload = require('../models/FileUpload');

const Form = require("../../Schema/dynamicForm.schema/dynamicForm.model");
const FileUpload = require("../../Schema/dynamicFormFileUpload.schema/fileUpload");
const FormSubmission = require("../../Schema/formSubmission.schema/formSubmission.model");

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalForms = await Form.countDocuments({ isActive: true });
    const totalSubmissions = await FormSubmission.countDocuments();
    const totalFiles = await FileUpload.countDocuments();
    
    // Get recent submissions
    const recentSubmissions = await FormSubmission.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('formId', 'formName');
    
    // Get forms with submission counts
    const formsWithSubmissions = await FormSubmission.aggregate([
      {
        $group: {
          _id: '$formId',
          submissionCount: { $sum: 1 },
          lastSubmission: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'forms',
          localField: '_id',
          foreignField: '_id',
          as: 'formData'
        }
      },
      {
        $unwind: '$formData'
      },
      {
        $sort: { submissionCount: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    res.json({
      success: true,
      data: {
        totalForms,
        totalSubmissions,
        totalFiles,
        recentSubmissions,
        popularForms: formsWithSubmissions
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};