// // services/databaseInitializer.js

// const mongoose = require('mongoose');
// const { connectTenantDB } = require('../utils/dbConnection');

// class DatabaseInitializer {
//     // Collection schemas mapping based on features
//     static getCollectionSchemas() {
//         return {
//             // Finance related collections
//             'expense-entry': new mongoose.Schema({
//                 amount: Number,
//                 description: String,
//                 category: String,
//                 date: Date,
//                 createdBy: String,
//                 status: { type: String, default: 'pending' }
//             }, { timestamps: true }),

//             'fund-management': new mongoose.Schema({
//                 fundAmount: Number,
//                 source: String,
//                 purpose: String,
//                 transactionDate: Date,
//                 status: String
//             }, { timestamps: true }),

//             'expense-approval': new mongoose.Schema({
//                 expenseId: String,
//                 approver: String,
//                 status: String,
//                 comments: String,
//                 approvedAt: Date
//             }, { timestamps: true }),

//             // Site related collections
//             'site-progress': new mongoose.Schema({
//                 siteName: String,
//                 progressPercentage: Number,
//                 tasksCompleted: Number,
//                 totalTasks: Number,
//                 updateDate: Date,
//                 supervisor: String
//             }, { timestamps: true }),

//             'site-management': new mongoose.Schema({
//                 siteName: String,
//                 location: String,
//                 startDate: Date,
//                 endDate: Date,
//                 budget: Number,
//                 status: String,
//                 manager: String
//             }, { timestamps: true }),

//             'site-update': new mongoose.Schema({
//                 siteId: String,
//                 updateType: String,
//                 description: String,
//                 images: [String],
//                 createdBy: String
//             }, { timestamps: true }),

//             // Resource management collections
//             'material-management': new mongoose.Schema({
//                 materialName: String,
//                 category: String,
//                 quantity: Number,
//                 unit: String,
//                 price: Number,
//                 supplier: String,
//                 status: String
//             }, { timestamps: true }),

//             'vendor-management': new mongoose.Schema({
//                 vendorName: String,
//                 contactPerson: String,
//                 email: String,
//                 phone: String,
//                 services: [String],
//                 rating: Number
//             }, { timestamps: true }),

//             'partner-management': new mongoose.Schema({
//                 partnerName: String,
//                 partnershipType: String,
//                 contactDetails: Object,
//                 agreementDetails: Object,
//                 status: String
//             }, { timestamps: true }),

//             'user-management': new mongoose.Schema({
//                 username: String,
//                 email: String,
//                 role: String,
//                 permissions: [String],
//                 status: String
//             }, { timestamps: true }),

//             'work-force-entry': new mongoose.Schema({
//                 workerName: String,
//                 role: String,
//                 contact: String,
//                 site: String,
//                 shift: String,
//                 status: String
//             }, { timestamps: true }),

//             // Other collections
//             'task-manager': new mongoose.Schema({
//                 title: String,
//                 description: String,
//                 assignedTo: String,
//                 priority: String,
//                 dueDate: Date,
//                 status: String
//             }, { timestamps: true }),

//             'survey-form': new mongoose.Schema({
//                 formName: String,
//                 questions: [Object],
//                 responses: [Object],
//                 createdBy: String
//             }, { timestamps: true }),

//             'helpdesk': new mongoose.Schema({
//                 ticketId: String,
//                 issueType: String,
//                 description: String,
//                 priority: String,
//                 status: String,
//                 assignedTo: String
//             }, { timestamps: true }),

//             'history': new mongoose.Schema({
//                 action: String,
//                 performedBy: String,
//                 target: String,
//                 details: Object,
//                 timestamp: Date
//             }, { timestamps: true }),

//             'payment': new mongoose.Schema({
//                 amount: Number,
//                 paymentMethod: String,
//                 status: String,
//                 transactionId: String,
//                 payer: String,
//                 payee: String
//             }, { timestamps: true }),

//             // Designer collections
//             'designer-approval-client': new mongoose.Schema({
//                 designName: String,
//                 designer: String,
//                 client: String,
//                 approvalStatus: String,
//                 feedback: String,
//                 revisions: Number
//             }, { timestamps: true }),

//             // Calculator collections
//             'construction-calculator': new mongoose.Schema({
//                 calculationType: String,
//                 inputs: Object,
//                 result: Object,
//                 createdBy: String
//             }, { timestamps: true }),

//             // Quotation collections
//             'view-manual-quotations': new mongoose.Schema({
//                 quotationNumber: String,
//                 client: String,
//                 amount: Number,
//                 status: String,
//                 validUntil: Date,
//                 items: [Object]
//             }, { timestamps: true }),

//             // Material request collections
//             'request-material': new mongoose.Schema({
//                 materialName: String,
//                 quantity: Number,
//                 urgency: String,
//                 requestedBy: String,
//                 status: String,
//                 site: String
//             }, { timestamps: true }),

//             'approve-request': new mongoose.Schema({
//                 requestId: String,
//                 approver: String,
//                 status: String,
//                 comments: String,
//                 approvedQuantity: Number
//             }, { timestamps: true }),

//             'purchase-order': new mongoose.Schema({
//                 poNumber: String,
//                 supplier: String,
//                 items: [Object],
//                 totalAmount: Number,
//                 status: String,
//                 deliveryDate: Date
//             }, { timestamps: true }),

//             'grn': new mongoose.Schema({
//                 grnNumber: String,
//                 poNumber: String,
//                 receivedItems: [Object],
//                 receivedBy: String,
//                 qualityCheck: String
//             }, { timestamps: true }),

//             // DMS collections
//             'document-management-system': new mongoose.Schema({
//                 documentName: String,
//                 documentType: String,
//                 category: String,
//                 fileUrl: String,
//                 uploadedBy: String,
//                 accessPermissions: [String]
//             }, { timestamps: true })
//         };
//     }

//     // Create collections based on selected features
//     static async initializeTenantDatabase(companyId, selectedFeatures) {
//         try {
//             const tenantConnection = await connectTenantDB(companyId);
//             const schemas = this.getCollectionSchemas();
            
//             // Create models for each selected feature
//             const createdCollections = [];
            
//             for (const feature of selectedFeatures) {
//                 const featurePath = feature.path;
//                 if (schemas[featurePath]) {
//                     // Create model for this feature
//                     const modelName = this.getModelName(featurePath);
//                     tenantConnection.model(modelName, schemas[featurePath]);
//                     createdCollections.push(featurePath);
//                     console.log(`Created collection for feature: ${featurePath} in company: ${companyId}`);
//                 }
//             }

//             // Create default collections that every tenant should have
//             const defaultCollections = ['users', 'sessions', 'settings'];
//             for (const collection of defaultCollections) {
//                 if (!tenantConnection.models[collection]) {
//                     tenantConnection.model(collection, new mongoose.Schema({}, { strict: false }));
//                 }
//             }

//             return {
//                 success: true,
//                 companyId,
//                 createdCollections,
//                 message: `Tenant database initialized with ${createdCollections.length} collections`
//             };
//         } catch (error) {
//             console.error(`Error initializing tenant database for company ${companyId}:`, error);
//             throw error;
//         }
//     }

//     static getModelName(featurePath) {
//         // Convert feature path to model name (e.g., 'expense-entry' -> 'ExpenseEntry')
//         return featurePath
//             .split('-')
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//             .join('');
//     }
// }

// module.exports = DatabaseInitializer;




// // services/databaseInitializer.js
// const mongoose = require('mongoose');
// const { connectTenantDB, getTenantConnection, tenantConnections } = require('../utils/dbConnection.js');

// class DatabaseInitializer {
//     // Collection schemas mapping based on features - Enhanced with validation
//     static getCollectionSchemas() {
//         return {
//             // Finance related collections
//             'expense-entry': new mongoose.Schema({
//                 amount: { type: Number, required: true, min: 0 },
//                 description: { type: String, required: true, trim: true },
//                 category: { type: String, required: true, enum: ['Material', 'Labor', 'Equipment', 'Transport', 'Other'] },
//                 date: { type: Date, required: true, default: Date.now },
//                 createdBy: { type: String, required: true },
//                 status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
//                 companyId: { type: String, required: true },
//                 siteId: String
//             }, { timestamps: true }),

//             'fund-management': new mongoose.Schema({
//                 fundAmount: { type: Number, required: true, min: 0 },
//                 source: { type: String, required: true, enum: ['Client', 'Investment', 'Loan', 'Other'] },
//                 purpose: { type: String, required: true },
//                 transactionDate: { type: Date, required: true, default: Date.now },
//                 status: { type: String, required: true, enum: ['received', 'pending', 'utilized'] },
//                 companyId: { type: String, required: true },
//                 referenceNumber: String
//             }, { timestamps: true }),

//             'expense-approval': new mongoose.Schema({
//                 expenseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ExpenseEntry' },
//                 approver: { type: String, required: true },
//                 status: { type: String, required: true, enum: ['approved', 'rejected', 'pending'] },
//                 comments: String,
//                 approvedAt: Date,
//                 companyId: { type: String, required: true }
//             }, { timestamps: true }),

//             // Site related collections
//             'site-progress': new mongoose.Schema({
//                 siteName: { type: String, required: true },
//                 progressPercentage: { type: Number, required: true, min: 0, max: 100 },
//                 tasksCompleted: { type: Number, required: true, min: 0 },
//                 totalTasks: { type: Number, required: true, min: 1 },
//                 updateDate: { type: Date, required: true, default: Date.now },
//                 supervisor: { type: String, required: true },
//                 companyId: { type: String, required: true },
//                 images: [String],
//                 notes: String
//             }, { timestamps: true }),

//             'site-management': new mongoose.Schema({
//                 siteName: { type: String, required: true, unique: true },
//                 location: { type: String, required: true },
//                 startDate: { type: Date, required: true },
//                 endDate: { type: Date, required: true },
//                 budget: { type: Number, required: true, min: 0 },
//                 status: { type: String, required: true, enum: ['planning', 'active', 'completed', 'on-hold'] },
//                 manager: { type: String, required: true },
//                 companyId: { type: String, required: true },
//                 clientName: String,
//                 contactPerson: String
//             }, { timestamps: true }),

//             'site-update': new mongoose.Schema({
//                 siteId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'SiteManagement' },
//                 updateType: { type: String, required: true, enum: ['progress', 'issue', 'milestone', 'general'] },
//                 description: { type: String, required: true },
//                 images: [String],
//                 createdBy: { type: String, required: true },
//                 companyId: { type: String, required: true },
//                 priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
//             }, { timestamps: true }),

//             // Resource management collections
//             'material-management': new mongoose.Schema({
//                 materialName: { type: String, required: true },
//                 category: { type: String, required: true },
//                 quantity: { type: Number, required: true, min: 0 },
//                 unit: { type: String, required: true },
//                 price: { type: Number, required: true, min: 0 },
//                 supplier: String,
//                 status: { type: String, enum: ['available', 'low-stock', 'out-of-stock'], default: 'available' },
//                 companyId: { type: String, required: true },
//                 minStockLevel: Number,
//                 maxStockLevel: Number
//             }, { timestamps: true }),

//             'vendor-management': new mongoose.Schema({
//                 vendorName: { type: String, required: true, unique: true },
//                 contactPerson: { type: String, required: true },
//                 email: { type: String, required: true },
//                 phone: { type: String, required: true },
//                 services: [String],
//                 rating: { type: Number, min: 1, max: 5 },
//                 companyId: { type: String, required: true },
//                 address: String,
//                 taxId: String,
//                 status: { type: String, enum: ['active', 'inactive'], default: 'active' }
//             }, { timestamps: true }),

//             'partner-management': new mongoose.Schema({
//                 partnerName: { type: String, required: true, unique: true },
//                 partnershipType: { type: String, required: true, enum: ['supplier', 'contractor', 'consultant', 'other'] },
//                 contactDetails: {
//                     email: String,
//                     phone: String,
//                     address: String
//                 },
//                 agreementDetails: {
//                     startDate: Date,
//                     endDate: Date,
//                     terms: String
//                 },
//                 status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
//                 companyId: { type: String, required: true }
//             }, { timestamps: true }),

//             'user-management': new mongoose.Schema({
//                 username: { type: String, required: true, unique: true },
//                 email: { type: String, required: true, unique: true },
//                 role: { type: String, required: true, enum: ['admin', 'supervisor', 'client', 'project-manager', 'sales-manager', 'designer'] },
//                 permissions: [String],
//                 status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
//                 companyId: { type: String, required: true },
//                 lastLogin: Date,
//                 profile: {
//                     firstName: String,
//                     lastName: String,
//                     phone: String,
//                     department: String
//                 }
//             }, { timestamps: true }),

//             'work-force-entry': new mongoose.Schema({
//                 workerName: { type: String, required: true },
//                 role: { type: String, required: true },
//                 contact: String,
//                 site: String,
//                 shift: { type: String, enum: ['morning', 'evening', 'night'], default: 'morning' },
//                 status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
//                 companyId: { type: String, required: true },
//                 dailyWage: Number,
//                 skills: [String]
//             }, { timestamps: true }),

//             // Other collections
//             'task-manager': new mongoose.Schema({
//                 title: { type: String, required: true },
//                 description: String,
//                 assignedTo: { type: String, required: true },
//                 priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
//                 dueDate: { type: Date, required: true },
//                 status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
//                 companyId: { type: String, required: true },
//                 projectId: String,
//                 estimatedHours: Number,
//                 actualHours: Number
//             }, { timestamps: true }),

//             'survey-form': new mongoose.Schema({
//                 formName: { type: String, required: true },
//                 questions: [{
//                     question: String,
//                     type: { type: String, enum: ['text', 'multiple-choice', 'rating', 'yes-no'] },
//                     options: [String],
//                     required: Boolean
//                 }],
//                 responses: [{
//                     respondent: String,
//                     answers: Object,
//                     submittedAt: { type: Date, default: Date.now }
//                 }],
//                 createdBy: { type: String, required: true },
//                 companyId: { type: String, required: true },
//                 status: { type: String, enum: ['active', 'inactive'], default: 'active' }
//             }, { timestamps: true }),

//             'helpdesk': new mongoose.Schema({
//                 ticketId: { type: String, required: true, unique: true },
//                 issueType: { type: String, required: true, enum: ['technical', 'billing', 'general', 'feature-request'] },
//                 description: { type: String, required: true },
//                 priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
//                 status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
//                 assignedTo: String,
//                 companyId: { type: String, required: true },
//                 createdBy: String,
//                 resolution: String,
//                 closedAt: Date
//             }, { timestamps: true }),

//             'history': new mongoose.Schema({
//                 action: { type: String, required: true },
//                 performedBy: { type: String, required: true },
//                 target: { type: String, required: true },
//                 details: Object,
//                 timestamp: { type: Date, default: Date.now },
//                 companyId: { type: String, required: true },
//                 ipAddress: String,
//                 userAgent: String
//             }, { timestamps: true }),

//             'payment': new mongoose.Schema({
//                 amount: { type: Number, required: true, min: 0 },
//                 paymentMethod: { type: String, required: true, enum: ['cash', 'bank-transfer', 'cheque', 'online'] },
//                 status: { type: String, required: true, enum: ['pending', 'completed', 'failed', 'cancelled'] },
//                 transactionId: String,
//                 payer: { type: String, required: true },
//                 payee: { type: String, required: true },
//                 companyId: { type: String, required: true },
//                 paymentDate: Date,
//                 referenceNumber: String
//             }, { timestamps: true }),

//             // Designer collections
//             'designer-approval-client': new mongoose.Schema({
//                 designName: { type: String, required: true },
//                 designer: { type: String, required: true },
//                 client: { type: String, required: true },
//                 approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'revisions-requested'], default: 'pending' },
//                 feedback: String,
//                 revisions: { type: Number, default: 0 },
//                 companyId: { type: String, required: true },
//                 designFiles: [String],
//                 clientComments: String
//             }, { timestamps: true }),

//             // Calculator collections
//             'construction-calculator': new mongoose.Schema({
//                 calculationType: { type: String, required: true, enum: ['material', 'labor', 'equipment', 'total-cost'] },
//                 inputs: Object,
//                 result: Object,
//                 createdBy: { type: String, required: true },
//                 companyId: { type: String, required: true },
//                 projectId: String,
//                 calculationDate: { type: Date, default: Date.now }
//             }, { timestamps: true }),

//             // Quotation collections
//             'view-manual-quotations': new mongoose.Schema({
//                 quotationNumber: { type: String, required: true, unique: true },
//                 client: { type: String, required: true },
//                 amount: { type: Number, required: true, min: 0 },
//                 status: { type: String, enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'], default: 'draft' },
//                 validUntil: { type: Date, required: true },
//                 items: [{
//                     description: String,
//                     quantity: Number,
//                     unitPrice: Number,
//                     total: Number
//                 }],
//                 companyId: { type: String, required: true },
//                 preparedBy: String,
//                 clientAddress: String,
//                 terms: String
//             }, { timestamps: true }),

//             // Material request collections
//             'request-material': new mongoose.Schema({
//                 materialName: { type: String, required: true },
//                 quantity: { type: Number, required: true, min: 1 },
//                 urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
//                 requestedBy: { type: String, required: true },
//                 status: { type: String, enum: ['pending', 'approved', 'rejected', 'fulfilled'], default: 'pending' },
//                 site: { type: String, required: true },
//                 companyId: { type: String, required: true },
//                 requiredDate: Date,
//                 purpose: String
//             }, { timestamps: true }),

//             'approve-request': new mongoose.Schema({
//                 requestId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'RequestMaterial' },
//                 approver: { type: String, required: true },
//                 status: { type: String, enum: ['approved', 'rejected', 'pending'], default: 'pending' },
//                 comments: String,
//                 approvedQuantity: Number,
//                 companyId: { type: String, required: true },
//                 approvedAt: Date
//             }, { timestamps: true }),

//             'purchase-order': new mongoose.Schema({
//                 poNumber: { type: String, required: true, unique: true },
//                 supplier: { type: String, required: true },
//                 items: [{
//                     materialName: String,
//                     quantity: Number,
//                     unitPrice: Number,
//                     total: Number
//                 }],
//                 totalAmount: { type: Number, required: true, min: 0 },
//                 status: { type: String, enum: ['draft', 'sent', 'confirmed', 'cancelled'], default: 'draft' },
//                 deliveryDate: Date,
//                 companyId: { type: String, required: true },
//                 preparedBy: String,
//                 terms: String
//             }, { timestamps: true }),

//             'grn': new mongoose.Schema({
//                 grnNumber: { type: String, required: true, unique: true },
//                 poNumber: { type: String, required: true },
//                 receivedItems: [{
//                     materialName: String,
//                     orderedQuantity: Number,
//                     receivedQuantity: Number,
//                     quality: { type: String, enum: ['good', 'damaged', 'partial'] }
//                 }],
//                 receivedBy: { type: String, required: true },
//                 qualityCheck: { type: String, enum: ['passed', 'failed', 'partial'], default: 'passed' },
//                 companyId: { type: String, required: true },
//                 receivedDate: { type: Date, default: Date.now }
//             }, { timestamps: true }),

//             // DMS collections
//             'document-management-system': new mongoose.Schema({
//                 documentName: { type: String, required: true },
//                 documentType: { type: String, required: true, enum: ['contract', 'invoice', 'design', 'permit', 'report', 'other'] },
//                 category: { type: String, required: true },
//                 fileUrl: { type: String, required: true },
//                 uploadedBy: { type: String, required: true },
//                 accessPermissions: [String],
//                 companyId: { type: String, required: true },
//                 fileSize: Number,
//                 mimeType: String,
//                 description: String
//             }, { timestamps: true })
//         };
//     }

//     // Validate features before database creation
//     static validateFeatures(selectedFeatures) {
//         if (!Array.isArray(selectedFeatures)) {
//             throw new Error('Selected features must be an array');
//         }

//         if (selectedFeatures.length === 0) {
//             throw new Error('At least one feature must be selected');
//         }

//         const validFeatures = this.getCollectionSchemas();
//         const invalidFeatures = [];
//         const validFeaturesList = [];

//         selectedFeatures.forEach(feature => {
//             if (!feature.path || !feature.featureName) {
//                 invalidFeatures.push('Invalid feature structure');
//                 return;
//             }

//             if (!validFeatures[feature.path]) {
//                 invalidFeatures.push(feature.featureName);
//             } else {
//                 validFeaturesList.push(feature.path);
//             }
//         });

//         if (invalidFeatures.length > 0) {
//             throw new Error(`Invalid features selected: ${invalidFeatures.join(', ')}`);
//         }

//         return validFeaturesList;
//     }

//     // Create collections based on selected features with enhanced error handling
//     static async initializeTenantDatabase(companyId, selectedFeatures) {
//         let tenantConnection = null;
        
//         try {
//             // Validate features first
//             const validFeatures = this.validateFeatures(selectedFeatures);
            
//             console.log(`Starting database initialization for company: ${companyId} with ${validFeatures.length} features`);

//             // Connect to tenant database
//             tenantConnection = await connectTenantDB(companyId);
//             const schemas = this.getCollectionSchemas();
            
//             const createdCollections = [];
//             const creationErrors = [];

//             // Create models for each selected feature
//             for (const featurePath of validFeatures) {
//                 try {
//                     const modelName = this.getModelName(featurePath);
                    
//                     // Check if model already exists
//                     if (!tenantConnection.models[modelName]) {
//                         tenantConnection.model(modelName, schemas[featurePath]);
//                         console.log(`✅ Created collection for feature: ${featurePath} in company: ${companyId}`);
//                     } else {
//                         console.log(`ℹ️  Collection already exists: ${featurePath} in company: ${companyId}`);
//                     }
                    
//                     createdCollections.push(featurePath);
//                 } catch (featureError) {
//                     creationErrors.push({
//                         feature: featurePath,
//                         error: featureError.message
//                     });
//                     console.error(`❌ Failed to create collection for feature ${featurePath}:`, featureError);
//                 }
//             }

//             // Create default collections that every tenant should have
//             const defaultCollections = [
//                 { name: 'users', schema: new mongoose.Schema({
//                     username: { type: String, required: true, unique: true },
//                     email: { type: String, required: true, unique: true },
//                     password: { type: String, required: true },
//                     role: { type: String, required: true },
//                     companyId: { type: String, required: true },
//                     status: { type: String, default: 'active' },
//                     lastLogin: Date,
//                     profile: Object
//                 }, { timestamps: true }) },
                
//                 { name: 'sessions', schema: new mongoose.Schema({
//                     userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
//                     token: { type: String, required: true },
//                     expiresAt: { type: Date, required: true },
//                     companyId: { type: String, required: true },
//                     ipAddress: String,
//                     userAgent: String
//                 }, { timestamps: true }) },
                
//                 { name: 'settings', schema: new mongoose.Schema({
//                     key: { type: String, required: true, unique: true },
//                     value: mongoose.Schema.Types.Mixed,
//                     companyId: { type: String, required: true },
//                     description: String,
//                     category: String
//                 }, { timestamps: true }) },
                
//                 { name: 'auditlogs', schema: new mongoose.Schema({
//                     action: { type: String, required: true },
//                     userId: { type: mongoose.Schema.Types.ObjectId, required: true },
//                     resource: String,
//                     details: Object,
//                     companyId: { type: String, required: true },
//                     ipAddress: String,
//                     timestamp: { type: Date, default: Date.now }
//                 }, { timestamps: true }) }
//             ];

//             for (const collection of defaultCollections) {
//                 try {
//                     if (!tenantConnection.models[collection.name]) {
//                         tenantConnection.model(collection.name, collection.schema);
//                         createdCollections.push(collection.name);
//                         console.log(`✅ Created default collection: ${collection.name} for company: ${companyId}`);
//                     }
//                 } catch (defaultError) {
//                     creationErrors.push({
//                         collection: collection.name,
//                         error: defaultError.message
//                     });
//                     console.error(`❌ Failed to create default collection ${collection.name}:`, defaultError);
//                 }
//             }

//             // Create indexes for better performance
//             try {
//                 await this.createIndexes(tenantConnection, createdCollections);
//                 console.log(`✅ Created indexes for company: ${companyId}`);
//             } catch (indexError) {
//                 console.warn(`⚠️  Index creation failed for company ${companyId}:`, indexError);
//                 creationErrors.push({
//                     operation: 'index-creation',
//                     error: indexError.message
//                 });
//             }

//             const result = {
//                 success: true,
//                 companyId,
//                 createdCollections,
//                 failedCollections: creationErrors,
//                 totalRequested: validFeatures.length + defaultCollections.length,
//                 totalCreated: createdCollections.length,
//                 message: creationErrors.length > 0 
//                     ? `Tenant database initialized with ${createdCollections.length} collections (${creationErrors.length} failures)`
//                     : `Tenant database successfully initialized with ${createdCollections.length} collections`
//             };

//             console.log(`🎉 Database initialization completed for company: ${companyId}`, result);
//             return result;

//         } catch (error) {
//             console.error(`💥 Error initializing tenant database for company ${companyId}:`, error);
            
//             // Cleanup connection if initialization failed
//             if (tenantConnection) {
//                 try {
//                     await tenantConnection.close();
//                     if (tenantConnections.has(companyId)) {
//                         tenantConnections.delete(companyId);
//                     }
//                 } catch (cleanupError) {
//                     console.error(`Error during connection cleanup:`, cleanupError);
//                 }
//             }
            
//             throw error;
//         }
//     }

//     // Create indexes for better query performance
//     static async createIndexes(connection, collections) {
//         const indexPromises = [];

//         // Common indexes for most collections
//         const commonIndexes = ['companyId', 'createdAt', 'status'];

//         for (const collectionName of collections) {
//             const model = connection.models[this.getModelName(collectionName)];
//             if (model) {
//                 // Create compound indexes based on collection type
//                 switch (collectionName) {
//                     case 'expense-entry':
//                         indexPromises.push(model.createIndexes([
//                             { companyId: 1, date: -1 },
//                             { companyId: 1, category: 1 },
//                             { companyId: 1, status: 1 }
//                         ]));
//                         break;
//                     case 'site-management':
//                         indexPromises.push(model.createIndexes([
//                             { companyId: 1, status: 1 },
//                             { companyId: 1, manager: 1 }
//                         ]));
//                         break;
//                     case 'user-management':
//                         indexPromises.push(model.createIndexes([
//                             { companyId: 1, email: 1 },
//                             { companyId: 1, role: 1 }
//                         ]));
//                         break;
//                     case 'task-manager':
//                         indexPromises.push(model.createIndexes([
//                             { companyId: 1, assignedTo: 1, status: 1 },
//                             { companyId: 1, dueDate: 1 }
//                         ]));
//                         break;
//                     default:
//                         // Create basic indexes for common fields
//                         commonIndexes.forEach(field => {
//                             if (model.schema.path(field)) {
//                                 indexPromises.push(model.createIndexes([{ [field]: 1 }]));
//                             }
//                         });
//                 }
//             }
//         }

//         await Promise.all(indexPromises);
//     }

//     // Cleanup tenant database in case of failure
//     static async cleanupTenantDatabase(companyId) {
//         try {
//             const tenantConnection = getTenantConnection(companyId);
//             if (tenantConnection) {
//                 await tenantConnection.dropDatabase();
//                 console.log(`🧹 Cleaned up tenant database for company: ${companyId}`);
//             }
            
//             // Remove from connections map
//             if (tenantConnections.has(companyId)) {
//                 tenantConnections.delete(companyId);
//             }
            
//             return {
//                 success: true,
//                 message: `Tenant database cleaned up for company: ${companyId}`
//             };
//         } catch (error) {
//             console.error(`❌ Error cleaning up tenant database for company ${companyId}:`, error);
//             throw error;
//         }
//     }

//     // Get database status and statistics
//     static async getDatabaseStatus(companyId) {
//         try {
//             const tenantConnection = getTenantConnection(companyId);
//             if (!tenantConnection) {
//                 return { success: false, message: 'No database connection found' };
//             }

//             const collections = await tenantConnection.db.listCollections().toArray();
//             const stats = {};

//             for (const collection of collections) {
//                 const modelName = this.getModelName(collection.name);
//                 const model = tenantConnection.models[modelName];
//                 if (model) {
//                     stats[collection.name] = await model.countDocuments();
//                 }
//             }

//             return {
//                 success: true,
//                 companyId,
//                 collections: collections.map(c => c.name),
//                 statistics: stats,
//                 totalCollections: collections.length
//             };
//         } catch (error) {
//             console.error(`Error getting database status for company ${companyId}:`, error);
//             throw error;
//         }
//     }

//     static getModelName(featurePath) {
//         // Convert feature path to model name (e.g., 'expense-entry' -> 'ExpenseEntry')
//         return featurePath
//             .split('-')
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//             .join('');
//     }

//     // Get available features for frontend
//     static getAvailableFeatures() {
//         const schemas = this.getCollectionSchemas();
//         return Object.keys(schemas).map(path => ({
//             path,
//             modelName: this.getModelName(path),
//             fields: Object.keys(schemas[path].paths)
//         }));
//     }
// }

// module.exports = DatabaseInitializer;




// // services/databaseInitializer.js - UPDATED VERSION
// const mongoose = require('mongoose');
// const { connectTenantDB, getTenantConnection, tenantConnections } = require('../utils/dbConnection.js');

// class DatabaseInitializer {
//     // Collection schemas mapping - ENHANCED with supervisor variants
//     static getCollectionSchemas() {
//         return {
//             // Finance related collections
//             'expense-entry': new mongoose.Schema({
//                 amount: { type: Number, required: true, min: 0 },
//                 description: { type: String, required: true, trim: true },
//                 category: { type: String, required: true, enum: ['Material', 'Labor', 'Equipment', 'Transport', 'Other'] },
//                 date: { type: Date, required: true, default: Date.now },
//                 createdBy: { type: String, required: true },
//                 status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
//                 companyId: { type: String, required: true },
//                 siteId: String
//             }, { timestamps: true }),

//             'fund-management': new mongoose.Schema({
//                 fundAmount: { type: Number, required: true, min: 0 },
//                 source: { type: String, required: true, enum: ['Client', 'Investment', 'Loan', 'Other'] },
//                 purpose: { type: String, required: true },
//                 transactionDate: { type: Date, required: true, default: Date.now },
//                 status: { type: String, required: true, enum: ['received', 'pending', 'utilized'] },
//                 companyId: { type: String, required: true },
//                 referenceNumber: String
//             }, { timestamps: true }),

//             'expense-approval': new mongoose.Schema({
//                 expenseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ExpenseEntry' },
//                 approver: { type: String, required: true },
//                 status: { type: String, required: true, enum: ['approved', 'rejected', 'pending'] },
//                 comments: String,
//                 approvedAt: Date,
//                 companyId: { type: String, required: true }
//             }, { timestamps: true }),

//             // Site related collections
//             'site-progress': new mongoose.Schema({
//                 siteName: { type: String, required: true },
//                 progressPercentage: { type: Number, required: true, min: 0, max: 100 },
//                 tasksCompleted: { type: Number, required: true, min: 0 },
//                 totalTasks: { type: Number, required: true, min: 1 },
//                 updateDate: { type: Date, required: true, default: Date.now },
//                 supervisor: { type: String, required: true },
//                 companyId: { type: String, required: true },
//                 images: [String],
//                 notes: String
//             }, { timestamps: true }),

//             'site-management': new mongoose.Schema({
//                 siteName: { type: String, required: true, unique: true },
//                 location: { type: String, required: true },
//                 startDate: { type: Date, required: true },
//                 endDate: { type: Date, required: true },
//                 budget: { type: Number, required: true, min: 0 },
//                 status: { type: String, required: true, enum: ['planning', 'active', 'completed', 'on-hold'] },
//                 manager: { type: String, required: true },
//                 companyId: { type: String, required: true },
//                 clientName: String,
//                 contactPerson: String
//             }, { timestamps: true }),

//             'site-update': new mongoose.Schema({
//                 siteId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'SiteManagement' },
//                 updateType: { type: String, required: true, enum: ['progress', 'issue', 'milestone', 'general'] },
//                 description: { type: String, required: true },
//                 images: [String],
//                 createdBy: { type: String, required: true },
//                 companyId: { type: String, required: true },
//                 priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
//             }, { timestamps: true }),

//             // Resource management collections - REGULAR VERSIONS
//             'material-management': new mongoose.Schema({
//                 materialName: { type: String, required: true },
//                 category: { type: String, required: true },
//                 quantity: { type: Number, required: true, min: 0 },
//                 unit: { type: String, required: true },
//                 price: { type: Number, required: true, min: 0 },
//                 supplier: String,
//                 status: { type: String, enum: ['available', 'low-stock', 'out-of-stock'], default: 'available' },
//                 companyId: { type: String, required: true },
//                 minStockLevel: Number,
//                 maxStockLevel: Number
//             }, { timestamps: true }),

//             'vendor-management': new mongoose.Schema({
//                 vendorName: { type: String, required: true, unique: true },
//                 contactPerson: { type: String, required: true },
//                 email: { type: String, required: true },
//                 phone: { type: String, required: true },
//                 services: [String],
//                 rating: { type: Number, min: 1, max: 5 },
//                 companyId: { type: String, required: true },
//                 address: String,
//                 taxId: String,
//                 status: { type: String, enum: ['active', 'inactive'], default: 'active' }
//             }, { timestamps: true }),

//             'partner-management': new mongoose.Schema({
//                 partnerName: { type: String, required: true, unique: true },
//                 partnershipType: { type: String, required: true, enum: ['supplier', 'contractor', 'consultant', 'other'] },
//                 contactDetails: {
//                     email: String,
//                     phone: String,
//                     address: String
//                 },
//                 agreementDetails: {
//                     startDate: Date,
//                     endDate: Date,
//                     terms: String
//                 },
//                 status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
//                 companyId: { type: String, required: true }
//             }, { timestamps: true }),

//             'work-force-entry': new mongoose.Schema({
//                 workerName: { type: String, required: true },
//                 role: { type: String, required: true },
//                 contact: String,
//                 site: String,
//                 shift: { type: String, enum: ['morning', 'evening', 'night'], default: 'morning' },
//                 status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
//                 companyId: { type: String, required: true },
//                 dailyWage: Number,
//                 skills: [String]
//             }, { timestamps: true }),

//             // Resource management collections - SUPERVISOR VERSIONS (use same schema as regular)
//             'material-management-supervisor': new mongoose.Schema({
//                 materialName: { type: String, required: true },
//                 category: { type: String, required: true },
//                 quantity: { type: Number, required: true, min: 0 },
//                 unit: { type: String, required: true },
//                 price: { type: Number, required: true, min: 0 },
//                 supplier: String,
//                 status: { type: String, enum: ['available', 'low-stock', 'out-of-stock'], default: 'available' },
//                 companyId: { type: String, required: true },
//                 minStockLevel: Number,
//                 maxStockLevel: Number
//             }, { timestamps: true }),

//             'vendor-management-supervisor': new mongoose.Schema({
//                 vendorName: { type: String, required: true, unique: true },
//                 contactPerson: { type: String, required: true },
//                 email: { type: String, required: true },
//                 phone: { type: String, required: true },
//                 services: [String],
//                 rating: { type: Number, min: 1, max: 5 },
//                 companyId: { type: String, required: true },
//                 address: String,
//                 taxId: String,
//                 status: { type: String, enum: ['active', 'inactive'], default: 'active' }
//             }, { timestamps: true }),

//             'partner-management-supervisor': new mongoose.Schema({
//                 partnerName: { type: String, required: true, unique: true },
//                 partnershipType: { type: String, required: true, enum: ['supplier', 'contractor', 'consultant', 'other'] },
//                 contactDetails: {
//                     email: String,
//                     phone: String,
//                     address: String
//                 },
//                 agreementDetails: {
//                     startDate: Date,
//                     endDate: Date,
//                     terms: String
//                 },
//                 status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
//                 companyId: { type: String, required: true }
//             }, { timestamps: true }),

//             'work-force-entry-supervisor': new mongoose.Schema({
//                 workerName: { type: String, required: true },
//                 role: { type: String, required: true },
//                 contact: String,
//                 site: String,
//                 shift: { type: String, enum: ['morning', 'evening', 'night'], default: 'morning' },
//                 status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
//                 companyId: { type: String, required: true },
//                 dailyWage: Number,
//                 skills: [String]
//             }, { timestamps: true }),

//             'partner-details': new mongoose.Schema({
//                 partnerName: { type: String, required: true, unique: true },
//                 partnershipType: { type: String, required: true, enum: ['supplier', 'contractor', 'consultant', 'other'] },
//                 contactDetails: {
//                     email: String,
//                     phone: String,
//                     address: String
//                 },
//                 agreementDetails: {
//                     startDate: Date,
//                     endDate: Date,
//                     terms: String
//                 },
//                 status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
//                 companyId: { type: String, required: true }
//             }, { timestamps: true }),

//             'user-management': new mongoose.Schema({
//                 username: { type: String, required: true, unique: true },
//                 email: { type: String, required: true, unique: true },
//                 role: { type: String, required: true, enum: ['admin', 'supervisor', 'client', 'project-manager', 'sales-manager', 'designer'] },
//                 permissions: [String],
//                 status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
//                 companyId: { type: String, required: true },
//                 lastLogin: Date,
//                 profile: {
//                     firstName: String,
//                     lastName: String,
//                     phone: String,
//                     department: String
//                 }
//             }, { timestamps: true }),

//             // Other collections
//             'task-manager': new mongoose.Schema({
//                 title: { type: String, required: true },
//                 description: String,
//                 assignedTo: { type: String, required: true },
//                 priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
//                 dueDate: { type: Date, required: true },
//                 status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
//                 companyId: { type: String, required: true },
//                 projectId: String,
//                 estimatedHours: Number,
//                 actualHours: Number
//             }, { timestamps: true }),

//             'survey-form': new mongoose.Schema({
//                 formName: { type: String, required: true },
//                 questions: [{
//                     question: String,
//                     type: { type: String, enum: ['text', 'multiple-choice', 'rating', 'yes-no'] },
//                     options: [String],
//                     required: Boolean
//                 }],
//                 responses: [{
//                     respondent: String,
//                     answers: Object,
//                     submittedAt: { type: Date, default: Date.now }
//                 }],
//                 createdBy: { type: String, required: true },
//                 companyId: { type: String, required: true },
//                 status: { type: String, enum: ['active', 'inactive'], default: 'active' }
//             }, { timestamps: true }),

//             'helpdesk': new mongoose.Schema({
//                 ticketId: { type: String, required: true, unique: true },
//                 issueType: { type: String, required: true, enum: ['technical', 'billing', 'general', 'feature-request'] },
//                 description: { type: String, required: true },
//                 priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
//                 status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
//                 assignedTo: String,
//                 companyId: { type: String, required: true },
//                 createdBy: String,
//                 resolution: String,
//                 closedAt: Date
//             }, { timestamps: true }),

//             'history': new mongoose.Schema({
//                 action: { type: String, required: true },
//                 performedBy: { type: String, required: true },
//                 target: { type: String, required: true },
//                 details: Object,
//                 timestamp: { type: Date, default: Date.now },
//                 companyId: { type: String, required: true },
//                 ipAddress: String,
//                 userAgent: String
//             }, { timestamps: true }),

//             'payment': new mongoose.Schema({
//                 amount: { type: Number, required: true, min: 0 },
//                 paymentMethod: { type: String, required: true, enum: ['cash', 'bank-transfer', 'cheque', 'online'] },
//                 status: { type: String, required: true, enum: ['pending', 'completed', 'failed', 'cancelled'] },
//                 transactionId: String,
//                 payer: { type: String, required: true },
//                 payee: { type: String, required: true },
//                 companyId: { type: String, required: true },
//                 paymentDate: Date,
//                 referenceNumber: String
//             }, { timestamps: true }),

//             // Designer collections
//             'designer-approval-client': new mongoose.Schema({
//                 designName: { type: String, required: true },
//                 designer: { type: String, required: true },
//                 client: { type: String, required: true },
//                 approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'revisions-requested'], default: 'pending' },
//                 feedback: String,
//                 revisions: { type: Number, default: 0 },
//                 companyId: { type: String, required: true },
//                 designFiles: [String],
//                 clientComments: String
//             }, { timestamps: true }),

//             // Calculator collections
//             'construction-calculator': new mongoose.Schema({
//                 calculationType: { type: String, required: true, enum: ['material', 'labor', 'equipment', 'total-cost'] },
//                 inputs: Object,
//                 result: Object,
//                 createdBy: { type: String, required: true },
//                 companyId: { type: String, required: true },
//                 projectId: String,
//                 calculationDate: { type: Date, default: Date.now }
//             }, { timestamps: true }),

//             // Quotation collections
//             'view-manual-quotations': new mongoose.Schema({
//                 quotationNumber: { type: String, required: true, unique: true },
//                 client: { type: String, required: true },
//                 amount: { type: Number, required: true, min: 0 },
//                 status: { type: String, enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'], default: 'draft' },
//                 validUntil: { type: Date, required: true },
//                 items: [{
//                     description: String,
//                     quantity: Number,
//                     unitPrice: Number,
//                     total: Number
//                 }],
//                 companyId: { type: String, required: true },
//                 preparedBy: String,
//                 clientAddress: String,
//                 terms: String
//             }, { timestamps: true }),

//             // Material request collections
//             'request-material': new mongoose.Schema({
//                 materialName: { type: String, required: true },
//                 quantity: { type: Number, required: true, min: 1 },
//                 urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
//                 requestedBy: { type: String, required: true },
//                 status: { type: String, enum: ['pending', 'approved', 'rejected', 'fulfilled'], default: 'pending' },
//                 site: { type: String, required: true },
//                 companyId: { type: String, required: true },
//                 requiredDate: Date,
//                 purpose: String
//             }, { timestamps: true }),

//             'approve-request': new mongoose.Schema({
//                 requestId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'RequestMaterial' },
//                 approver: { type: String, required: true },
//                 status: { type: String, enum: ['approved', 'rejected', 'pending'], default: 'pending' },
//                 comments: String,
//                 approvedQuantity: Number,
//                 companyId: { type: String, required: true },
//                 approvedAt: Date
//             }, { timestamps: true }),

//             'purchase-order': new mongoose.Schema({
//                 poNumber: { type: String, required: true, unique: true },
//                 supplier: { type: String, required: true },
//                 items: [{
//                     materialName: String,
//                     quantity: Number,
//                     unitPrice: Number,
//                     total: Number
//                 }],
//                 totalAmount: { type: Number, required: true, min: 0 },
//                 status: { type: String, enum: ['draft', 'sent', 'confirmed', 'cancelled'], default: 'draft' },
//                 deliveryDate: Date,
//                 companyId: { type: String, required: true },
//                 preparedBy: String,
//                 terms: String
//             }, { timestamps: true }),

//             'grn': new mongoose.Schema({
//                 grnNumber: { type: String, required: true, unique: true },
//                 poNumber: { type: String, required: true },
//                 receivedItems: [{
//                     materialName: String,
//                     orderedQuantity: Number,
//                     receivedQuantity: Number,
//                     quality: { type: String, enum: ['good', 'damaged', 'partial'] }
//                 }],
//                 receivedBy: { type: String, required: true },
//                 qualityCheck: { type: String, enum: ['passed', 'failed', 'partial'], default: 'passed' },
//                 companyId: { type: String, required: true },
//                 receivedDate: { type: Date, default: Date.now }
//             }, { timestamps: true }),

//             // DMS collections
//             'document-management-system': new mongoose.Schema({
//                 documentName: { type: String, required: true },
//                 documentType: { type: String, required: true, enum: ['contract', 'invoice', 'design', 'permit', 'report', 'other'] },
//                 category: { type: String, required: true },
//                 fileUrl: { type: String, required: true },
//                 uploadedBy: { type: String, required: true },
//                 accessPermissions: [String],
//                 companyId: { type: String, required: true },
//                 fileSize: Number,
//                 mimeType: String,
//                 description: String
//             }, { timestamps: true })
//         };
//     }

//     // Validate features before database creation - ENHANCED with better error reporting
//     static validateFeatures(selectedFeatures) {
//         if (!Array.isArray(selectedFeatures)) {
//             throw new Error('Selected features must be an array');
//         }

//         if (selectedFeatures.length === 0) {
//             throw new Error('At least one feature must be selected');
//         }

//         const validFeatures = this.getCollectionSchemas();
//         const invalidFeatures = [];
//         const validFeaturesList = [];

//         console.log('🔍 Validating features:', selectedFeatures.map(f => ({ name: f.featureName, path: f.path })));

//         selectedFeatures.forEach(feature => {
//             if (!feature.path || !feature.featureName) {
//                 invalidFeatures.push('Invalid feature structure - missing path or featureName');
//                 return;
//             }

//             if (!validFeatures[feature.path]) {
//                 invalidFeatures.push(`${feature.featureName} (path: ${feature.path})`);
//                 console.warn(`❌ Invalid feature path: ${feature.path} for feature: ${feature.featureName}`);
//             } else {
//                 validFeaturesList.push(feature.path);
//                 console.log(`✅ Valid feature: ${feature.featureName} -> ${feature.path}`);
//             }
//         });

//         if (invalidFeatures.length > 0) {
//             const errorMsg = `Invalid features selected: ${invalidFeatures.join(', ')}. Available features: ${Object.keys(validFeatures).join(', ')}`;
//             console.error('💥 Feature validation failed:', errorMsg);
//             throw new Error(errorMsg);
//         }

//         console.log(`🎯 Feature validation passed. Valid features: ${validFeaturesList.length}`);
//         return validFeaturesList;
//     }

//     // // Rest of the methods remain the same...
//     // In services/databaseInitializer.js - UPDATE THIS METHOD
// static async initializeTenantDatabase(companyId, databaseName, selectedFeatures) {
//     let tenantConnection = null;
    
//     try {
//         // Validate features first
//         const validFeatures = this.validateFeatures(selectedFeatures);
        
//         console.log(`🚀 Starting database initialization for company: ${companyId} with database: ${databaseName} and ${validFeatures.length} features`);

//         // Connect to tenant database USING THE DATABASE NAME
//         tenantConnection = await connectTenantDB(companyId, databaseName); // PASS DATABASE NAME
//         const schemas = this.getCollectionSchemas();
        
//         const createdCollections = [];
//         const creationErrors = [];

//         // Create models for each selected feature
//         for (const featurePath of validFeatures) {
//             try {
//                 const modelName = this.getModelName(featurePath);
                
//                 // Check if model already exists
//                 if (!tenantConnection.models[modelName]) {
//                     tenantConnection.model(modelName, schemas[featurePath]);
//                     console.log(`✅ Created collection for feature: ${featurePath} (model: ${modelName}) in database: ${databaseName}`);
//                 } else {
//                     console.log(`ℹ️  Collection already exists: ${featurePath} in database: ${databaseName}`);
//                 }
                
//                 createdCollections.push(featurePath);
//             } catch (featureError) {
//                 creationErrors.push({
//                     feature: featurePath,
//                     error: featureError.message
//                 });
//                 console.error(`❌ Failed to create collection for feature ${featurePath}:`, featureError);
//             }
//         }

//         // ... rest of the method remains the same until the return statement

//         const result = {
//             success: true,
//             companyId,
//             databaseName, // ADD THIS TO RESULT
//             createdCollections,
//             failedCollections: creationErrors,
//             totalRequested: validFeatures.length + defaultCollections.length,
//             totalCreated: createdCollections.length,
//             message: creationErrors.length > 0 
//                 ? `Tenant database '${databaseName}' initialized with ${createdCollections.length} collections (${creationErrors.length} failures)`
//                 : `Tenant database '${databaseName}' successfully initialized with ${createdCollections.length} collections`
//         };

//         console.log(`🎉 Database initialization completed for company: ${companyId}`, result);
//         return result;

//     } catch (error) {
//         console.error(`💥 Error initializing tenant database '${databaseName}' for company ${companyId}:`, error);
        
//         // Cleanup connection if initialization failed
//         if (tenantConnection) {
//             try {
//                 await tenantConnection.close();
//                 if (tenantConnections.has(companyId)) {
//                     tenantConnections.delete(companyId);
//                 }
//             } catch (cleanupError) {
//                 console.error(`Error during connection cleanup:`, cleanupError);
//             }
//         }
        
//         throw error;
//     }
// }

//     // Rest of the methods (createIndexes, cleanupTenantDatabase, getDatabaseStatus, getModelName) remain exactly the same...
//     static async createIndexes(connection, collections) {
//         const indexPromises = [];
//         const commonIndexes = ['companyId', 'createdAt', 'status'];

//         for (const collectionName of collections) {
//             const model = connection.models[this.getModelName(collectionName)];
//             if (model) {
//                 switch (collectionName) {
//                     case 'expense-entry':
//                         indexPromises.push(model.createIndexes([
//                             { companyId: 1, date: -1 },
//                             { companyId: 1, category: 1 },
//                             { companyId: 1, status: 1 }
//                         ]));
//                         break;
//                     case 'site-management':
//                         indexPromises.push(model.createIndexes([
//                             { companyId: 1, status: 1 },
//                             { companyId: 1, manager: 1 }
//                         ]));
//                         break;
//                     case 'user-management':
//                         indexPromises.push(model.createIndexes([
//                             { companyId: 1, email: 1 },
//                             { companyId: 1, role: 1 }
//                         ]));
//                         break;
//                     case 'task-manager':
//                         indexPromises.push(model.createIndexes([
//                             { companyId: 1, assignedTo: 1, status: 1 },
//                             { companyId: 1, dueDate: 1 }
//                         ]));
//                         break;
//                     default:
//                         commonIndexes.forEach(field => {
//                             if (model.schema.path(field)) {
//                                 indexPromises.push(model.createIndexes([{ [field]: 1 }]));
//                             }
//                         });
//                 }
//             }
//         }

//         await Promise.all(indexPromises);
//     }

//     static async cleanupTenantDatabase(companyId) {
//         try {
//             const tenantConnection = getTenantConnection(companyId);
//             if (tenantConnection) {
//                 await tenantConnection.dropDatabase();
//                 console.log(`🧹 Cleaned up tenant database for company: ${companyId}`);
//             }
            
//             if (tenantConnections.has(companyId)) {
//                 tenantConnections.delete(companyId);
//             }
            
//             return {
//                 success: true,
//                 message: `Tenant database cleaned up for company: ${companyId}`
//             };
//         } catch (error) {
//             console.error(`❌ Error cleaning up tenant database for company ${companyId}:`, error);
//             throw error;
//         }
//     }

//     static async getDatabaseStatus(companyId) {
//         try {
//             const tenantConnection = getTenantConnection(companyId);
//             if (!tenantConnection) {
//                 return { success: false, message: 'No database connection found' };
//             }

//             const collections = await tenantConnection.db.listCollections().toArray();
//             const stats = {};

//             for (const collection of collections) {
//                 const modelName = this.getModelName(collection.name);
//                 const model = tenantConnection.models[modelName];
//                 if (model) {
//                     stats[collection.name] = await model.countDocuments();
//                 }
//             }

//             return {
//                 success: true,
//                 companyId,
//                 collections: collections.map(c => c.name),
//                 statistics: stats,
//                 totalCollections: collections.length
//             };
//         } catch (error) {
//             console.error(`Error getting database status for company ${companyId}:`, error);
//             throw error;
//         }
//     }

//     static getModelName(featurePath) {
//         return featurePath
//             .split('-')
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//             .join('');
//     }

//     static getAvailableFeatures() {
//         const schemas = this.getCollectionSchemas();
//         return Object.keys(schemas).map(path => ({
//             path,
//             modelName: this.getModelName(path),
//             fields: Object.keys(schemas[path].paths)
//         }));
//     }
// }

// module.exports = DatabaseInitializer;



// services/databaseInitializer.js - FIXED VERSION
const mongoose = require('mongoose');
const { connectTenantDB, getTenantConnection, tenantConnections } = require('../utils/dbConnection.js');

class DatabaseInitializer {
    // Collection schemas mapping - ENHANCED with supervisor variants
    static getCollectionSchemas() {
        return {
            // Finance related collections
            'expense-entry': new mongoose.Schema({
                amount: { type: Number, required: true, min: 0 },
                description: { type: String, required: true, trim: true },
                category: { type: String, required: true, enum: ['Material', 'Labor', 'Equipment', 'Transport', 'Other'] },
                date: { type: Date, required: true, default: Date.now },
                createdBy: { type: String, required: true },
                status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
                companyId: { type: String, required: true },
                siteId: String
            }, { timestamps: true }),

            'fund-management': new mongoose.Schema({
                fundAmount: { type: Number, required: true, min: 0 },
                source: { type: String, required: true, enum: ['Client', 'Investment', 'Loan', 'Other'] },
                purpose: { type: String, required: true },
                transactionDate: { type: Date, required: true, default: Date.now },
                status: { type: String, required: true, enum: ['received', 'pending', 'utilized'] },
                companyId: { type: String, required: true },
                referenceNumber: String
            }, { timestamps: true }),

            'expense-approval': new mongoose.Schema({
                expenseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ExpenseEntry' },
                approver: { type: String, required: true },
                status: { type: String, required: true, enum: ['approved', 'rejected', 'pending'] },
                comments: String,
                approvedAt: Date,
                companyId: { type: String, required: true }
            }, { timestamps: true }),

            // Site related collections
            'site-progress': new mongoose.Schema({
                siteName: { type: String, required: true },
                progressPercentage: { type: Number, required: true, min: 0, max: 100 },
                tasksCompleted: { type: Number, required: true, min: 0 },
                totalTasks: { type: Number, required: true, min: 1 },
                updateDate: { type: Date, required: true, default: Date.now },
                supervisor: { type: String, required: true },
                companyId: { type: String, required: true },
                images: [String],
                notes: String
            }, { timestamps: true }),

            'site-management': new mongoose.Schema({
                siteName: { type: String, required: true, unique: true },
                location: { type: String, required: true },
                startDate: { type: Date, required: true },
                endDate: { type: Date, required: true },
                budget: { type: Number, required: true, min: 0 },
                status: { type: String, required: true, enum: ['planning', 'active', 'completed', 'on-hold'] },
                manager: { type: String, required: true },
                companyId: { type: String, required: true },
                clientName: String,
                contactPerson: String
            }, { timestamps: true }),

            'site-update': new mongoose.Schema({
                siteId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'SiteManagement' },
                updateType: { type: String, required: true, enum: ['progress', 'issue', 'milestone', 'general'] },
                description: { type: String, required: true },
                images: [String],
                createdBy: { type: String, required: true },
                companyId: { type: String, required: true },
                priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
            }, { timestamps: true }),

            // Resource management collections - REGULAR VERSIONS
            'material-management': new mongoose.Schema({
                materialName: { type: String, required: true },
                category: { type: String, required: true },
                quantity: { type: Number, required: true, min: 0 },
                unit: { type: String, required: true },
                price: { type: Number, required: true, min: 0 },
                supplier: String,
                status: { type: String, enum: ['available', 'low-stock', 'out-of-stock'], default: 'available' },
                companyId: { type: String, required: true },
                minStockLevel: Number,
                maxStockLevel: Number
            }, { timestamps: true }),

            'vendor-management': new mongoose.Schema({
                vendorName: { type: String, required: true, unique: true },
                contactPerson: { type: String, required: true },
                email: { type: String, required: true },
                phone: { type: String, required: true },
                services: [String],
                rating: { type: Number, min: 1, max: 5 },
                companyId: { type: String, required: true },
                address: String,
                taxId: String,
                status: { type: String, enum: ['active', 'inactive'], default: 'active' }
            }, { timestamps: true }),

            'partner-management': new mongoose.Schema({
                partnerName: { type: String, required: true, unique: true },
                partnershipType: { type: String, required: true, enum: ['supplier', 'contractor', 'consultant', 'other'] },
                contactDetails: {
                    email: String,
                    phone: String,
                    address: String
                },
                agreementDetails: {
                    startDate: Date,
                    endDate: Date,
                    terms: String
                },
                status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
                companyId: { type: String, required: true }
            }, { timestamps: true }),

            'work-force-entry': new mongoose.Schema({
                workerName: { type: String, required: true },
                role: { type: String, required: true },
                contact: String,
                site: String,
                shift: { type: String, enum: ['morning', 'evening', 'night'], default: 'morning' },
                status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
                companyId: { type: String, required: true },
                dailyWage: Number,
                skills: [String]
            }, { timestamps: true }),

            // Resource management collections - SUPERVISOR VERSIONS (use same schema as regular)
            'material-management-supervisor': new mongoose.Schema({
                materialName: { type: String, required: true },
                category: { type: String, required: true },
                quantity: { type: Number, required: true, min: 0 },
                unit: { type: String, required: true },
                price: { type: Number, required: true, min: 0 },
                supplier: String,
                status: { type: String, enum: ['available', 'low-stock', 'out-of-stock'], default: 'available' },
                companyId: { type: String, required: true },
                minStockLevel: Number,
                maxStockLevel: Number
            }, { timestamps: true }),

            'vendor-management-supervisor': new mongoose.Schema({
                vendorName: { type: String, required: true, unique: true },
                contactPerson: { type: String, required: true },
                email: { type: String, required: true },
                phone: { type: String, required: true },
                services: [String],
                rating: { type: Number, min: 1, max: 5 },
                companyId: { type: String, required: true },
                address: String,
                taxId: String,
                status: { type: String, enum: ['active', 'inactive'], default: 'active' }
            }, { timestamps: true }),

            'partner-management-supervisor': new mongoose.Schema({
                partnerName: { type: String, required: true, unique: true },
                partnershipType: { type: String, required: true, enum: ['supplier', 'contractor', 'consultant', 'other'] },
                contactDetails: {
                    email: String,
                    phone: String,
                    address: String
                },
                agreementDetails: {
                    startDate: Date,
                    endDate: Date,
                    terms: String
                },
                status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
                companyId: { type: String, required: true }
            }, { timestamps: true }),

            'work-force-entry-supervisor': new mongoose.Schema({
                workerName: { type: String, required: true },
                role: { type: String, required: true },
                contact: String,
                site: String,
                shift: { type: String, enum: ['morning', 'evening', 'night'], default: 'morning' },
                status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
                companyId: { type: String, required: true },
                dailyWage: Number,
                skills: [String]
            }, { timestamps: true }),

            'partner-details': new mongoose.Schema({
                partnerName: { type: String, required: true, unique: true },
                partnershipType: { type: String, required: true, enum: ['supplier', 'contractor', 'consultant', 'other'] },
                contactDetails: {
                    email: String,
                    phone: String,
                    address: String
                },
                agreementDetails: {
                    startDate: Date,
                    endDate: Date,
                    terms: String
                },
                status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
                companyId: { type: String, required: true }
            }, { timestamps: true }),

            'user-management': new mongoose.Schema({
                username: { type: String, required: true, unique: true },
                email: { type: String, required: true, unique: true },
                role: { type: String, required: true, enum: ['admin', 'supervisor', 'client', 'project-manager', 'sales-manager', 'designer'] },
                permissions: [String],
                status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
                companyId: { type: String, required: true },
                lastLogin: Date,
                profile: {
                    firstName: String,
                    lastName: String,
                    phone: String,
                    department: String
                }
            }, { timestamps: true }),

            // Other collections
            'task-manager': new mongoose.Schema({
                title: { type: String, required: true },
                description: String,
                assignedTo: { type: String, required: true },
                priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
                dueDate: { type: Date, required: true },
                status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
                companyId: { type: String, required: true },
                projectId: String,
                estimatedHours: Number,
                actualHours: Number
            }, { timestamps: true }),

            'survey-form': new mongoose.Schema({
                formName: { type: String, required: true },
                questions: [{
                    question: String,
                    type: { type: String, enum: ['text', 'multiple-choice', 'rating', 'yes-no'] },
                    options: [String],
                    required: Boolean
                }],
                responses: [{
                    respondent: String,
                    answers: Object,
                    submittedAt: { type: Date, default: Date.now }
                }],
                createdBy: { type: String, required: true },
                companyId: { type: String, required: true },
                status: { type: String, enum: ['active', 'inactive'], default: 'active' }
            }, { timestamps: true }),

            'helpdesk': new mongoose.Schema({
                ticketId: { type: String, required: true, unique: true },
                issueType: { type: String, required: true, enum: ['technical', 'billing', 'general', 'feature-request'] },
                description: { type: String, required: true },
                priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
                status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
                assignedTo: String,
                companyId: { type: String, required: true },
                createdBy: String,
                resolution: String,
                closedAt: Date
            }, { timestamps: true }),

            'history': new mongoose.Schema({
                action: { type: String, required: true },
                performedBy: { type: String, required: true },
                target: { type: String, required: true },
                details: Object,
                timestamp: { type: Date, default: Date.now },
                companyId: { type: String, required: true },
                ipAddress: String,
                userAgent: String
            }, { timestamps: true }),

            'payment': new mongoose.Schema({
                amount: { type: Number, required: true, min: 0 },
                paymentMethod: { type: String, required: true, enum: ['cash', 'bank-transfer', 'cheque', 'online'] },
                status: { type: String, required: true, enum: ['pending', 'completed', 'failed', 'cancelled'] },
                transactionId: String,
                payer: { type: String, required: true },
                payee: { type: String, required: true },
                companyId: { type: String, required: true },
                paymentDate: Date,
                referenceNumber: String
            }, { timestamps: true }),

            // Designer collections
            'designer-approval-client': new mongoose.Schema({
                designName: { type: String, required: true },
                designer: { type: String, required: true },
                client: { type: String, required: true },
                approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'revisions-requested'], default: 'pending' },
                feedback: String,
                revisions: { type: Number, default: 0 },
                companyId: { type: String, required: true },
                designFiles: [String],
                clientComments: String
            }, { timestamps: true }),

            // Calculator collections
            'construction-calculator': new mongoose.Schema({
                calculationType: { type: String, required: true, enum: ['material', 'labor', 'equipment', 'total-cost'] },
                inputs: Object,
                result: Object,
                createdBy: { type: String, required: true },
                companyId: { type: String, required: true },
                projectId: String,
                calculationDate: { type: Date, default: Date.now }
            }, { timestamps: true }),

            // Quotation collections
            'view-manual-quotations': new mongoose.Schema({
                quotationNumber: { type: String, required: true, unique: true },
                client: { type: String, required: true },
                amount: { type: Number, required: true, min: 0 },
                status: { type: String, enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'], default: 'draft' },
                validUntil: { type: Date, required: true },
                items: [{
                    description: String,
                    quantity: Number,
                    unitPrice: Number,
                    total: Number
                }],
                companyId: { type: String, required: true },
                preparedBy: String,
                clientAddress: String,
                terms: String
            }, { timestamps: true }),

            // Material request collections
            'request-material': new mongoose.Schema({
                materialName: { type: String, required: true },
                quantity: { type: Number, required: true, min: 1 },
                urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
                requestedBy: { type: String, required: true },
                status: { type: String, enum: ['pending', 'approved', 'rejected', 'fulfilled'], default: 'pending' },
                site: { type: String, required: true },
                companyId: { type: String, required: true },
                requiredDate: Date,
                purpose: String
            }, { timestamps: true }),

            'approve-request': new mongoose.Schema({
                requestId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'RequestMaterial' },
                approver: { type: String, required: true },
                status: { type: String, enum: ['approved', 'rejected', 'pending'], default: 'pending' },
                comments: String,
                approvedQuantity: Number,
                companyId: { type: String, required: true },
                approvedAt: Date
            }, { timestamps: true }),

            'purchase-order': new mongoose.Schema({
                poNumber: { type: String, required: true, unique: true },
                supplier: { type: String, required: true },
                items: [{
                    materialName: String,
                    quantity: Number,
                    unitPrice: Number,
                    total: Number
                }],
                totalAmount: { type: Number, required: true, min: 0 },
                status: { type: String, enum: ['draft', 'sent', 'confirmed', 'cancelled'], default: 'draft' },
                deliveryDate: Date,
                companyId: { type: String, required: true },
                preparedBy: String,
                terms: String
            }, { timestamps: true }),

            'grn': new mongoose.Schema({
                grnNumber: { type: String, required: true, unique: true },
                poNumber: { type: String, required: true },
                receivedItems: [{
                    materialName: String,
                    orderedQuantity: Number,
                    receivedQuantity: Number,
                    quality: { type: String, enum: ['good', 'damaged', 'partial'] }
                }],
                receivedBy: { type: String, required: true },
                qualityCheck: { type: String, enum: ['passed', 'failed', 'partial'], default: 'passed' },
                companyId: { type: String, required: true },
                receivedDate: { type: Date, default: Date.now }
            }, { timestamps: true }),

            // DMS collections
            'document-management-system': new mongoose.Schema({
                documentName: { type: String, required: true },
                documentType: { type: String, required: true, enum: ['contract', 'invoice', 'design', 'permit', 'report', 'other'] },
                category: { type: String, required: true },
                fileUrl: { type: String, required: true },
                uploadedBy: { type: String, required: true },
                accessPermissions: [String],
                companyId: { type: String, required: true },
                fileSize: Number,
                mimeType: String,
                description: String
            }, { timestamps: true }),

            // ADMIN COLLECTION - ADDED FOR TENANT DATABASE
            'admins': new mongoose.Schema({
                name: { type: String, required: true },
                email: { type: String, required: true, unique: true },
                password: { type: String, required: true },
                phone: { type: String, required: true },
                role: { type: String, required: true, default: 'admin' },
                permissions: [String],
                featureAccess: [{
                    featureName: String,
                    featurePath: String,
                    accessLevel: { type: String, default: 'admin' }
                }],
                status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
                isFirstLogin: { type: Boolean, default: true },
                lastLogin: Date,
                profile: {
                    department: String,
                    designation: String
                },
                companyId: { type: String, required: true }
            }, { timestamps: true })
        };
    }

    // Validate features before database creation - ENHANCED with better error reporting
    static validateFeatures(selectedFeatures) {
        console.log('🔍 validateFeatures called with:', typeof selectedFeatures, selectedFeatures);

        if (!Array.isArray(selectedFeatures)) {
            console.error('❌ Selected features is not an array:', selectedFeatures);
            throw new Error(`Selected features must be an array. Received: ${typeof selectedFeatures}`);
        }

        if (selectedFeatures.length === 0) {
            throw new Error('At least one feature must be selected');
        }

        const validFeatures = this.getCollectionSchemas();
        const invalidFeatures = [];
        const validFeaturesList = [];

        console.log('🔍 Validating features:', selectedFeatures);

        selectedFeatures.forEach(feature => {
            // Handle both object format and string format
            let featurePath, featureName;
            
            if (typeof feature === 'object') {
                featurePath = feature.path;
                featureName = feature.featureName;
            } else if (typeof feature === 'string') {
                featurePath = feature;
                featureName = feature;
            } else {
                invalidFeatures.push('Invalid feature format');
                return;
            }

            if (!featurePath) {
                invalidFeatures.push('Invalid feature structure - missing path');
                return;
            }

            if (!validFeatures[featurePath]) {
                invalidFeatures.push(`${featureName || featurePath} (path: ${featurePath})`);
                console.warn(`❌ Invalid feature path: ${featurePath}`);
            } else {
                validFeaturesList.push(featurePath);
                console.log(`✅ Valid feature: ${featureName || featurePath} -> ${featurePath}`);
            }
        });

        if (invalidFeatures.length > 0) {
            const errorMsg = `Invalid features selected: ${invalidFeatures.join(', ')}. Available features: ${Object.keys(validFeatures).join(', ')}`;
            console.error('💥 Feature validation failed:', errorMsg);
            throw new Error(errorMsg);
        }

        console.log(`🎯 Feature validation passed. Valid features: ${validFeaturesList.length}`);
        return validFeaturesList;
    }

    // Initialize tenant database with enhanced error handling
    static async initializeTenantDatabase(companyId, databaseName, selectedFeatures, adminData) {
        let tenantConnection = null;
        
        try {
            console.log('🚀 Starting database initialization with:', {
                companyId,
                databaseName,
                selectedFeaturesCount: selectedFeatures ? selectedFeatures.length : 0,
                adminData: adminData ? `${adminData.name} (${adminData.email})` : 'No admin data'
            });

            // Validate features first
            const validFeatures = this.validateFeatures(selectedFeatures);
            
            console.log(`🚀 Starting database initialization for company: ${companyId} with database: ${databaseName} and ${validFeatures.length} features`);

            // Connect to tenant database USING THE DATABASE NAME
            tenantConnection = await connectTenantDB(companyId, databaseName);
            const schemas = this.getCollectionSchemas();
            
            const createdCollections = [];
            const creationErrors = [];

            // Create models for each selected feature
            for (const featurePath of validFeatures) {
                try {
                    const modelName = this.getModelName(featurePath);
                    
                    // Check if model already exists
                    if (!tenantConnection.models[modelName]) {
                        tenantConnection.model(modelName, schemas[featurePath]);
                        console.log(`✅ Created collection for feature: ${featurePath} (model: ${modelName}) in database: ${databaseName}`);
                    } else {
                        console.log(`ℹ️  Collection already exists: ${featurePath} in database: ${databaseName}`);
                    }
                    
                    createdCollections.push(featurePath);
                } catch (featureError) {
                    creationErrors.push({
                        feature: featurePath,
                        error: featureError.message
                    });
                    console.error(`❌ Failed to create collection for feature ${featurePath}:`, featureError);
                }
            }

            // Create default collections that every tenant should have
            const defaultCollections = [
                { name: 'users', schema: new mongoose.Schema({
                    username: { type: String, required: true, unique: true },
                    email: { type: String, required: true, unique: true },
                    password: { type: String, required: true },
                    role: { type: String, required: true },
                    companyId: { type: String, required: true },
                    status: { type: String, default: 'active' },
                    lastLogin: Date,
                    profile: Object
                }, { timestamps: true }) },
                
                { name: 'sessions', schema: new mongoose.Schema({
                    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
                    token: { type: String, required: true },
                    expiresAt: { type: Date, required: true },
                    companyId: { type: String, required: true },
                    ipAddress: String,
                    userAgent: String
                }, { timestamps: true }) },
                
                { name: 'settings', schema: new mongoose.Schema({
                    key: { type: String, required: true, unique: true },
                    value: mongoose.Schema.Types.Mixed,
                    companyId: { type: String, required: true },
                    description: String,
                    category: String
                }, { timestamps: true }) },
                
                { name: 'auditlogs', schema: new mongoose.Schema({
                    action: { type: String, required: true },
                    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
                    resource: String,
                    details: Object,
                    companyId: { type: String, required: true },
                    ipAddress: String,
                    timestamp: { type: Date, default: Date.now }
                }, { timestamps: true }) }
            ];

            for (const collection of defaultCollections) {
                try {
                    if (!tenantConnection.models[collection.name]) {
                        tenantConnection.model(collection.name, collection.schema);
                        createdCollections.push(collection.name);
                        console.log(`✅ Created default collection: ${collection.name} for company: ${companyId}`);
                    }
                } catch (defaultError) {
                    creationErrors.push({
                        collection: collection.name,
                        error: defaultError.message
                    });
                    console.error(`❌ Failed to create default collection ${collection.name}:`, defaultError);
                }
            }

            // CREATE ADMIN USER IN TENANT DATABASE
            if (adminData) {
                try {
                    const AdminModel = tenantConnection.model('Admin', schemas['admins']);
                    
                    // Create admin user in tenant database
                    const tenantAdmin = new AdminModel({
                        name: adminData.name,
                        email: adminData.email,
                        password: adminData.password,
                        phone: adminData.phone,
                        role: 'admin',
                        permissions: adminData.permissions || [],
                        featureAccess: adminData.featureAccess || [],
                        status: 'active',
                        isFirstLogin: true,
                        companyId: companyId,
                        profile: {
                            department: 'Administration',
                            designation: 'Company Admin'
                        }
                    });

                    await tenantAdmin.save();
                    console.log(`✅ Created admin user in tenant database: ${adminData.email}`);
                    createdCollections.push('admins');
                    
                } catch (adminError) {
                    creationErrors.push({
                        collection: 'admins',
                        error: adminError.message
                    });
                    console.error(`❌ Failed to create admin user in tenant database:`, adminError);
                }
            }

            // Create indexes for better performance
            try {
                await this.createIndexes(tenantConnection, createdCollections);
                console.log(`✅ Created indexes for company: ${companyId}`);
            } catch (indexError) {
                console.warn(`⚠️  Index creation failed for company ${companyId}:`, indexError);
                creationErrors.push({
                    operation: 'index-creation',
                    error: indexError.message
                });
            }

            const result = {
                success: true,
                companyId,
                databaseName,
                createdCollections,
                failedCollections: creationErrors,
                totalRequested: validFeatures.length + defaultCollections.length + (adminData ? 1 : 0),
                totalCreated: createdCollections.length,
                message: creationErrors.length > 0 
                    ? `Tenant database '${databaseName}' initialized with ${createdCollections.length} collections (${creationErrors.length} failures)`
                    : `Tenant database '${databaseName}' successfully initialized with ${createdCollections.length} collections`
            };

            console.log(`🎉 Database initialization completed for company: ${companyId}`, result);
            return result;

        } catch (error) {
            console.error(`💥 Error initializing tenant database '${databaseName}' for company ${companyId}:`, error);
            
            // Cleanup connection if initialization failed
            if (tenantConnection) {
                try {
                    await tenantConnection.close();
                    if (tenantConnections.has(companyId)) {
                        tenantConnections.delete(companyId);
                    }
                } catch (cleanupError) {
                    console.error(`Error during connection cleanup:`, cleanupError);
                }
            }
            
            throw error;
        }
    }

    // Rest of the methods remain the same...
    static async createIndexes(connection, collections) {
        const indexPromises = [];
        const commonIndexes = ['companyId', 'createdAt', 'status'];

        for (const collectionName of collections) {
            const model = connection.models[this.getModelName(collectionName)];
            if (model) {
                switch (collectionName) {
                    case 'expense-entry':
                        indexPromises.push(model.createIndexes([
                            { companyId: 1, date: -1 },
                            { companyId: 1, category: 1 },
                            { companyId: 1, status: 1 }
                        ]));
                        break;
                    case 'site-management':
                        indexPromises.push(model.createIndexes([
                            { companyId: 1, status: 1 },
                            { companyId: 1, manager: 1 }
                        ]));
                        break;
                    case 'user-management':
                        indexPromises.push(model.createIndexes([
                            { companyId: 1, email: 1 },
                            { companyId: 1, role: 1 }
                        ]));
                        break;
                    case 'task-manager':
                        indexPromises.push(model.createIndexes([
                            { companyId: 1, assignedTo: 1, status: 1 },
                            { companyId: 1, dueDate: 1 }
                        ]));
                        break;
                    case 'admins':
                        indexPromises.push(model.createIndexes([
                            { companyId: 1, email: 1 },
                            { companyId: 1, status: 1 }
                        ]));
                        break;
                    default:
                        commonIndexes.forEach(field => {
                            if (model.schema.path(field)) {
                                indexPromises.push(model.createIndexes([{ [field]: 1 }]));
                            }
                        });
                }
            }
        }

        await Promise.all(indexPromises);
    }

    static async cleanupTenantDatabase(companyId, databaseName) {
        try {
            const tenantConnection = getTenantConnection(companyId);
            if (tenantConnection) {
                await tenantConnection.dropDatabase();
                console.log(`🧹 Cleaned up tenant database: ${databaseName} for company: ${companyId}`);
            }
            
            if (tenantConnections.has(companyId)) {
                tenantConnections.delete(companyId);
            }
            
            return {
                success: true,
                message: `Tenant database '${databaseName}' cleaned up for company: ${companyId}`
            };
        } catch (error) {
            console.error(`❌ Error cleaning up tenant database '${databaseName}' for company ${companyId}:`, error);
            throw error;
        }
    }

    static async getDatabaseStatus(companyId, databaseName) {
        try {
            const tenantConnection = getTenantConnection(companyId);
            if (!tenantConnection) {
                return { success: false, message: `No database connection found for ${databaseName}` };
            }

            const collections = await tenantConnection.db.listCollections().toArray();
            const stats = {};

            for (const collection of collections) {
                const modelName = this.getModelName(collection.name);
                const model = tenantConnection.models[modelName];
                if (model) {
                    stats[collection.name] = await model.countDocuments();
                }
            }

            return {
                success: true,
                companyId,
                databaseName,
                collections: collections.map(c => c.name),
                statistics: stats,
                totalCollections: collections.length
            };
        } catch (error) {
            console.error(`Error getting database status for database '${databaseName}' (company ${companyId}):`, error);
            throw error;
        }
    }

    static getModelName(featurePath) {
        return featurePath
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }

    static getAvailableFeatures() {
        const schemas = this.getCollectionSchemas();
        return Object.keys(schemas).map(path => ({
            path,
            modelName: this.getModelName(path),
            fields: Object.keys(schemas[path].paths)
        }));
    }
}

module.exports = DatabaseInitializer;