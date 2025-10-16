
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Company = require("../../Schema/superAdmin.schema/company.model");
const CompanyAdmin = require("../../Schema/superAdmin.schema/companyAdmin.model");
const AddCompany = require("../../Schema/superAdmin.schema/addCompany.model");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

// Generate random password
const generateTempPassword = () => {
  return crypto.randomBytes(8).toString("hex");
};

// Email configuration
const transporter = nodemailer.createTransport({
  service: "prabhat123@gmail.com+testing1@gmail.com",
  auth: {
    user: process.env.SUPER_ADMIN_EMAIL,
    pass: process.env.SUPER_ADMIN_PASSWORD,
  },
});

// Send email with credentials
const sendCredentialsEmail = async (email, name, tempPassword, companyName) => {
  const mailOptions = {
    from: process.env.SUPER_ADMIN_EMAIL,
    to: email,
    subject: `Your Admin Account for ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to ${companyName}!</h2>
        <p>Hello ${name},</p>
        <p>Your admin account has been created successfully.</p>
        <p><strong>Login Credentials:</strong></p>
        <p>Email: ${email}</p>
        <p>Temporary Password: ${tempPassword}</p>
        <p>Please login at: <a href="${process.env.FRONTEND_URL}">${process.env.FRONTEND_URL}</a></p>
        <p><strong>Important:</strong> Please change your password on first login.</p>
        <br>
        <p>Best regards,<br>${companyName} Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

// // Add new company and admin
// const addCompanies = async (req, res) => {
//   try {
//     const {
//       companyName,
//       companyAddress,
//       companyContactNo,
//       adminName,
//       adminContactNo,
//       adminEmail,
//       noOfUsers,
//     } = req.body;

//     const { companyLogo } = req.file.filename;

//     console.log(companyLogo);

 
//     // Check if company already exists
//     const existingCompany = await Company.findOne({ companyName });
//     if (existingCompany) {
//       return res.status(409).json({
//         message: "Company with this name already exists",
//       });
//     }

//     // Check if admin email already exists
//     const existingAdmin = await CompanyAdmin.findOne({ email: adminEmail });
//     if (existingAdmin) {
//       return res.status(409).json({
//         message: "Admin with this email already exists",
//       });
//     }

//     // Create new company
//     const companyData = {
//       companyName,
//       companyAddress,
//       companyContactNo,
//       noOfUsers: parseInt(noOfUsers),
//     };

//     // Add logo path if uploaded
//     if (req.file) {
//       companyData.companyLogo = req.file.filename || null;
//     }

//     const company = new Company(companyData);
//     await company.save();

//     // Generate temporary password
//     const tempPassword = generateTempPassword();

//     // Create admin user
//     const adminUser = new CompanyAdmin({
//       name: adminName,
//       email: adminEmail,
//       phone: adminContactNo,
//       password: tempPassword,
//       role: "Admin",
//       companyId: company._id,
//     });

//     await adminUser.save();

//     // Send email with credentials
//     try {
//       await sendCredentialsEmail(
//         adminEmail,
//         adminName,
//         tempPassword,
//         companyName
//       );
//     } catch (emailError) {
//       // If email fails, we still return success but log the error
//       console.error("Email sending failed:", emailError);
//     }

//     // Return success response
//     res.status(201).json({
//       message: "Company and admin created successfully",
//       success : true,
//       company: {
//         id: company._id,
//         companyName: company.companyName,
//         companyAddress: company.companyAddress,
//         companyContactNo: company.companyContactNo,
//         companyLogo: company.companyLogo,
//         noOfUsers: company.noOfUsers,
//       },
//       admin: {
//         id: adminUser._id,
//         name: adminUser.name,
//         email: adminUser.email,
//         phone: adminUser.phone,
//         password : adminUser.password
//       },
//     });
//   } catch (error) {
//     console.error("Error adding company:", error);
//     res.status(500).json({
//       message: "Server error occurred while adding company",
//       error: error.message,
//     });
//   }
// };



// Add new company and admin
const addCompanies = async (req, res) => {
  try {
    const {
      companyName,
      companyAddress,
      companyContactNo,
      companyGST,
      adminName,
      adminContactNo,
      adminEmail,
      adminPassword,
      noOfUsers,
    } = req.body;


    console.log(companyName,
      companyAddress,
      companyContactNo,
      companyGST,
      adminName,
      adminContactNo,
      adminEmail,
      adminPassword,
      noOfUsers,)
    // Check for required fields
    if (!companyName || !companyAddress || !companyContactNo || !companyGST || 
        !adminName || !adminContactNo || !adminEmail || !adminPassword || !noOfUsers) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Validate number of users
    if (noOfUsers < 1 || noOfUsers > 1000) {
      return res.status(400).json({
        success: false,
        message: "Number of users must be between 1 and 1000"
      });
    }

    // Check if company already exists by name or GST
    const existingCompanyByName = await Company.findOne({ companyName });
    if (existingCompanyByName) {
      return res.status(409).json({
        success: false,
        message: "Company with this name already exists"
      });
    }

    const existingCompanyByGST = await Company.findOne({ companyGST });
    if (existingCompanyByGST) {
      return res.status(409).json({
        success: false,
        message: "Company with this GST number already exists"
      });
    }

    // Check if admin email already exists
    const existingAdmin = await CompanyAdmin.findOne({ email: adminEmail.toLowerCase() });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email already exists"
      });
    }

    // Create new company
    const companyData = {
      companyName: companyName.trim(),
      companyAddress: companyAddress.trim(),
      companyContactNo: companyContactNo.trim(),
      companyGST: companyGST.trim().toUpperCase(),
      noOfUsers: parseInt(noOfUsers),
      adminEmail: adminEmail.toLowerCase().trim()
    };

    // Add logo path if uploaded
    if (req.file) {
      companyData.companyLogo = req.file.filename;
    }

    const company = new Company(companyData);
    await company.save();

    // Create admin user with provided password
    const adminUser = new CompanyAdmin({
      name: adminName.trim(),
      email: adminEmail.toLowerCase().trim(),
      phone: adminContactNo.trim(),
      password: adminPassword,
      role: "Admin",
      companyId: company._id,
      companyGST: companyGST.trim().toUpperCase()
    });

    await adminUser.save();

    // Also create entry in AddCompany collection for backup
    const addCompanyEntry = new AddCompany({
      companyName: companyName.trim(),
      companyAddress: companyAddress.trim(),
      companyContactNo: companyContactNo.trim(),
      companyGST: companyGST.trim().toUpperCase(),
      adminName: adminName.trim(),
      adminContactNo: adminContactNo.trim(),
      adminEmail: adminEmail.toLowerCase().trim(),
      adminPassword: adminPassword,
      noOfUsers: parseInt(noOfUsers),
      companyLogo: req.file ? req.file.filename : null
    });

    await addCompanyEntry.save();

    // // Send email with credentials (optional - you can keep this if needed)
    // try {
    //   await sendCredentialsEmail(
    //     adminEmail,
    //     adminName,
    //     adminPassword, // Now using the provided password
    //     companyName
    //   );
    // } catch (emailError) {
    //   console.error("Email sending failed:", emailError);
    //   // Continue even if email fails
    // }

    // Return success response
    res.status(201).json({
      success: true,
      message: "Company and admin created successfully",
      company: {
        _id: company._id,
        companyName: company.companyName,
        companyAddress: company.companyAddress,
        companyContactNo: company.companyContactNo,
        companyGST: company.companyGST,
        companyLogo: company.companyLogo,
        noOfUsers: company.noOfUsers,
        status: company.status,
        adminEmail: company.adminEmail,
        createdAt: company.createdAt
      },
      admin: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        phone: adminUser.phone,
        role: adminUser.role,
        companyGST: adminUser.companyGST
      }
    });
  } catch (error) {
    console.error("Error adding company:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate entry found. Company name, GST or admin email already exists."
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error occurred while adding company",
      error: error.message
    });
  }
};


// Get all companies with their admins
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    // Get admin details for each company
    const companiesWithAdmins = await Promise.all(
      companies.map(async (company) => {
        const admin = await CompanyAdmin.findOne({
          companyId: company._id,
          role: 'Admin',
          isActive: true
        }).select('name email phone');

        return {
          _id: company._id,
          companyName: company.companyName,
          companyAddress: company.companyAddress,
          companyContactNo: company.companyContactNo,
          companyGST: company.companyGST,
          companyLogo: company.companyLogo,
          noOfUsers: company.noOfUsers,
          status: company.status,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt,
          admin: admin || null,
          // For frontend compatibility - ensure these fields are always present
          adminName: admin ? admin.name : (company.adminName || 'N/A'),
          adminContactNo: admin ? admin.phone : (company.adminContactNo || 'N/A'),
          adminEmail: admin ? admin.email : (company.adminEmail || 'N/A')
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "All companies with their admins fetched successfully",
      companiesWithAdmins: companiesWithAdmins,
      totalCompanies: companiesWithAdmins.length
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching companies',
      error: error.message
    });
  }
};




// Get single company by ID
// exports.getCompanyById = async (req, res) => {
//   try {
//     const company = await Company.findById(req.params.id);
//     if (!company) {
//       return res.status(404).json({ message: 'Company not found' });
//     }

//     const admin = await User.findOne({
//       companyId: company._id,
//       role: 'Admin',
//       isActive: true
//     }).select('name email phone');

//     res.json({
//       ...company.toObject(),
//       admin: admin || null
//     });
//   } catch (error) {
//     console.error('Error fetching company:', error);
//     res.status(500).json({
//       message: 'Server error occurred while fetching company',
//       error: error.message
//     });
//   }
// };

// Update company and admin (only editable fields)



const updateCompany = async (req, res) => {
  try {
    const {
      companyName,
      companyAddress,
      companyContactNo,
      companyGST,
      adminName,
      adminContactNo,
      adminEmail,
      adminPassword,
      noOfUsers
    } = req.body;

    const companyId = req.params.id;
    console.log(`Updating company with ID: ${companyId}`);

    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ 
        success: false,
        message: 'Company not found' 
      });
    }

    // Update company fields - include all editable fields
    if (companyName !== undefined) company.companyName = companyName;
    if (companyAddress !== undefined) company.companyAddress = companyAddress;
    if (companyContactNo !== undefined) company.companyContactNo = companyContactNo;
    if (companyGST !== undefined) company.companyGST = companyGST;
    if (noOfUsers !== undefined) company.noOfUsers = parseInt(noOfUsers);

    // Handle company logo file upload if provided
    if (req.file) {
      company.companyLogo = req.file.filename;
    }

    await company.save();

    // Update admin user
    const adminUser = await CompanyAdmin.findOne({
      companyId: companyId,
      role: 'Admin'
    });

    if (adminUser) {
      // Check if email is being changed and if it already exists
      if (adminEmail && adminUser.email !== adminEmail) {
        const existingUser = await CompanyAdmin.findOne({
          email: adminEmail,
          _id: { $ne: adminUser._id }
        });
        
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'Admin with this email already exists'
          });
        }
      }

      // Update admin fields
      if (adminName !== undefined) adminUser.name = adminName;
      if (adminEmail !== undefined) adminUser.email = adminEmail;
      if (adminContactNo !== undefined) adminUser.phone = adminContactNo;
      
      // Update password only if provided and not empty
      if (adminPassword && adminPassword.trim() !== '') {
        // Hash the password before saving (assuming you have bcrypt setup)
        const saltRounds = 10;
        adminUser.password = await bcrypt.hash(adminPassword, saltRounds);
      }

      await adminUser.save();
    }

    // Prepare response data matching the frontend expectation
    const responseData = {
      _id: company._id,
      companyName: company.companyName,
      companyAddress: company.companyAddress,
      companyContactNo: company.companyContactNo,
      companyGST: company.companyGST,
      companyLogo: company.companyLogo,
      noOfUsers: company.noOfUsers,
      status: company.status,
      adminName: adminUser?.name || adminName,
      adminContactNo: adminUser?.phone || adminContactNo,
      adminEmail: adminUser?.email || adminEmail,
      admin: adminUser ? {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        phone: adminUser.phone
      } : null
    };

    res.status(200).json({
      message: 'Company and admin updated successfully',
      success: true,
      ...responseData
    });

  } catch (error) {
    console.error('Error updating company:', error.message);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error occurred',
        error: error.message
      });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Company with this name or email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error occurred while updating company',
      error: error.message
    });
  }
};

// Update company status (Active/InActive)
const updateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;


    // Validate input
    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: 'Company ID and status are required'
      });
    }

    // Validate status value
    if (!['Active', 'InActive'].includes(status)) {
      console.log('DEBUG: Validation failed - Invalid status value');
      return res.status(400).json({
        success: false,
        message: 'Status must be either "Active" or "InActive"'
      });
    }

    
    // Find company and update status
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    console.log(`DEBUG: Update result:`, updatedCompany);

    // Check if company exists
    if (!updatedCompany) {
      console.log('DEBUG: Company not found');
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Return success response - ONLY ONCE
    return res.status(200).json({
      success: true,
      message: `Company status updated to ${status}`,
      company: updatedCompany
    });

  } catch (error) {
    console.error('ERROR: Error updating company status:', error.message);
    
    // Handle specific errors
    if (error.name === 'CastError') {
      console.log('DEBUG: CastError - Invalid company ID format');
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID format'
      });
    }

    // Return error response - ONLY ONCE
    return res.status(500).json({
      success: false,
      message: 'Server error while updating company status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};







module.exports={addCompanies, getCompanies, updateCompany, updateCompanyStatus};
