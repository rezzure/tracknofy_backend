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







//  15/10 first code for my form
const Form = require('../../Schema/dynamicForm.schema/dynamicForm.model');

// Get all forms with pagination and search
exports.getAllForms = async (req, res) => {
  const email = req.query.email
  try {
   if(email){
    const forms = await Form.find({ 
      $or: [
        { userEmail: email },
        { 'myForm.userEmail': email }
      ],
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
      .select('formName formFields createdAt updatedAt userEmail myForm')
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

exports.updateForm = async (req, res) => {
  try {
    const { formName, formFields, userEmail, module } = req.body;
    console.log('Update request:', { formName, formFields, userEmail, module });
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

    // Prepare update data - start with basic fields
    const updateData = {
      formName,
      formFields,
      updatedAt: new Date()
    };

    // Handle user assignment based on module selection
    if (userEmail && module) {
      const emailToAdd = userEmail.trim().toLowerCase();
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailToAdd)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      if (module === 'Survey Form') {
        // Add to userEmail array for Survey Form
        if (!existingForm.userEmail.includes(emailToAdd)) {
          // Use $addToSet to avoid duplicates
          updateData.$addToSet = { userEmail: emailToAdd };
        }
      } else if (module === 'My Forms') {
        // Add to myForm array for My Forms
        const myFormEntry = {
          moduleName: 'My Form',
          userEmail: emailToAdd,
          assignedAt: new Date()
        };
        
        // Check if this user already exists in myForm
        const existingMyFormEntry = existingForm.myForm.find(
          entry => entry.userEmail === emailToAdd
        );
        
        if (!existingMyFormEntry) {
          // Use $push to add to myForm array
          if (!updateData.$push) updateData.$push = {};
          updateData.$push.myForm = myFormEntry;
        }
      }
    }

    console.log('Update data being sent to MongoDB:', JSON.stringify(updateData, null, 2));

    // Update the form
    let form;
    try {
      form = await Form.findByIdAndUpdate(
        _id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (dbError) {
      console.error('Database update error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Database update failed',
        error: dbError.message
      });
    }

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found after update'
      });
    }

    // Determine the success message based on the operation
    let message = 'Form updated successfully';
    if (userEmail && module) {
      if (module === 'Survey Form') {
        message = 'Form updated and user assigned to Survey Form successfully';
      } else if (module === 'My Forms') {
        message = 'Form updated and user assigned to My Forms successfully';
      }
    }

    console.log('Update successful. Final form data:', {
      userEmail: form.userEmail,
      myForm: form.myForm
    });

    res.json({
      success: true,
      message: message,
      data: {
        ...form.toObject(),
        id: form._id,
        fieldCount: form.formFields.length,
        assignedUsersCount: form.userEmail.length,
        myFormUsersCount: form.myForm.length
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

// Alternative update method using find + save for complex operations
exports.updateFormAlternative = async (req, res) => {
  try {
    const { formName, formFields, userEmail, module } = req.body;
    const { _id } = req.params;

    if (!formName || !formFields || !Array.isArray(formFields)) {
      return res.status(400).json({
        success: false,
        message: 'Form name and fields are required'
      });
    }

    // Find the form
    const form = await Form.findById(_id);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    // Update basic fields
    form.formName = formName;
    form.formFields = formFields;
    form.updatedAt = new Date();

    // Handle user assignment based on module selection
    if (userEmail && module) {
      const emailToAdd = userEmail.trim().toLowerCase();
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailToAdd)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      if (module === 'Survey Form') {
        // Add to userEmail array for Survey Form
        if (!form.userEmail.includes(emailToAdd)) {
          form.userEmail.push(emailToAdd);
        }
      } else if (module === 'My Forms') {
        // Add to myForm array for My Forms
        const existingMyFormEntry = form.myForm.find(
          entry => entry.userEmail === emailToAdd
        );
        
        if (!existingMyFormEntry) {
          form.myForm.push({
            moduleName: 'My Form',
            userEmail: emailToAdd,
            assignedAt: new Date()
          });
        }
      }
    }

    // Save the form
    const savedForm = await form.save();

    let message = 'Form updated successfully';
    if (userEmail && module) {
      if (module === 'Survey Form') {
        message = 'Form updated and user assigned to Survey Form successfully';
      } else if (module === 'My Forms') {
        message = 'Form updated and user assigned to My Forms successfully';
      }
    }

    res.json({
      success: true,
      message: message,
      data: {
        ...savedForm.toObject(),
        id: savedForm._id,
        fieldCount: savedForm.formFields.length,
        assignedUsersCount: savedForm.userEmail.length,
        myFormUsersCount: savedForm.myForm.length
      }
    });
  } catch (error) {
    console.error('Error updating form (alternative method):', error);
    res.status(500).json({
      success: false,
      message: 'Error updating form',
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