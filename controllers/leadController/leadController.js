const Lead = require("../../Schema/lead.schema/lead.model");

// Add Lead Controller
const addLead = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      spocName,
      spocMobile,
      address,
      leadSource,
      assign,
      projectType,
      leadType,
      description,
      nextContact,
      tentativeValue
    } = req.body;

    // Validation
    if (!name || !email || !mobile || !address || !leadSource || !assign || !projectType || !leadType) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled"
      });
    }

    // Check if lead already exists with same email or mobile
    const existingLead = await Lead.findOne({
      $or: [
        { email: email },
        { mobile: mobile }
      ]
    });

    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: "Lead with this email or mobile already exists"
      });
    }

    // Create new lead
    const newLead = new Lead({
      name,
      email,
      mobile,
      spocName: spocName || '',
      spocMobile: spocMobile || '',
      address,
      leadSource,
      assign,
      projectType,
      leadType,
      description: description || '',
      tentativeValue: tentativeValue || 0,
      nextContact: nextContact || null,
      leadStatus: 'new leads'
    });

    await newLead.save();

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: newLead
    });

  } catch (error) {
    console.error("Error in addLead:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update Lead Controller
const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      mobile,
      spocName,
      spocMobile,
      address,
      leadSource,
      assign,
      projectType,
      leadType,
      description,
      nextContact,
      tentativeValue
    } = req.body;

    // Check if lead exists
    const existingLead = await Lead.findById(id);
    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    // Check for duplicate email/mobile excluding current lead
    const duplicateLead = await Lead.findOne({
      $and: [
        { _id: { $ne: id } },
        {
          $or: [
            { email: email },
            { mobile: mobile }
          ]
        }
      ]
    });

    if (duplicateLead) {
      return res.status(400).json({
        success: false,
        message: "Another lead with this email or mobile already exists"
      });
    }

    // Update lead
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      {
        name,
        email,
        mobile,
        spocName: spocName || '',
        spocMobile: spocMobile || '',
        address,
        leadSource,
        assign,
        projectType,
        leadType,
        description: description || '',
        tentativeValue: tentativeValue || 0,
        nextContact: nextContact || null
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead
    });

  } catch (error) {
    console.error("Error in updateLead:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update Basic Details Controller
const updateBasicDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      leadType,
      tentativeValue,
      leadStatus,
      lost
    } = req.body;

    // Check if lead exists
    const existingLead = await Lead.findById(id);
    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    // Update basic details
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      {
        leadType,
        tentativeValue: tentativeValue || 0,
        leadStatus,
        lost: leadStatus === 'lost' ? (lost || '') : ''
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Basic details updated successfully",
      data: updatedLead
    });

  } catch (error) {
    console.error("Error in updateBasicDetails:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Add Conversation Controller
const addConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nextContact,
      timeSlot,
      comments
    } = req.body;

    // Validation
    if (!nextContact || !timeSlot || !comments) {
      return res.status(400).json({
        success: false,
        message: "All conversation fields are required"
      });
    }

    // Check if lead exists
    const existingLead = await Lead.findById(id);
    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    // Create new conversation
    const newConversation = {
      lastContact: new Date(),
      nextContact: new Date(nextContact),
      timeSlot,
      comments
    };

    // Update lead with new conversation and update nextContact field
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      {
        $push: { conversations: newConversation },
        $set: { 
          nextContact: new Date(nextContact),
          lastContact: new Date()
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Conversation added successfully",
      data: updatedLead
    });

  } catch (error) {
    console.error("Error in addConversation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get All Leads Controller
const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .select('-conversations'); // Exclude conversations for listing

    res.status(200).json({
      success: true,
      message: "Leads fetched successfully",
      data: leads,
      count: leads.length
    });

  } catch (error) {
    console.error("Error in getAllLeads:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get Single Lead Controller
const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead fetched successfully",
      data: lead
    });

  } catch (error) {
    console.error("Error in getLeadById:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get Lead Conversations Controller - UPDATED with sorting
const getLeadConversations = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id).select('conversations');
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    // Sort conversations by lastContact date in descending order (newest first)
    const sortedConversations = lead.conversations.sort((a, b) => {
      return new Date(b.lastContact) - new Date(a.lastContact);
    });

    res.status(200).json({
      success: true,
      message: "Conversations fetched successfully",
      data: sortedConversations
    });

  } catch (error) {
    console.error("Error in getLeadConversations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Delete Lead Controller
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLead = await Lead.findByIdAndDelete(id);
    if (!deletedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully"
    });

  } catch (error) {
    console.error("Error in deleteLead:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  addLead,
  updateLead,
  updateBasicDetails,
  addConversation,
  getAllLeads,
  getLeadById,
  getLeadConversations,
  deleteLead
};