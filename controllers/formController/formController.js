// // const Form = require('../models/Form');
// const Form = require('../../Schema/dynamicForm.schema/dynamicForm.model');
// // const FormSubmission = require('../models/FormSubmission');

// // Get all forms with pagination and search
// exports.getAllForms = async (req, res) => {
//   const email = req.query.email
//   try {
//    if(email){
//     const forms = await Form.find({ 
//       userEmail: email,
//       isActive: true 
//     }).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: 'Forms retrieved successfully',
//       data: forms
//     });
//    }
//    else{
//      const { page = 1, limit = 9, search = '' } = req.query;
//     const skip = (page - 1) * limit;
    
//     const query = search
//       ? {
//           formName: { $regex: search, $options: 'i' },
//           isActive: true
//         }
//       : { isActive: true };

//     const forms = await Form.find(query)
//       .select('formName formFields createdAt updatedAt')
//       .sort({ updatedAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Form.countDocuments(query);

//     const formsWithFieldCount = forms.map(form => ({
//       ...form.toObject(),
//       fieldCount: form.formFields.length,
//       id: form._id,
//       _id: form._id // Keep both for compatibility
//     }));

//     res.json({
//       success: true,
//       data: formsWithFieldCount,
//       pagination: {
//         currentPage: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         totalPages: Math.ceil(total / limit),
//         hasNextPage: page < Math.ceil(total / limit),
//         hasPrevPage: page > 1
//       }
//     });
//    }
//   } catch (error) {
//     console.error('Error fetching forms:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching forms',
//       error: error.message
//     });
//   }
// };

// // Get single form by ID
// exports.getFormById = async (req, res) => {
//   const{_id} = req.params
//   try {
//     const form = await Form.findById(_id);
    
//     if (!form) {
//       return res.status(404).json({
//         success: false,
//         message: 'Form not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: {
//         ...form.toObject(),
//         id: form._id,
//         fieldCount: form.formFields.length
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching form:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching form',
//       error: error.message
//     });
//   }
// };

// // Create new form
// exports.createForm = async (req, res) => {
//   try {
//     const { formName, formFields, createdBy = 'anonymous' } = req.body;
    
//     if (!formName || !formFields || !Array.isArray(formFields)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Form name and fields are required'
//       });
//     }
    
//     if (formFields.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'At least one form field is required'
//       });
//     }
    
//     const form = new Form({
//       formName,
//       formFields,
//       createdBy
//     });
    
//     const savedForm = await form.save();
    
//     res.status(201).json({
//       success: true,
//       message: 'Form created successfully',
//       data: {
//         ...savedForm.toObject(),
//         id: savedForm._id,
//         fieldCount: savedForm.formFields.length
//       }
//     });
//   } catch (error) {
//     console.error('Error creating form:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating form',
//       error: error.message
//     });
//   }
// };

// // Update form
// // exports.updateForm = async (req, res) => {
// //   try {
// //     const { formName, formFields ,userEmail} = req.body;
// //     console.log(formName, formFields,userEmail)
// //     const {_id} = req.params
// //     if (!formName || !formFields || !Array.isArray(formFields)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Form name and fields are required'
// //       });
// //     }
    
// //     const form = await Form.findByIdAndUpdate(
// //       _id,
// //       {
// //         formName,
// //         formFields,
// //         userEmail,
// //         updatedAt: new Date()
// //       },
// //       { new: true, runValidators: true }
// //     );
    
// //     if (!form) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Form not found'
// //       });
// //     }
    
// //     res.json({
// //       success: true,
// //       message: 'Form updated successfully',
// //       data: {
// //         ...form.toObject(),
// //         id: form._id,
// //         fieldCount: form.formFields.length
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Error updating form:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error updating form',
// //       error: error.message
// //     });
// //   }
// // };

// exports.updateForm = async (req, res) => {
//   try {
//     const { formName, formFields, userEmail } = req.body;
//     console.log('Update request:', { formName, formFields, userEmail });
//     const { _id } = req.params;

//     if (!formName || !formFields || !Array.isArray(formFields)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Form name and fields are required'
//       });
//     }

//     // Find the existing form first
//     const existingForm = await Form.findById(_id);
//     if (!existingForm) {
//       return res.status(404).json({
//         success: false,
//         message: 'Form not found'
//       });
//     }

//     // Prepare update data
//     const updateData = {
//       formName,
//       formFields,
//       updatedAt: new Date()
//     };

//     // Handle userEmail - add to array if provided and not already present
//     if (userEmail) {
//       const emailToAdd = userEmail.trim().toLowerCase();
      
//       // Validate email format
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(emailToAdd)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Please provide a valid email address'
//         });
//       }

//       // Check if email already exists in the array
//       if (!existingForm.userEmail.includes(emailToAdd)) {
//         updateData.$addToSet = { userEmail: emailToAdd };
//       }
//     }

//     // Update the form
//     const form = await Form.findByIdAndUpdate(
//       _id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     res.json({
//       success: true,
//       message: userEmail ? 'Form updated and user assigned successfully' : 'Form updated successfully',
//       data: {
//         ...form.toObject(),
//         id: form._id,
//         fieldCount: form.formFields.length,
//         assignedUsersCount: form.userEmail.length
//       }
//     });
//   } catch (error) {
//     console.error('Error updating form:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating form',
//       error: error.message
//     });
//   }
// };

// // Delete form (soft delete)
// exports.deleteForm = async (req, res) => {
//   const {_id} = req.params
//   console.log(_id)
//   try {
//     const form = await Form.findByIdAndUpdate(
//       _id,
//       { isActive: false },
//       { new: true }
//     );
    
//     if (!form) {
//       return res.status(404).json({
//         success: false,
//         message: 'Form not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Form deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting form:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting form',
//       error: error.message
//     });
//   }
// };




// updates for my form

// const Form = require('../models/Form');
const Form = require('../../Schema/dynamicForm.schema/dynamicForm.model');
// const FormSubmission = require('../models/FormSubmission');

// Get all forms with pagination and search
exports.getAllForms = async (req, res) => {
  const email = req.query.email
  try {
   if(email){
    const forms = await Form.find({ 
      userEmail: email,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Forms retrieved successfully',
      data: forms
    });
   }
   else{
     const { page = 1, limit = 9, search = '' } = req.query;
    const skip = (page - 1) * limit;
    
    const query = search
      ? {
          formName: { $regex: search, $options: 'i' },
          isActive: true
        }
      : { isActive: true };

    const forms = await Form.find(query)
      .select('formName formFields createdAt updatedAt userForms')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Form.countDocuments(query);

    const formsWithFieldCount = forms.map(form => ({
      ...form.toObject(),
      fieldCount: form.formFields.length,
      id: form._id,
      _id: form._id // Keep both for compatibility
    }));

    res.json({
      success: true,
      data: formsWithFieldCount,
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
   }
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message
    });
  }
};

// Get single form by ID
exports.getFormById = async (req, res) => {
  const{_id} = req.params
  try {
    const form = await Form.findById(_id);
    
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        ...form.toObject(),
        id: form._id,
        fieldCount: form.formFields.length
      }
    });
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching form',
      error: error.message
    });
  }
};

// Create new form
exports.createForm = async (req, res) => {
  try {
    const { formName, formFields, createdBy = 'anonymous' } = req.body;
    
    if (!formName || !formFields || !Array.isArray(formFields)) {
      return res.status(400).json({
        success: false,
        message: 'Form name and fields are required'
      });
    }
    
    if (formFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one form field is required'
      });
    }
    
    const form = new Form({
      formName,
      formFields,
      createdBy
    });
    
    const savedForm = await form.save();
    
    res.status(201).json({
      success: true,
      message: 'Form created successfully',
      data: {
        ...savedForm.toObject(),
        id: savedForm._id,
        fieldCount: savedForm.formFields.length
      }
    });
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating form',
      error: error.message
    });
  }
};

// Update form
exports.updateForm = async (req, res) => {
  try {
    const { formName, formFields, userEmail } = req.body;
    console.log('Update request:', { formName, formFields, userEmail });
    const { _id } = req.params;

    if (!formName || !formFields || !Array.isArray(formFields)) {
      return res.status(400).json({
        success: false,
        message: 'Form name and fields are required'
      });
    }

    // Find the existing form first
    const existingForm = await Form.findById(_id);
    if (!existingForm) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    // Prepare update data
    const updateData = {
      formName,
      formFields,
      updatedAt: new Date()
    };

    // Handle userEmail - add to array if provided and not already present
    if (userEmail) {
      const emailToAdd = userEmail.trim().toLowerCase();
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailToAdd)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Check if email already exists in the array
      if (!existingForm.userEmail.includes(emailToAdd)) {
        updateData.$addToSet = { userEmail: emailToAdd };
      }
    }

    // Update the form
    const form = await Form.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: userEmail ? 'Form updated and user assigned successfully' : 'Form updated successfully',
      data: {
        ...form.toObject(),
        id: form._id,
        fieldCount: form.formFields.length,
        assignedUsersCount: form.userEmail.length
      }
    });
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating form',
      error: error.message
    });
  }
};

// NEW: Assign forms to My Forms module
exports.assignToMyForms = async (req, res) => {
  try {
    const { formIds, userEmail, moduleName = 'My Forms' } = req.body;
    
    if (!formIds || !Array.isArray(formIds) || formIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Form IDs are required'
      });
    }
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const results = [];
    const errors = [];

    // Process each form
    for (const formId of formIds) {
      try {
        const form = await Form.findById(formId);
        
        if (!form) {
          errors.push(`Form ${formId} not found`);
          continue;
        }

        // Check if this user already has this form in My Forms
        const existingAssignment = form.userForms.find(
          assignment => assignment.userEmail === userEmail.toLowerCase() && 
                        assignment.moduleName === moduleName
        );

        if (existingAssignment) {
          // Update existing assignment
          const updatedForm = await Form.findOneAndUpdate(
            { 
              _id: formId,
              'userForms.userEmail': userEmail.toLowerCase(),
              'userForms.moduleName': moduleName
            },
            {
              $set: {
                'userForms.$.status': 'active',
                'userForms.$.assignedAt': new Date()
              }
            },
            { new: true }
          );
          results.push({
            formId,
            formName: form.formName,
            status: 'updated',
            message: 'Form assignment updated in My Forms'
          });
        } else {
          // Add new assignment
          const updatedForm = await Form.findByIdAndUpdate(
            formId,
            {
              $push: {
                userForms: {
                  userEmail: userEmail.toLowerCase(),
                  moduleName: moduleName,
                  assignedAt: new Date(),
                  status: 'active'
                }
              }
            },
            { new: true, runValidators: true }
          );
          results.push({
            formId,
            formName: form.formName,
            status: 'assigned',
            message: 'Form assigned to My Forms successfully'
          });
        }
      } catch (error) {
        errors.push(`Error processing form ${formId}: ${error.message}`);
      }
    }

    res.json({
      success: errors.length === 0,
      message: errors.length === 0 ? 'All forms assigned to My Forms successfully' : 'Some forms failed to assign',
      data: {
        results,
        errors: errors.length > 0 ? errors : undefined
      }
    });
  } catch (error) {
    console.error('Error assigning forms to My Forms:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning forms to My Forms',
      error: error.message
    });
  }
};

// NEW: Get forms by user and module
exports.getFormsByUserAndModule = async (req, res) => {
  try {
    const { userEmail, moduleName } = req.query;
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    const query = {
      'userForms.userEmail': userEmail.toLowerCase(),
      isActive: true
    };

    // Add module filter if provided
    if (moduleName) {
      query['userForms.moduleName'] = moduleName;
    }

    const forms = await Form.find(query)
      .select('formName formFields userForms createdAt updatedAt')
      .sort({ updatedAt: -1 });

    // Filter userForms to only include the requested user's assignments
    const filteredForms = forms.map(form => {
      const userFormData = form.userForms.filter(
        uf => uf.userEmail === userEmail.toLowerCase() && 
              (!moduleName || uf.moduleName === moduleName)
      );
      
      return {
        ...form.toObject(),
        userFormAssignments: userFormData,
        fieldCount: form.formFields.length,
        id: form._id
      };
    });

    res.json({
      success: true,
      data: filteredForms,
      count: filteredForms.length
    });
  } catch (error) {
    console.error('Error fetching user forms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user forms',
      error: error.message
    });
  }
};

// Delete form (soft delete)
exports.deleteForm = async (req, res) => {
  const {_id} = req.params
  console.log(_id)
  try {
    const form = await Form.findByIdAndUpdate(
      _id,
      { isActive: false },
      { new: true }
    );
    
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Form deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting form',
      error: error.message
    });
  }
};