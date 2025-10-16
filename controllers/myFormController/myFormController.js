// const MyForm = require('../../Schema/myForm.schema/myForm.model');
// const { validationResult } = require('express-validator');

// // Create new form submission
// exports.createFormSubmission = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation errors',
//         errors: errors.array()
//       });
//     }

//     const { formId, formName, formFields, formResponses, submittedBy, module } = req.body;

//     const newSubmission = new MyForm({
//       formId,
//       formName,
//       formFields,
//       formResponses,
//       submittedBy,
//       module,
//       submittedAt: new Date()
//     });

//     await newSubmission.save();

//     res.status(201).json({
//       success: true,
//       message: 'Form submitted successfully',
//       data: newSubmission
//     });
//   } catch (error) {
//     console.error('Error creating form submission:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Get all form submissions for user
// exports.getFormSubmissions = async (req, res) => {
//   try {
//     const email = req.user?.email;

//     const submissions = await MyForm.find({ submittedBy: email })
//       .sort({ submittedAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: 'Form submissions fetched successfully',
//       data: submissions
//     });
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Get single form submission by ID
// exports.getFormSubmissionById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const email = req.user?.email;

//     const submission = await MyForm.findOne({
//       _id: id,
//       submittedBy: email
//     });

//     if (!submission) {
//       return res.status(404).json({
//         success: false,
//         message: 'Form submission not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Form submission fetched successfully',
//       data: submission
//     });
//   } catch (error) {
//     console.error('Error fetching form submission:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Update form submission
// exports.updateFormSubmission = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation errors',
//         errors: errors.array()
//       });
//     }

//     const { id } = req.params;
//     const { formResponses } = req.body;
//     const email = req.user?.email;

//     // Check if submission exists and belongs to user
//     const existingSubmission = await MyForm.findOne({
//       _id: id,
//       submittedBy: email
//     });

//     if (!existingSubmission) {
//       return res.status(404).json({
//         success: false,
//         message: 'Form submission not found'
//       });
//     }

//     // Update submission
//     const updatedSubmission = await MyForm.findByIdAndUpdate(
//       id,
//       {
//         formResponses: formResponses,
//         updatedAt: new Date(),
//         updatedBy: email
//       },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Form submission updated successfully',
//       data: updatedSubmission
//     });
//   } catch (error) {
//     console.error('Error updating form submission:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Delete form submission
// exports.deleteFormSubmission = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const email = req.user?.email;

//     const submission = await MyForm.findOneAndDelete({
//       _id: id,
//       submittedBy: email
//     });

//     if (!submission) {
//       return res.status(404).json({
//         success: false,
//         message: 'Form submission not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Form submission deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting form submission:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };





// const MyForm = require('../../Schema/myForm.schema/myForm.model');
// const { validationResult } = require('express-validator');

// // Create new form submission
// exports.createFormSubmission = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation errors',
//         errors: errors.array()
//       });
//     }

//     const { formId, formName, formFields, formResponses, submittedBy, module } = req.body;

//     const newSubmission = new MyForm({
//       formId,
//       formName,
//       formFields,
//       formResponses, // This now contains responses with labels as keys
//       submittedBy,
//       module,
//       submittedAt: new Date()
//     });

//     await newSubmission.save();

//     res.status(201).json({
//       success: true,
//       message: 'Form submitted successfully',
//       data: newSubmission
//     });
//   } catch (error) {
//     console.error('Error creating form submission:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Get all form submissions for user
// exports.getFormSubmissions = async (req, res) => {
//   try {
//     const email = req.user?.email;
//     console.log('Fetching submissions for user:', email);

//     const submissions = await MyForm.find({ submittedBy: email })
//       .sort({ submittedAt: -1 });

//     console.log('Found submissions:', submissions.length);

//     res.status(200).json({
//       success: true,
//       message: 'Form submissions fetched successfully',
//       data: submissions
//     });
//   } catch (error) {
//     console.error('Error fetching form submissions:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Get single form submission by ID
// exports.getFormSubmissionById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const email = req.user?.email;

//     const submission = await MyForm.findOne({
//       _id: id,
//       submittedBy: email
//     });

//     if (!submission) {
//       return res.status(404).json({
//         success: false,
//         message: 'Form submission not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Form submission fetched successfully',
//       data: submission
//     });
//   } catch (error) {
//     console.error('Error fetching form submission:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Update form submission
// exports.updateFormSubmission = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation errors',
//         errors: errors.array()
//       });
//     }

//     const { id } = req.params;
//     const { formResponses } = req.body;
//     const email = req.user?.email;

//     // Check if submission exists and belongs to user
//     const existingSubmission = await MyForm.findOne({
//       _id: id,
//       submittedBy: email
//     });

//     if (!existingSubmission) {
//       return res.status(404).json({
//         success: false,
//         message: 'Form submission not found'
//       });
//     }

//     // Update submission
//     const updatedSubmission = await MyForm.findByIdAndUpdate(
//       id,
//       {
//         formResponses: formResponses, // This now contains responses with labels as keys
//         updatedAt: new Date(),
//         updatedBy: email
//       },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Form submission updated successfully',
//       data: updatedSubmission
//     });
//   } catch (error) {
//     console.error('Error updating form submission:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Delete form submission
// exports.deleteFormSubmission = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const email = req.user?.email;

//     const submission = await MyForm.findOneAndDelete({
//       _id: id,
//       submittedBy: email
//     });

//     if (!submission) {
//       return res.status(404).json({
//         success: false,
//         message: 'Form submission not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Form submission deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting form submission:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };




// last controller

// const MyForm = require('../../Schema/myForm.schema/myForm.model');
const Admin = require('../../Schema/admin.schema/admine.model');
const { validationResult } = require('express-validator');

// Create new form submission
exports.createFormSubmission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const email = req.query.email;
    const {
      formId, 
      formName, 
      formFields, 
      formResponses, 
      submittedBy, 
      module, 
      submittedAt 
    } = req.body;

    console.log('Creating submission for email:', email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    // Verify admin exists
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin data not found"
      });
    }

    const newSubmission = new MyForm({
      formId,
      formName,
      formFields,
      formResponses,
      submittedBy,
      module,
      submittedAt: submittedAt || new Date(),
      createdBy: admin._id,
      createdByModel: "Admin"
    });

    await newSubmission.save();

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: newSubmission
    });
  } catch (error) {
    console.error('Error creating form submission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all form submissions for user
exports.getFormSubmissions = async (req, res) => {
  try {
    const email = req.query.email;
    console.log('Fetching submissions', email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    // Verify admin exists
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin data not found"
      });
    }

    const submissions = await MyForm.find({ submittedBy: email })
      .sort({ submittedAt: -1 });

    console.log('Found submissions:', submissions);

    res.status(200).json({
      success: true,
      message: 'Form submissions fetched successfully',
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get single form submission by ID
exports.getFormSubmissionById = async (req, res) => {
  try {
    const { _id } = req.params;
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    // Verify admin exists
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin data not found"
      });
    }

    const submission = await MyForm.findOne({
      _id: _id,
      submittedBy: email
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Form submission not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Form submission fetched successfully',
      data: submission
    });
  } catch (error) {
    console.error('Error fetching form submission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update form submission
exports.updateFormSubmission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { _id } = req.params;
    const email = req.query.email;
    const { formResponses, updatedAt, updatedBy } = req.body;

    console.log('Updating submission for email:', email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    // Verify admin exists
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin data not found"
      });
    }

    // Check if submission exists and belongs to user
    const existingSubmission = await MyForm.findOne({
      _id: _id,
      submittedBy: email
    });

    if (!existingSubmission) {
      return res.status(404).json({
        success: false,
        message: 'Form submission not found'
      });
    }

    // Update submission
    const updatedSubmission = await MyForm.findByIdAndUpdate(
      _id,
      {
        formResponses: formResponses,
        updatedAt: updatedAt || new Date(),
        updatedBy: updatedBy || email,
        updatedByModel: "Admin"
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Form submission updated successfully',
      data: updatedSubmission
    });
  } catch (error) {
    console.error('Error updating form submission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete form submission
exports.deleteFormSubmission = async (req, res) => {
  try {
    const { _id } = req.params;
    const email = req.query.email;

    console.log('Deleting submission for email:', email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    // Verify admin exists
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin data not found"
      });
    }

    const submission = await MyForm.findOneAndDelete({
      _id: _id,
      submittedBy: email
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Form submission not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Form submission deleted successfully',
      data: submission
    });
  } catch (error) {
    console.error('Error deleting form submission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};