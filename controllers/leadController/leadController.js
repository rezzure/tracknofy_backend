// const Lead = require("../../Schema/lead.schema/lead.model");

// // Add Lead Controller
// const addLead = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       mobile,
//       spocName,
//       spocMobile,
//       address,
//       leadSource,
//       assign,
//       projectType,
//       leadType,
//       description,
//       nextContact,
//       tentativeValue
//     } = req.body;

//     // Validation
//     if (!name || !email || !mobile || !address || !leadSource || !assign || !projectType || !leadType) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields must be filled"
//       });
//     }

//     // Check if lead already exists with same email or mobile
//     const existingLead = await Lead.findOne({
//       $or: [
//         { email: email },
//         { mobile: mobile }
//       ]
//     });

//     if (existingLead) {
//       return res.status(400).json({
//         success: false,
//         message: "Lead with this email or mobile already exists"
//       });
//     }

//     // Create new lead
//     const newLead = new Lead({
//       name,
//       email,
//       mobile,
//       spocName: spocName || '',
//       spocMobile: spocMobile || '',
//       address,
//       leadSource,
//       assign,
//       projectType,
//       leadType,
//       description: description || '',
//       tentativeValue: tentativeValue || 0,
//       nextContact: nextContact || null,
//       leadStatus: 'new leads'
//     });

//     await newLead.save();

//     res.status(201).json({
//       success: true,
//       message: "Lead created successfully",
//       data: newLead
//     });

//   } catch (error) {
//     console.error("Error in addLead:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Update Lead Controller
// const updateLead = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       name,
//       email,
//       mobile,
//       spocName,
//       spocMobile,
//       address,
//       leadSource,
//       assign,
//       projectType,
//       leadType,
//       description,
//       nextContact,
//       tentativeValue
//     } = req.body;

//     // Check if lead exists
//     const existingLead = await Lead.findById(id);
//     if (!existingLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Check for duplicate email/mobile excluding current lead
//     const duplicateLead = await Lead.findOne({
//       $and: [
//         { _id: { $ne: id } },
//         {
//           $or: [
//             { email: email },
//             { mobile: mobile }
//           ]
//         }
//       ]
//     });

//     if (duplicateLead) {
//       return res.status(400).json({
//         success: false,
//         message: "Another lead with this email or mobile already exists"
//       });
//     }

//     // Update lead
//     const updatedLead = await Lead.findByIdAndUpdate(
//       id,
//       {
//         name,
//         email,
//         mobile,
//         spocName: spocName || '',
//         spocMobile: spocMobile || '',
//         address,
//         leadSource,
//         assign,
//         projectType,
//         leadType,
//         description: description || '',
//         tentativeValue: tentativeValue || 0,
//         nextContact: nextContact || null
//       },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Lead updated successfully",
//       data: updatedLead
//     });

//   } catch (error) {
//     console.error("Error in updateLead:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Update Basic Details Controller
// const updateBasicDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       leadType,
//       tentativeValue,
//       leadStatus,
//       lost
//     } = req.body;

//     // Check if lead exists
//     const existingLead = await Lead.findById(id);
//     if (!existingLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Update basic details
//     const updatedLead = await Lead.findByIdAndUpdate(
//       id,
//       {
//         leadType,
//         tentativeValue: tentativeValue || 0,
//         leadStatus,
//         lost: leadStatus === 'lost' ? (lost || '') : ''
//       },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Basic details updated successfully",
//       data: updatedLead
//     });

//   } catch (error) {
//     console.error("Error in updateBasicDetails:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Add Conversation Controller
// const addConversation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       nextContact,
//       timeSlot,
//       comments
//     } = req.body;

//     // Validation
//     if (!nextContact || !timeSlot || !comments) {
//       return res.status(400).json({
//         success: false,
//         message: "All conversation fields are required"
//       });
//     }

//     // Check if lead exists
//     const existingLead = await Lead.findById(id);
//     if (!existingLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Create new conversation
//     const newConversation = {
//       lastContact: new Date(),
//       nextContact: new Date(nextContact),
//       timeSlot,
//       comments
//     };

//     // Update lead with new conversation and update nextContact field
//     const updatedLead = await Lead.findByIdAndUpdate(
//       id,
//       {
//         $push: { conversations: newConversation },
//         $set: { 
//           nextContact: new Date(nextContact),
//           lastContact: new Date()
//         }
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Conversation added successfully",
//       data: updatedLead
//     });

//   } catch (error) {
//     console.error("Error in addConversation:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Get All Leads Controller
// const getAllLeads = async (req, res) => {
//   try {
//     const leads = await Lead.find()
//       .sort({ createdAt: -1 })
//       .select('-conversations'); // Exclude conversations for listing

//     res.status(200).json({
//       success: true,
//       message: "Leads fetched successfully",
//       data: leads,
//       count: leads.length
//     });

//   } catch (error) {
//     console.error("Error in getAllLeads:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Get Single Lead Controller
// const getLeadById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Lead fetched successfully",
//       data: lead
//     });

//   } catch (error) {
//     console.error("Error in getLeadById:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Get Lead Conversations Controller - UPDATED with sorting
// const getLeadConversations = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const lead = await Lead.findById(id).select('conversations');
//     if (!lead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Sort conversations by lastContact date in descending order (newest first)
//     const sortedConversations = lead.conversations.sort((a, b) => {
//       return new Date(b.lastContact) - new Date(a.lastContact);
//     });

//     res.status(200).json({
//       success: true,
//       message: "Conversations fetched successfully",
//       data: sortedConversations
//     });

//   } catch (error) {
//     console.error("Error in getLeadConversations:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Delete Lead Controller
// const deleteLead = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedLead = await Lead.findByIdAndDelete(id);
//     if (!deletedLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Lead deleted successfully"
//     });

//   } catch (error) {
//     console.error("Error in deleteLead:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   addLead,
//   updateLead,
//   updateBasicDetails,
//   addConversation,
//   getAllLeads,
//   getLeadById,
//   getLeadConversations,
//   deleteLead
// };




// only Name and Mobile are required

// const Lead = require("../../Schema/lead.schema/lead.model");

// // Add Lead Controller - UPDATED: Only name and mobile are required
// const addLead = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       mobile,
//       spocName,
//       spocMobile,
//       address,
//       leadSource,
//       assign,
//       projectType,
//       leadType,
//       description,
//       nextContact,
//       tentativeValue
//     } = req.body;

//     // Validation - Only name and mobile are required
//     if (!name || !mobile) {
//       return res.status(400).json({
//         success: false,
//         message: "Name and Mobile are required fields"
//       });
//     }

//     // Check if lead already exists with same mobile (since mobile is required and unique)
//     const existingLead = await Lead.findOne({
//       mobile: mobile
//     });

//     if (existingLead) {
//       return res.status(400).json({
//         success: false,
//         message: "Lead with this mobile number already exists"
//       });
//     }

//     // Check for duplicate email only if email is provided
//     if (email) {
//       const existingEmailLead = await Lead.findOne({
//         email: email
//       });

//       if (existingEmailLead) {
//         return res.status(400).json({
//           success: false,
//           message: "Lead with this email already exists"
//         });
//       }
//     }

//     // Create new lead with default values for optional fields
//     const newLead = new Lead({
//       name,
//       email: email || '',
//       mobile,
//       spocName: spocName || '',
//       spocMobile: spocMobile || '',
//       address: address || '',
//       leadSource: leadSource || '',
//       assign: assign || '',
//       projectType: projectType || '',
//       leadType: leadType || '',
//       description: description || '',
//       tentativeValue: tentativeValue || 0,
//       nextContact: nextContact || null,
//       leadStatus: 'new leads'
//     });

//     await newLead.save();

//     res.status(201).json({
//       success: true,
//       message: "Lead created successfully",
//       data: newLead
//     });

//   } catch (error) {
//     console.error("Error in addLead:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Update Lead Controller - UPDATED: Only name and mobile are required
// const updateLead = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       name,
//       email,
//       mobile,
//       spocName,
//       spocMobile,
//       address,
//       leadSource,
//       assign,
//       projectType,
//       leadType,
//       description,
//       nextContact,
//       tentativeValue
//     } = req.body;

//     // Check if lead exists
//     const existingLead = await Lead.findById(id);
//     if (!existingLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Validation - Only name and mobile are required
//     if (!name || !mobile) {
//       return res.status(400).json({
//         success: false,
//         message: "Name and Mobile are required fields"
//       });
//     }

//     // Check for duplicate mobile excluding current lead
//     const duplicateMobileLead = await Lead.findOne({
//       $and: [
//         { _id: { $ne: id } },
//         { mobile: mobile }
//       ]
//     });

//     if (duplicateMobileLead) {
//       return res.status(400).json({
//         success: false,
//         message: "Another lead with this mobile number already exists"
//       });
//     }

//     // Check for duplicate email only if email is provided
//     if (email) {
//       const duplicateEmailLead = await Lead.findOne({
//         $and: [
//           { _id: { $ne: id } },
//           { email: email }
//         ]
//       });

//       if (duplicateEmailLead) {
//         return res.status(400).json({
//           success: false,
//           message: "Another lead with this email already exists"
//         });
//       }
//     }

//     // Update lead with optional fields handling
//     const updatedLead = await Lead.findByIdAndUpdate(
//       id,
//       {
//         name,
//         email: email || '',
//         mobile,
//         spocName: spocName || '',
//         spocMobile: spocMobile || '',
//         address: address || '',
//         leadSource: leadSource || '',
//         assign: assign || '',
//         projectType: projectType || '',
//         leadType: leadType || '',
//         description: description || '',
//         tentativeValue: tentativeValue || 0,
//         nextContact: nextContact || null
//       },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Lead updated successfully",
//       data: updatedLead
//     });

//   } catch (error) {
//     console.error("Error in updateLead:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Update Basic Details Controller - UPDATED: All fields are optional
// const updateBasicDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       leadType,
//       tentativeValue,
//       leadStatus,
//       lost
//     } = req.body;

//     // Check if lead exists
//     const existingLead = await Lead.findById(id);
//     if (!existingLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Prepare update object with only provided fields
//     const updateFields = {};
    
//     if (leadType !== undefined) updateFields.leadType = leadType;
//     if (tentativeValue !== undefined) updateFields.tentativeValue = tentativeValue || 0;
//     if (leadStatus !== undefined) {
//       updateFields.leadStatus = leadStatus;
//       // Only set lost field if lead status is 'lost'
//       if (leadStatus === 'lost') {
//         updateFields.lost = lost || '';
//       } else {
//         updateFields.lost = '';
//       }
//     }

//     // Update basic details
//     const updatedLead = await Lead.findByIdAndUpdate(
//       id,
//       updateFields,
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Basic details updated successfully",
//       data: updatedLead
//     });

//   } catch (error) {
//     console.error("Error in updateBasicDetails:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Add Conversation Controller - UPDATED: All fields are required for conversation
// const addConversation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       nextContact,
//       timeSlot,
//       comments
//     } = req.body;

//     // Validation - All conversation fields are required
//     if (!nextContact || !timeSlot || !comments) {
//       return res.status(400).json({
//         success: false,
//         message: "All conversation fields are required"
//       });
//     }

//     // Check if lead exists
//     const existingLead = await Lead.findById(id);
//     if (!existingLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Create new conversation
//     const newConversation = {
//       lastContact: new Date(),
//       nextContact: new Date(nextContact),
//       timeSlot,
//       comments
//     };

//     // Update lead with new conversation and update nextContact field
//     const updatedLead = await Lead.findByIdAndUpdate(
//       id,
//       {
//         $push: { conversations: newConversation },
//         $set: { 
//           nextContact: new Date(nextContact),
//           lastContact: new Date()
//         }
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Conversation added successfully",
//       data: updatedLead
//     });

//   } catch (error) {
//     console.error("Error in addConversation:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Get All Leads Controller
// const getAllLeads = async (req, res) => {
//   try {
//     const leads = await Lead.find()
//       .sort({ createdAt: -1 })
//       .select('-conversations'); // Exclude conversations for listing

//     res.status(200).json({
//       success: true,
//       message: "Leads fetched successfully",
//       data: leads,
//       count: leads.length
//     });

//   } catch (error) {
//     console.error("Error in getAllLeads:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Get Single Lead Controller
// const getLeadById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Lead fetched successfully",
//       data: lead
//     });

//   } catch (error) {
//     console.error("Error in getLeadById:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Get Lead Conversations Controller - UPDATED with sorting
// const getLeadConversations = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const lead = await Lead.findById(id).select('conversations');
//     if (!lead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Sort conversations by lastContact date in descending order (newest first)
//     const sortedConversations = lead.conversations.sort((a, b) => {
//       return new Date(b.lastContact) - new Date(a.lastContact);
//     });

//     res.status(200).json({
//       success: true,
//       message: "Conversations fetched successfully",
//       data: sortedConversations
//     });

//   } catch (error) {
//     console.error("Error in getLeadConversations:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Delete Lead Controller
// const deleteLead = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedLead = await Lead.findByIdAndDelete(id);
//     if (!deletedLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Lead deleted successfully"
//     });

//   } catch (error) {
//     console.error("Error in deleteLead:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   addLead,
//   updateLead,
//   updateBasicDetails,
//   addConversation,
//   getAllLeads,
//   getLeadById,
//   getLeadConversations,
//   deleteLead
// };


// conversation is not required


// const Lead = require("../../Schema/lead.schema/lead.model");

// // Add Lead Controller - UPDATED: Only name and mobile are required
// const addLead = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       mobile,
//       spocName,
//       spocMobile,
//       address,
//       leadSource,
//       assign,
//       projectType,
//       leadType,
//       description,
//       nextContact,
//       tentativeValue
//     } = req.body;

//     // Validation - Only name and mobile are required
//     if (!name || !mobile) {
//       return res.status(400).json({
//         success: false,
//         message: "Name and Mobile are required fields"
//       });
//     }

//     // Check if lead already exists with same mobile (since mobile is required and unique)
//     const existingLead = await Lead.findOne({
//       mobile: mobile
//     });

//     if (existingLead) {
//       return res.status(400).json({
//         success: false,
//         message: "Lead with this mobile number already exists"
//       });
//     }

//     // Check for duplicate email only if email is provided
//     if (email) {
//       const existingEmailLead = await Lead.findOne({
//         email: email
//       });

//       if (existingEmailLead) {
//         return res.status(400).json({
//           success: false,
//           message: "Lead with this email already exists"
//         });
//       }
//     }

//     // Create new lead with default values for optional fields
//     const newLead = new Lead({
//       name,
//       email: email || '',
//       mobile,
//       spocName: spocName || '',
//       spocMobile: spocMobile || '',
//       address: address || '',
//       leadSource: leadSource || '',
//       assign: assign || '',
//       projectType: projectType || '',
//       leadType: leadType || '',
//       description: description || '',
//       tentativeValue: tentativeValue || 0,
//       nextContact: nextContact || null,
//       leadStatus: 'new leads'
//     });

//     await newLead.save();

//     res.status(201).json({
//       success: true,
//       message: "Lead created successfully",
//       data: newLead
//     });

//   } catch (error) {
//     console.error("Error in addLead:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Update Lead Controller - UPDATED: Only name and mobile are required
// const updateLead = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       name,
//       email,
//       mobile,
//       spocName,
//       spocMobile,
//       address,
//       leadSource,
//       assign,
//       projectType,
//       leadType,
//       description,
//       nextContact,
//       tentativeValue
//     } = req.body;

//     // Check if lead exists
//     const existingLead = await Lead.findById(id);
//     if (!existingLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Validation - Only name and mobile are required
//     if (!name || !mobile) {
//       return res.status(400).json({
//         success: false,
//         message: "Name and Mobile are required fields"
//       });
//     }

//     // Check for duplicate mobile excluding current lead
//     const duplicateMobileLead = await Lead.findOne({
//       $and: [
//         { _id: { $ne: id } },
//         { mobile: mobile }
//       ]
//     });

//     if (duplicateMobileLead) {
//       return res.status(400).json({
//         success: false,
//         message: "Another lead with this mobile number already exists"
//       });
//     }

//     // Check for duplicate email only if email is provided
//     if (email) {
//       const duplicateEmailLead = await Lead.findOne({
//         $and: [
//           { _id: { $ne: id } },
//           { email: email }
//         ]
//       });

//       if (duplicateEmailLead) {
//         return res.status(400).json({
//           success: false,
//           message: "Another lead with this email already exists"
//         });
//       }
//     }

//     // Update lead with optional fields handling
//     const updatedLead = await Lead.findByIdAndUpdate(
//       id,
//       {
//         name,
//         email: email || '',
//         mobile,
//         spocName: spocName || '',
//         spocMobile: spocMobile || '',
//         address: address || '',
//         leadSource: leadSource || '',
//         assign: assign || '',
//         projectType: projectType || '',
//         leadType: leadType || '',
//         description: description || '',
//         tentativeValue: tentativeValue || 0,
//         nextContact: nextContact || null
//       },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Lead updated successfully",
//       data: updatedLead
//     });

//   } catch (error) {
//     console.error("Error in updateLead:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Update Basic Details Controller - UPDATED: All fields are optional
// const updateBasicDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       leadType,
//       tentativeValue,
//       leadStatus,
//       lost
//     } = req.body;

//     // Check if lead exists
//     const existingLead = await Lead.findById(id);
//     if (!existingLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Prepare update object with only provided fields
//     const updateFields = {};
    
//     if (leadType !== undefined) updateFields.leadType = leadType;
//     if (tentativeValue !== undefined) updateFields.tentativeValue = tentativeValue || 0;
//     if (leadStatus !== undefined) {
//       updateFields.leadStatus = leadStatus;
//       // Only set lost field if lead status is 'lost'
//       if (leadStatus === 'lost') {
//         updateFields.lost = lost || '';
//       } else {
//         updateFields.lost = '';
//       }
//     }

//     // Update basic details
//     const updatedLead = await Lead.findByIdAndUpdate(
//       id,
//       updateFields,
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Basic details updated successfully",
//       data: updatedLead
//     });

//   } catch (error) {
//     console.error("Error in updateBasicDetails:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Add Conversation Controller - UPDATED: All conversation fields are now optional
// const addConversation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       nextContact,
//       timeSlot,
//       comments
//     } = req.body;

//     // Check if lead exists
//     const existingLead = await Lead.findById(id);
//     if (!existingLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Create new conversation with optional fields
//     const newConversation = {
//       lastContact: new Date(),
//       nextContact: nextContact ? new Date(nextContact) : null,
//       timeSlot: timeSlot || '',
//       comments: comments || ''
//     };

//     // Prepare update data
//     const updateData = {
//       $push: { conversations: newConversation },
//       $set: { 
//         lastContact: new Date()
//       }
//     };

//     // Only update nextContact if provided
//     if (nextContact) {
//       updateData.$set.nextContact = new Date(nextContact);
//     }

//     // Update lead with new conversation
//     const updatedLead = await Lead.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Conversation added successfully",
//       data: updatedLead
//     });

//   } catch (error) {
//     console.error("Error in addConversation:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Get All Leads Controller
// const getAllLeads = async (req, res) => {
//   try {
//     const leads = await Lead.find()
//       .sort({ createdAt: -1 })
//       .select('-conversations'); // Exclude conversations for listing

//     res.status(200).json({
//       success: true,
//       message: "Leads fetched successfully",
//       data: leads,
//       count: leads.length
//     });

//   } catch (error) {
//     console.error("Error in getAllLeads:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Get Single Lead Controller
// const getLeadById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Lead fetched successfully",
//       data: lead
//     });

//   } catch (error) {
//     console.error("Error in getLeadById:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Get Lead Conversations Controller - UPDATED with sorting
// const getLeadConversations = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const lead = await Lead.findById(id).select('conversations');
//     if (!lead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Sort conversations by lastContact date in descending order (newest first)
//     const sortedConversations = lead.conversations.sort((a, b) => {
//       return new Date(b.lastContact) - new Date(a.lastContact);
//     });

//     res.status(200).json({
//       success: true,
//       message: "Conversations fetched successfully",
//       data: sortedConversations
//     });

//   } catch (error) {
//     console.error("Error in getLeadConversations:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Delete Lead Controller
// const deleteLead = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedLead = await Lead.findByIdAndDelete(id);
//     if (!deletedLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Lead deleted successfully"
//     });

//   } catch (error) {
//     console.error("Error in deleteLead:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   addLead,
//   updateLead,
//   updateBasicDetails,
//   addConversation,
//   getAllLeads,
//   getLeadById,
//   getLeadConversations,
//   deleteLead
// };




// project category

// const Lead = require("../../Schema/lead.schema/lead.model");

// // Add Lead Controller - MODIFIED to include projectCategory
// const addLead = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       mobile,
//       spocName,
//       spocMobile,
//       address,
//       leadSource,
//       assign,
//       projectType,
//       projectCategory, // <-- Destructure the new field
//       leadType,
//       description,
//       nextContact,
//       tentativeValue
//     } = req.body;

//     // Validation - Only name and mobile are required
//     if (!name || !mobile) {
//       return res.status(400).json({
//         success: false,
//         message: "Name and Mobile are required fields"
//       });
//     }

//     // Check if lead already exists with same mobile (since mobile is required and unique)
//     const existingLead = await Lead.findOne({
//       mobile: mobile
//     });

//     if (existingLead) {
//       return res.status(400).json({
//         success: false,
//         message: "Lead with this mobile number already exists"
//       });
//     }

//     // Check for duplicate email only if email is provided
//     if (email) {
//       const existingEmailLead = await Lead.findOne({
//         email: email
//       });

//       if (existingEmailLead) {
//         return res.status(400).json({
//           success: false,
//           message: "Lead with this email already exists"
//         });
//       }
//     }

//     // Create new lead with default values for optional fields
//     const newLead = new Lead({
//       name,
//       email: email || '',
//       mobile,
//       spocName: spocName || '',
//       spocMobile: spocMobile || '',
//       address: address || '',
//       leadSource: leadSource || '',
//       assign: assign || '',
//       projectType: projectType || '',
//       projectCategory: projectCategory || '', // <-- Add the new field to the lead object
//       leadType: leadType || '',
//       description: description || '',
//       tentativeValue: tentativeValue || 0,
//       nextContact: nextContact || null,
//       leadStatus: 'new leads'
//     });

//     await newLead.save();

//     res.status(201).json({
//       success: true,
//       message: "Lead created successfully",
//       data: newLead
//     });

//   } catch (error) {
//     console.error("Error in addLead:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Update Lead Controller - MODIFIED to include projectCategory
// const updateLead = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       name,
//       email,
//       mobile,
//       spocName,
//       spocMobile,
//       address,
//       leadSource,
//       assign,
//       projectType,
//       projectCategory, // <-- Destructure the new field
//       leadType,
//       description,
//       nextContact,
//       tentativeValue
//     } = req.body;

//     // Check if lead exists
//     const existingLead = await Lead.findById(id);
//     if (!existingLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Validation - Only name and mobile are required
//     if (!name || !mobile) {
//       return res.status(400).json({
//         success: false,
//         message: "Name and Mobile are required fields"
//       });
//     }

//     // Check for duplicate mobile excluding current lead
//     const duplicateMobileLead = await Lead.findOne({
//       $and: [
//         { _id: { $ne: id } },
//         { mobile: mobile }
//       ]
//     });

//     if (duplicateMobileLead) {
//       return res.status(400).json({
//         success: false,
//         message: "Another lead with this mobile number already exists"
//       });
//     }

//     // Check for duplicate email only if email is provided
//     if (email) {
//       const duplicateEmailLead = await Lead.findOne({
//         $and: [
//           { _id: { $ne: id } },
//           { email: email }
//         ]
//       });

//       if (duplicateEmailLead) {
//         return res.status(400).json({
//           success: false,
//           message: "Another lead with this email already exists"
//         });
//       }
//     }

//     // Update lead with optional fields handling
//     const updatedLead = await Lead.findByIdAndUpdate(
//       id,
//       {
//         name,
//         email: email || '',
//         mobile,
//         spocName: spocName || '',
//         spocMobile: spocMobile || '',
//         address: address || '',
//         leadSource: leadSource || '',
//         assign: assign || '',
//         projectType: projectType || '',
//         projectCategory: projectCategory || '', // <-- Add the new field to the update object
//         leadType: leadType || '',
//         description: description || '',
//         tentativeValue: tentativeValue || 0,
//         nextContact: nextContact || null
//       },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Lead updated successfully",
//       data: updatedLead
//     });

//   } catch (error) {
//     console.error("Error in updateLead:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Update Basic Details Controller - No changes needed here
// const updateBasicDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       leadType,
//       tentativeValue,
//       leadStatus,
//       lost
//     } = req.body;

//     // Check if lead exists
//     const existingLead = await Lead.findById(id);
//     if (!existingLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Prepare update object with only provided fields
//     const updateFields = {};
    
//     if (leadType !== undefined) updateFields.leadType = leadType;
//     if (tentativeValue !== undefined) updateFields.tentativeValue = tentativeValue || 0;
//     if (leadStatus !== undefined) {
//       updateFields.leadStatus = leadStatus;
//       // Only set lost field if lead status is 'lost'
//       if (leadStatus === 'lost') {
//         updateFields.lost = lost || '';
//       } else {
//         updateFields.lost = '';
//       }
//     }

//     // Update basic details
//     const updatedLead = await Lead.findByIdAndUpdate(
//       id,
//       updateFields,
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Basic details updated successfully",
//       data: updatedLead
//     });

//   } catch (error) {
//     console.error("Error in updateBasicDetails:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Add Conversation Controller - No changes needed here
// const addConversation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       nextContact,
//       timeSlot,
//       comments
//     } = req.body;

//     // Check if lead exists
//     const existingLead = await Lead.findById(id);
//     if (!existingLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Create new conversation with optional fields
//     const newConversation = {
//       lastContact: new Date(),
//       nextContact: nextContact ? new Date(nextContact) : null,
//       timeSlot: timeSlot || '',
//       comments: comments || ''
//     };

//     // Prepare update data
//     const updateData = {
//       $push: { conversations: newConversation },
//       $set: { 
//         lastContact: new Date()
//       }
//     };

//     // Only update nextContact if provided
//     if (nextContact) {
//       updateData.$set.nextContact = new Date(nextContact);
//     }

//     // Update lead with new conversation
//     const updatedLead = await Lead.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Conversation added successfully",
//       data: updatedLead
//     });

//   } catch (error) {
//     console.error("Error in addConversation:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Get All Leads Controller - No changes needed here
// const getAllLeads = async (req, res) => {
//   try {
//     const leads = await Lead.find()
//       .sort({ createdAt: -1 })
//       .select('-conversations'); // Exclude conversations for listing

//     res.status(200).json({
//       success: true,
//       message: "Leads fetched successfully",
//       data: leads,
//       count: leads.length
//     });

//   } catch (error) {
//     console.error("Error in getAllLeads:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Get Single Lead Controller - No changes needed here
// const getLeadById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Lead fetched successfully",
//       data: lead
//     });

//   } catch (error) {
//     console.error("Error in getLeadById:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Get Lead Conversations Controller - No changes needed here
// const getLeadConversations = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const lead = await Lead.findById(id).select('conversations');
//     if (!lead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     // Sort conversations by lastContact date in descending order (newest first)
//     const sortedConversations = lead.conversations.sort((a, b) => {
//       return new Date(b.lastContact) - new Date(a.lastContact);
//     });

//     res.status(200).json({
//       success: true,
//       message: "Conversations fetched successfully",
//       data: sortedConversations
//     });

//   } catch (error) {
//     console.error("Error in getLeadConversations:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Delete Lead Controller - No changes needed here
// const deleteLead = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedLead = await Lead.findByIdAndDelete(id);
//     if (!deletedLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Lead deleted successfully"
//     });

//   } catch (error) {
//     console.error("Error in deleteLead:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   addLead,
//   updateLead,
//   updateBasicDetails,
//   addConversation,
//   getAllLeads,
//   getLeadById,
//   getLeadConversations,
//   deleteLead
// };



// making all field editable in the Basic Form Details

const Lead = require("../../Schema/lead.schema/lead.model");

// Add Lead Controller - MODIFIED to include projectCategory
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
      projectCategory, // <-- Destructure the new field
      leadType,
      description,
      nextContact,
      tentativeValue
    } = req.body;

    // Validation - Only name and mobile are required
    if (!name || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Name and Mobile are required fields"
      });
    }

    // Check if lead already exists with same mobile (since mobile is required and unique)
    const existingLead = await Lead.findOne({
      mobile: mobile
    });

    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: "Lead with this mobile number already exists"
      });
    }

    // Check for duplicate email only if email is provided
    if (email) {
      const existingEmailLead = await Lead.findOne({
        email: email
      });

      if (existingEmailLead) {
        return res.status(400).json({
          success: false,
          message: "Lead with this email already exists"
        });
      }
    }

    // Create new lead with default values for optional fields
    const newLead = new Lead({
      name,
      email: email || '',
      mobile,
      spocName: spocName || '',
      spocMobile: spocMobile || '',
      address: address || '',
      leadSource: leadSource || '',
      assign: assign || '',
      projectType: projectType || '',
      projectCategory: projectCategory || '', // <-- Add the new field to the lead object
      leadType: leadType || '',
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

// Update Lead Controller - MODIFIED to include projectCategory
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
      projectCategory, // <-- Destructure the new field
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

    // Validation - Only name and mobile are required
    if (!name || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Name and Mobile are required fields"
      });
    }

    // Check for duplicate mobile excluding current lead
    const duplicateMobileLead = await Lead.findOne({
      $and: [
        { _id: { $ne: id } },
        { mobile: mobile }
      ]
    });

    if (duplicateMobileLead) {
      return res.status(400).json({
        success: false,
        message: "Another lead with this mobile number already exists"
      });
    }

    // Check for duplicate email only if email is provided
    if (email) {
      const duplicateEmailLead = await Lead.findOne({
        $and: [
          { _id: { $ne: id } },
          { email: email }
        ]
      });

      if (duplicateEmailLead) {
        return res.status(400).json({
          success: false,
          message: "Another lead with this email already exists"
        });
      }
    }

    // Update lead with optional fields handling
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      {
        name,
        email: email || '',
        mobile,
        spocName: spocName || '',
        spocMobile: spocMobile || '',
        address: address || '',
        leadSource: leadSource || '',
        assign: assign || '',
        projectType: projectType || '',
        projectCategory: projectCategory || '', // <-- Add the new field to the update object
        leadType: leadType || '',
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

// Update Basic Details Controller - UPDATED TO HANDLE ALL FIELDS
const updateBasicDetails = async (req, res) => {
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
        projectCategory,
        leadType,
        description,
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

    // Validation - Name and mobile are required
    if (!name || !mobile) {
      return res.status(400).json({
          success: false,
          message: "Name and Mobile are required fields"
      });
    }
    
    // Check for duplicate mobile excluding the current lead
    const duplicateMobileLead = await Lead.findOne({ mobile: mobile, _id: { $ne: id } });
    if (duplicateMobileLead) {
        return res.status(400).json({
            success: false,
            message: "Another lead with this mobile number already exists"
        });
    }

    // Check for duplicate email (if provided) excluding the current lead
    if (email) {
        const duplicateEmailLead = await Lead.findOne({ email: email, _id: { $ne: id } });
        if (duplicateEmailLead) {
            return res.status(400).json({
                success: false,
                message: "Another lead with this email already exists"
            });
        }
    }

    // Prepare update object with only provided fields to avoid overwriting with null
    const updateFields = {};
    
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email || '';
    if (mobile !== undefined) updateFields.mobile = mobile;
    if (spocName !== undefined) updateFields.spocName = spocName || '';
    if (spocMobile !== undefined) updateFields.spocMobile = spocMobile || '';
    if (address !== undefined) updateFields.address = address || '';
    if (leadSource !== undefined) updateFields.leadSource = leadSource || '';
    if (assign !== undefined) updateFields.assign = assign || '';
    if (projectType !== undefined) updateFields.projectType = projectType || '';
    if (projectCategory !== undefined) updateFields.projectCategory = projectCategory || '';
    if (leadType !== undefined) updateFields.leadType = leadType || '';
    if (description !== undefined) updateFields.description = description || '';
    if (tentativeValue !== undefined) updateFields.tentativeValue = tentativeValue || 0;
    
    if (leadStatus !== undefined) {
      updateFields.leadStatus = leadStatus;
      // Only set lost field if lead status is 'lost'
      if (leadStatus === 'lost') {
        updateFields.lost = lost || '';
      } else {
        updateFields.lost = ''; // Clear lost reason if status changes from 'lost'
      }
    }

    // Update basic details
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: updateFields },
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

// Add Conversation Controller - No changes needed here
const addConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nextContact,
      timeSlot,
      comments
    } = req.body;

    // Check if lead exists
    const existingLead = await Lead.findById(id);
    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    // Create new conversation with optional fields
    const newConversation = {
      lastContact: new Date(),
      nextContact: nextContact ? new Date(nextContact) : null,
      timeSlot: timeSlot || '',
      comments: comments || ''
    };

    // Prepare update data
    const updateData = {
      $push: { conversations: newConversation },
      $set: { 
        lastContact: new Date()
      }
    };

    // Only update nextContact if provided
    if (nextContact) {
      updateData.$set.nextContact = new Date(nextContact);
    }

    // Update lead with new conversation
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      updateData,
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

// Get All Leads Controller - No changes needed here
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

// Get Single Lead Controller - No changes needed here
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

// Get Lead Conversations Controller - No changes needed here
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

// Delete Lead Controller - No changes needed here
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