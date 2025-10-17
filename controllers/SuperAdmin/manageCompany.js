
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Company = require("../../Schema/superAdmin.schema/company.model");
const CompanyAdmin = require("../../Schema/superAdmin.schema/companyAdmin.model");


const bcrypt = require("bcrypt");
const DatabaseInitializer = require("../../services/databaseInitializer");


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


const addCompany = async (req, res) => {
  let transactionCompleted = false;
  let companyCreated = false;
  let adminCreated = false;
  let databaseInitialized = false;
  let createdCompany = null;
  let createdAdmin = null;

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
      pricingPlan,
      selectedFeatures,
      customPricing
    } = req.body;

    // Validate required fields
    if (!companyName || !companyAddress || !companyContactNo || !adminName || 
        !adminContactNo || !adminEmail || !adminPassword || !noOfUsers || !pricingPlan) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
        missingFields: {
          companyName: !companyName,
          companyAddress: !companyAddress,
          companyContactNo: !companyContactNo,
          adminName: !adminName,
          adminContactNo: !adminContactNo,
          adminEmail: !adminEmail,
          adminPassword: !adminPassword,
          noOfUsers: !noOfUsers,
          pricingPlan: !pricingPlan
        }
      });
    }

    // Parse JSON fields with error handling
    let features = [];
    let pricing = {};

    try {
      features = selectedFeatures ? JSON.parse(selectedFeatures) : [];
      pricing = customPricing ? JSON.parse(customPricing) : {};
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in features or pricing data",
        error: parseError.message
      });
    }

    // Validate features array
    if (!Array.isArray(features) || features.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one feature must be selected"
      });
    }

    // Validate company name format
    const companyNameRegex = /^[a-zA-Z\s\-&.,()]+$/;
    if (!companyNameRegex.test(companyName)) {
      return res.status(400).json({
        success: false,
        message: "Company name should contain only letters, spaces, and basic punctuation"
      });
    }

    if (companyName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Company name should be at least 2 characters long"
      });
    }

    // Validate company address length
    if (companyAddress.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Address should be at least 10 characters long"
      });
    }

    if (companyAddress.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 500 characters"
      });
    }

    // Validate contact numbers
    const contactRegex = /^\d{10,15}$/;
    if (!contactRegex.test(companyContactNo.replace(/\s/g, ''))) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid company contact number (10-15 digits)"
      });
    }

    if (!contactRegex.test(adminContactNo.replace(/\s/g, ''))) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid admin contact number (10-15 digits)"
      });
    }

    // Validate GST format if provided
    if (companyGST && companyGST.trim() !== '') {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
      if (!gstRegex.test(companyGST.toUpperCase())) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid GST number format (e.g., 07ABCCT1234A1Z5)"
        });
      }
    }

    // Validate admin name format
    const adminNameRegex = /^[a-zA-Z\s]+$/;
    if (!adminNameRegex.test(adminName)) {
      return res.status(400).json({
        success: false,
        message: "Admin name should contain only letters and spaces"
      });
    }

    if (adminName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Admin name should be at least 2 characters long"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }

    // Validate password strength
    if (adminPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    if (adminPassword.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Password cannot exceed 50 characters"
      });
    }

    // Validate noOfUsers format
    const validUserRanges = ['1-10', '10-20', '20-50', '50-100', '100+'];
    if (!validUserRanges.includes(noOfUsers)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid number of users range"
      });
    }

    // Validate pricing plan
    const validPlans = ['silver', 'golden', 'diamond'];
    if (!validPlans.includes(pricingPlan)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid pricing plan"
      });
    }

    // Check if company already exists (using new enhanced Company schema)
    const existingCompany = await Company.findOne({
      $or: [
        { companyName: { $regex: new RegExp(`^${companyName}$`, 'i') } },
        { companyGST: companyGST }
      ]
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company with this name or GST already exists",
        conflict: {
          field: existingCompany.companyName.toLowerCase() === companyName.toLowerCase() ? 'companyName' : 'companyGST',
          value: existingCompany.companyName.toLowerCase() === companyName.toLowerCase() ? companyName : companyGST
        }
      });
    }

    // Check if admin email already exists (using CompanyAdmin model)
    const existingAdmin = await CompanyAdmin.findOne({ 
      email: { $regex: new RegExp(`^${adminEmail}$`, 'i') } 
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email already exists",
        conflict: {
          field: 'email',
          value: adminEmail
        }
      });
    }

    // Start transaction - Create company with enhanced schema
    const newCompany = new Company({
      companyName: companyName.trim(),
      companyAddress: companyAddress.trim(),
      companyContactNo: companyContactNo.trim(),
      companyGST: companyGST ? companyGST.trim() : '',
      adminName: adminName.trim(),
      adminContactNo: adminContactNo.trim(),
      adminEmail: adminEmail.toLowerCase().trim(),
      noOfUsers: noOfUsers,
      companyLogo: req.file ? req.file.filename : null,
      pricingPlan: pricingPlan,
      customPricing: pricing,
      features: features.map(feature => ({
        featureName: feature.featureName,
        featuresCategories: feature.featuresCategories,
        path: feature.path,
        icon: feature.icon,
        isActive: true
      })),
      status: "Active",
      databaseName: `smt_${companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`,
      databaseStatus: 'Pending',
      currentUserCount: 1,
      subscriptionStartDate: new Date(),
      createdBy: "superadmin"
    });

    const savedCompany = await newCompany.save();
    companyCreated = true;
    createdCompany = savedCompany;

    console.log(`Company created successfully: ${savedCompany.companyName} (ID: ${savedCompany._id})`);

    // Create admin user using CompanyAdmin model
    const newAdmin = new CompanyAdmin({
      name: adminName.trim(),
      email: adminEmail.toLowerCase().trim(),
      phone: adminContactNo.trim(),
      password: adminPassword, // Will be hashed by pre-save middleware
      role: "Admin",
      company: savedCompany._id,
      companyName: savedCompany.companyName,
      permissions: features.map(f => f.path),
      featureAccess: features.map(feature => ({
        featureName: feature.featureName,
        featurePath: feature.path,
        accessLevel: 'admin'
      })),
      status: "Active",
      isFirstLogin: true,
      profile: {
        department: "Administration",
        designation: "Company Admin"
      }
    });

    const savedAdmin = await newAdmin.save();
    adminCreated = true;
    createdAdmin = savedAdmin;

    console.log(`Admin created successfully: ${savedAdmin.name} (${savedAdmin.email})`);

    // Update company with admin reference
    savedCompany.admin = savedAdmin._id;
    await savedCompany.save();

    // Initialize tenant database with selected features
    try {
      console.log(`Starting database initialization for company: ${savedCompany.companyName}`);
      
      const dbInitResult = await DatabaseInitializer.initializeTenantDatabase(
        savedCompany._id.toString(),
        features
      );

      databaseInitialized = true;
      
      console.log(`Database initialized successfully for company: ${savedCompany.companyName}`, {
        companyId: savedCompany._id,
        collectionsCreated: dbInitResult.createdCollections?.length || 0,
        featuresCount: features.length
      });

      // Update company with database initialization status
      savedCompany.databaseStatus = 'Initialized';
      savedCompany.databaseInitializedAt = new Date();
      await savedCompany.save();

    } catch (dbError) {
      console.error(`Failed to initialize database for company ${savedCompany.companyName}:`, dbError);
      
      // Mark database initialization as failed but continue
      savedCompany.databaseStatus = 'Failed';
      savedCompany.databaseError = dbError.message;
      await savedCompany.save();

      console.warn(`Database initialization failed for company ${savedCompany.companyName}, but company was created successfully`);
    }

    transactionCompleted = true;

    // Prepare enhanced response data matching frontend requirements
    const responseData = {
      success: true,
      message: databaseInitialized 
        ? `Company '${companyName}' and Admin '${adminName}' created successfully with ${pricingPlan} plan. Tenant database initialized with ${features.length} features.`
        : `Company '${companyName}' and Admin '${adminName}' created successfully with ${pricingPlan} plan. Database initialization pending.`,
      company: {
        _id: savedCompany._id,
        companyName: savedCompany.companyName,
        companyAddress: savedCompany.companyAddress,
        companyContactNo: savedCompany.companyContactNo,
        companyGST: savedCompany.companyGST,
        noOfUsers: savedCompany.noOfUsers,
        companyLogo: savedCompany.companyLogo,
        pricingPlan: savedCompany.pricingPlan,
        features: savedCompany.features,
        status: savedCompany.status,
        databaseName: savedCompany.databaseName,
        databaseStatus: savedCompany.databaseStatus,
        adminName: savedCompany.adminName,
        adminContactNo: savedCompany.adminContactNo,
        adminEmail: savedCompany.adminEmail,
        createdAt: savedCompany.createdAt,
        subscriptionStartDate: savedCompany.subscriptionStartDate
      },
      admin: {
        _id: savedAdmin._id,
        name: savedAdmin.name,
        email: savedAdmin.email,
        phone: savedAdmin.phone,
        role: savedAdmin.role,
        status: savedAdmin.status,
        permissions: savedAdmin.permissions,
        featureAccess: savedAdmin.featureAccess,
        isFirstLogin: savedAdmin.isFirstLogin
      },
      database: {
        initialized: databaseInitialized,
        status: savedCompany.databaseStatus,
        featuresCount: features.length,
        collections: databaseInitialized ? features.map(f => f.path) : [],
        initializedAt: savedCompany.databaseInitializedAt
      }
    };

    res.status(201).json(responseData);

    // Log successful creation
    console.log(`Company creation completed successfully:`, {
      companyId: savedCompany._id,
      companyName: savedCompany.companyName,
      adminEmail: savedAdmin.email,
      databaseInitialized: databaseInitialized,
      featuresCount: features.length,
      pricingPlan: pricingPlan
    });

  } catch (error) {
    console.error("Error in adding company:", error);

    // Enhanced cleanup in case of failure (rollback)
    try {
      if (adminCreated && createdAdmin) {
        await CompanyAdmin.findByIdAndDelete(createdAdmin._id);
        console.log(`Rollback: Deleted admin ${createdAdmin.email}`);
      }

      if (companyCreated && createdCompany) {
        await Company.findByIdAndDelete(createdCompany._id);
        console.log(`Rollback: Deleted company ${createdCompany.companyName}`);
      }

      // If database was initialized but transaction failed, cleanup database
      if (databaseInitialized && createdCompany) {
        try {
          await DatabaseInitializer.cleanupTenantDatabase(createdCompany._id.toString());
          console.log(`Rollback: Cleaned up tenant database for company ${createdCompany._id}`);
        } catch (cleanupError) {
          console.error(`Error cleaning up tenant database during rollback:`, cleanupError);
        }
      }

    } catch (rollbackError) {
      console.error("Error during rollback cleanup:", rollbackError);
    }

    // Enhanced error handling
    let statusCode = 500;
    let errorMessage = "Internal server error";
    let errorDetails = {};

    if (error.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = "Validation failed";
      errorDetails = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {});
    } else if (error.code === 11000) {
      statusCode = 409;
      errorMessage = "Duplicate entry found";
      const field = Object.keys(error.keyValue)[0];
      errorDetails = {
        field: field,
        value: error.keyValue[field],
        message: `${field} already exists`
      };
    } else if (error.name === 'MongoError') {
      statusCode = 503;
      errorMessage = "Database connection error";
      errorDetails = { message: "Unable to connect to database" };
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error.message,
      details: errorDetails,
      rollback: {
        companyDeleted: companyCreated,
        adminDeleted: adminCreated,
        databaseCleaned: databaseInitialized
      },
      timestamp: new Date().toISOString()
    });
  }
};



// Get all companies with their admins and enhanced details
const getCompanies = async (req, res) => {
  try {
    // Get query parameters for filtering and pagination
    const { 
      page = 1, 
      limit = 10, 
      search = '',
      status = '',
      pricingPlan = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Status filter
    if (status && ['Active', 'InActive', 'Suspended'].includes(status)) {
      filter.status = status;
    } else {
      filter.status = { $in: ['Active', 'InActive'] }; // Default to show active and inactive
    }

    // Pricing plan filter
    if (pricingPlan && ['silver', 'golden', 'diamond'].includes(pricingPlan)) {
      filter.pricingPlan = pricingPlan;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { adminName: { $regex: search, $options: 'i' } },
        { adminEmail: { $regex: search, $options: 'i' } },
        { companyGST: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get companies with pagination and filtering
    const companies = await Company.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const totalCompanies = await Company.countDocuments(filter);
    const totalPages = Math.ceil(totalCompanies / limitNum);

    // Get admin details for each company using CompanyAdmin model
    const companiesWithAdmins = await Promise.all(
      companies.map(async (company) => {
        const admin = await CompanyAdmin.findOne({
          company: company._id,
          role: 'Admin'
        }).select('name email phone role status lastLogin isFirstLogin');

        // Calculate feature counts
        const totalFeatures = company.features?.length || 0;
        const activeFeatures = company.features?.filter(f => f.isActive).length || 0;

        return {
          // Company Basic Info
          _id: company._id,
          companyName: company.companyName,
          companyAddress: company.companyAddress,
          companyContactNo: company.companyContactNo,
          companyGST: company.companyGST,
          companyLogo: company.companyLogo,
          
          // Admin Info (from company schema for quick access)
          adminName: company.adminName,
          adminContactNo: company.adminContactNo,
          adminEmail: company.adminEmail,
          
          // Plan & Features
          noOfUsers: company.noOfUsers,
          currentUserCount: company.currentUserCount || 1,
          pricingPlan: company.pricingPlan,
          customPricing: company.customPricing,
          features: company.features || [],
          totalFeatures: totalFeatures,
          activeFeatures: activeFeatures,
          
          // Database Info
          databaseName: company.databaseName,
          databaseStatus: company.databaseStatus,
          databaseInitializedAt: company.databaseInitializedAt,
          
          // Status & Metadata
          status: company.status,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt,
          subscriptionStartDate: company.subscriptionStartDate,
          subscriptionEndDate: company.subscriptionEndDate,
          
          // Enhanced Admin Details (from CompanyAdmin collection)
          admin: admin ? {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            role: admin.role,
            status: admin.status,
            lastLogin: admin.lastLogin,
            isFirstLogin: admin.isFirstLogin
          } : null,

          // Frontend compatibility fields
          adminName: admin ? admin.name : company.adminName,
          adminContactNo: admin ? admin.phone : company.adminContactNo,
          adminEmail: admin ? admin.email : company.adminEmail
        };
      })
    );

    // Prepare statistics for dashboard
    const statistics = {
      totalCompanies: totalCompanies,
      activeCompanies: await Company.countDocuments({ status: 'Active' }),
      inactiveCompanies: await Company.countDocuments({ status: 'InActive' }),
      suspendedCompanies: await Company.countDocuments({ status: 'Suspended' }),
      planDistribution: {
        silver: await Company.countDocuments({ pricingPlan: 'silver' }),
        golden: await Company.countDocuments({ pricingPlan: 'golden' }),
        diamond: await Company.countDocuments({ pricingPlan: 'diamond' })
      },
      databaseStatus: {
        initialized: await Company.countDocuments({ databaseStatus: 'Initialized' }),
        pending: await Company.countDocuments({ databaseStatus: 'Pending' }),
        failed: await Company.countDocuments({ databaseStatus: 'Failed' })
      }
    };

    res.status(200).json({
      success: true,
      message: "Companies fetched successfully",
      data: {
        companies: companiesWithAdmins,
        pagination: {
          currentPage: pageNum,
          totalPages: totalPages,
          totalCompanies: totalCompanies,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
          limit: limitNum
        },
        statistics: statistics,
        filters: {
          search: search,
          status: status,
          pricingPlan: pricingPlan,
          sortBy: sortBy,
          sortOrder: sortOrder
        }
      }
    });

  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching companies',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Get single company with full details
// const getCompanyById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const company = await Company.findById(id).lean();
//     if (!company) {
//       return res.status(404).json({
//         success: false,
//         message: "Company not found"
//       });
//     }

//     // Get admin details from CompanyAdmin
//     const admin = await CompanyAdmin.findOne({
//       company: id,
//       role: 'Admin'
//     }).select('name email phone role status permissions featureAccess lastLogin isFirstLogin profile');

//     // Get database status and statistics
//     let databaseStats = null;
//     try {
//       databaseStats = await DatabaseInitializer.getDatabaseStatus(id);
//     } catch (dbError) {
//       console.warn(`Could not fetch database stats for company ${id}:`, dbError.message);
//     }

//     const companyWithDetails = {
//       ...company,
//       admin: admin,
//       database: databaseStats,
//       featureSummary: {
//         total: company.features?.length || 0,
//         active: company.features?.filter(f => f.isActive).length || 0,
//         byCategory: company.features?.reduce((acc, feature) => {
//           acc[feature.featuresCategories] = (acc[feature.featuresCategories] || 0) + 1;
//           return acc;
//         }, {}) || {}
//       }
//     };

//     res.status(200).json({
//       success: true,
//       message: "Company details fetched successfully",
//       data: companyWithDetails
//     });

//   } catch (error) {
//     console.error('Error fetching company details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error occurred while fetching company details',
//       error: error.message
//     });
//   }
// };








// // Get single company with full details
// const getCompanyById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const company = await Company.findById(id).lean();
//     if (!company) {
//       return res.status(404).json({
//         success: false,
//         message: "Company not found"
//       });
//     }

//     // Get admin details
//     const admin = await Admin.findOne({
//       company: id,
//       role: 'Admin'
//     }).select('name email phone role status permissions featureAccess lastLogin isFirstLogin profile');

//     // Get database status and statistics
//     let databaseStats = null;
//     try {
//       databaseStats = await DatabaseInitializer.getDatabaseStatus(id);
//     } catch (dbError) {
//       console.warn(`Could not fetch database stats for company ${id}:`, dbError.message);
//     }

//     const companyWithDetails = {
//       ...company,
//       admin: admin,
//       database: databaseStats,
//       featureSummary: {
//         total: company.features?.length || 0,
//         active: company.features?.filter(f => f.isActive).length || 0,
//         byCategory: company.features?.reduce((acc, feature) => {
//           acc[feature.featuresCategories] = (acc[feature.featuresCategories] || 0) + 1;
//           return acc;
//         }, {}) || {}
//       }
//     };

//     res.status(200).json({
//       success: true,
//       message: "Company details fetched successfully",
//       data: companyWithDetails
//     });

//   } catch (error) {
//     console.error('Error fetching company details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error occurred while fetching company details',
//       error: error.message
//     });
//   }
// };


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







module.exports={addCompany, getCompanies, updateCompany, updateCompanyStatus};
