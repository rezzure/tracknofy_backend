
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Company = require("../../Schema/superAdmin.schema/company.model");
const CompanyUser = require("../../Schema/superAdmin.schema/companyUser.model");

// Generate random password
const generateTempPassword = () => {
  return crypto.randomBytes(8).toString("hex");
};

// Email configuration
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// Send email with credentials
// const sendCredentialsEmail = async (email, name, tempPassword, companyName) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: `Your Admin Account for ${companyName}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2>Welcome to ${companyName}!</h2>
//         <p>Hello ${name},</p>
//         <p>Your admin account has been created successfully.</p>
//         <p><strong>Login Credentials:</strong></p>
//         <p>Email: ${email}</p>
//         <p>Temporary Password: ${tempPassword}</p>
//         <p>Please login at: <a href="${process.env.FRONTEND_URL}">${process.env.FRONTEND_URL}</a></p>
//         <p><strong>Important:</strong> Please change your password on first login.</p>
//         <br>
//         <p>Best regards,<br>${companyName} Team</p>
//       </div>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Failed to send email");
//   }
// };

// Add new company and admin
const addCompanies = async (req, res) => {
  try {
    const {
      companyName,
      companyAddress,
      companyContactNo,
      adminName,
      adminContactNo,
      adminEmail,
      noOfUsers,
    } = req.body;

    const { companyLogo } = req.file.filename;

    console.log(companyLogo);

    console.log(
      companyName,
      companyAddress,
      companyContactNo,
      adminName,
      adminContactNo,
      adminEmail,
      noOfUsers
    );

    // Check if company already exists
    const existingCompany = await Company.findOne({ companyName });
    if (existingCompany) {
      return res.status(409).json({
        message: "Company with this name already exists",
      });
    }

    // Check if admin email already exists
    const existingAdmin = await CompanyUser.findOne({ email: adminEmail });
    if (existingAdmin) {
      return res.status(409).json({
        message: "Admin with this email already exists",
      });
    }

    // Create new company
    const companyData = {
      companyName,
      companyAddress,
      companyContactNo,
      noOfUsers: parseInt(noOfUsers),
    };

    // Add logo path if uploaded
    if (req.file) {
      companyData.companyLogo = req.file.filename || null;
    }

    const company = new Company(companyData);
    await company.save();

    // Generate temporary password
    const tempPassword = generateTempPassword();

    // Create admin user
    const adminUser = new CompanyUser({
      name: adminName,
      email: adminEmail,
      phone: adminContactNo,
      password: tempPassword,
      role: "Admin",
      companyId: company._id,
    });

    await adminUser.save();

    // Send email with credentials
    try {
      await sendCredentialsEmail(
        adminEmail,
        adminName,
        tempPassword,
        companyName
      );
    } catch (emailError) {
      // If email fails, we still return success but log the error
      console.error("Email sending failed:", emailError);
    }

    // Return success response
    res.status(201).json({
      message: "Company and admin created successfully",
      success : true,
      company: {
        id: company._id,
        companyName: company.companyName,
        companyAddress: company.companyAddress,
        companyContactNo: company.companyContactNo,
        companyLogo: company.companyLogo,
        noOfUsers: company.noOfUsers,
      },
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        phone: adminUser.phone,
      },
    });
  } catch (error) {
    console.error("Error adding company:", error);
    res.status(500).json({
      message: "Server error occurred while adding company",
      error: error.message,
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
        const admin = await CompanyUser.findOne({
          companyId: company._id,
          role: 'Admin',
          isActive: true
        }).select('name email phone');

        return {
          ...company,
          admin: admin || null
        };
      })
    );

    res.status(201).json({
      success : true,
      message : "All companies with their admins fetched success ",
      companiesWithAdmins : companiesWithAdmins
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
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
      adminName,
      adminContactNo,
      adminEmail,
      noOfUsers
    } = req.body;

    const companyId = req.params.id;
    console.log(`companyId aagya hai bhau ${companyId}`)

    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Update only editable fields
    company.noOfUsers = parseInt(noOfUsers);
    await company.save();

    // Update admin user
    const adminUser = await CompanyUser.findOne({
      companyId: companyId,
      role: 'Admin'
    });

    if (adminUser) {
      // Check if email is being changed and if it already exists
      if (adminUser.email !== adminEmail) {
        const existingUser = await CompanyUser.findOne({
          email: adminEmail,
          _id: { $ne: adminUser._id }
        });
        if (existingUser) {
          return res.status(409).json({
            message: 'Admin with this email already exists'
          });
        }
      }

      adminUser.name = adminName;
      adminUser.email = adminEmail;
      adminUser.phone = adminContactNo;
      await adminUser.save();
    }

    res.status(201).json({
      message: 'Company and admin updated successfully',
      success : true,
      company: {
        id: company._id,
        companyName: company.companyName,
        companyAddress: company.companyAddress,
        companyContactNo: company.companyContactNo,
        companyLogo: company.companyLogo,
        noOfUsers: company.noOfUsers
      },
      admin: adminUser ? {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        phone: adminUser.phone
      } : null
    });

  } catch (error) {
    console.error('Error updating company:', error.message);
    res.status(500).json({
      message: 'Server error occurred while updating company',
      error: error.message
    });
  }
};

// Delete company (soft delete)
// exports.deleteCompany = async (req, res) => {
//   try {
//     const companyId = req.params.id;

//     const company = await Company.findById(companyId);
//     if (!company) {
//       return res.status(404).json({ message: 'Company not found' });
//     }

//     // Soft delete company
//     company.isActive = false;
//     await company.save();

//     // Deactivate all users associated with this company
//     await User.updateMany(
//       { companyId: companyId },
//       { isActive: false }
//     );

//     res.json({ message: 'Company deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting company:', error);
//     res.status(500).json({
//       message: 'Server error occurred while deleting company',
//       error: error.message
//     });
//   }
// };

module.exports={addCompanies, getCompanies, updateCompany};
