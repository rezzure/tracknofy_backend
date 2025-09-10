// const Form = require('../models/Form');
const Form = require('../../Schema/dynamicForm.schema/dynamicForm.model');
// const FormSubmission = require('../models/FormSubmission');

// Get all forms with pagination and search
exports.getAllForms = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;
    
    const query = search 
      ? { 
          formName: { $regex: search, $options: 'i' },
          isActive: true 
        }
      : { isActive: true };
    
    const forms = await Form.find(query)
      .select('formName formFields createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Form.countDocuments(query);
    
    const formsWithFieldCount = forms.map(form => ({
      ...form.toObject(),
      fieldCount: form.formFields.length,
      id: form._id
    }));
    
    res.json({
      success: true,
      data: formsWithFieldCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
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
  try {
    const form = await Form.findById(req.params.id);
    
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
    const { formName, formFields } = req.body;
    
    if (!formName || !formFields || !Array.isArray(formFields)) {
      return res.status(400).json({
        success: false,
        message: 'Form name and fields are required'
      });
    }
    
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      {
        formName,
        formFields,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Form updated successfully',
      data: {
        ...form.toObject(),
        id: form._id,
        fieldCount: form.formFields.length
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

// Delete form (soft delete)
exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
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