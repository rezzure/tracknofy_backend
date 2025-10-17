// utils/dbConnection.js
const mongoose = require('mongoose');
require("dotenv").config();

const mainDBUrl = process.env.BASE_URL;

// Store active connections
const tenantConnections = new Map();

// Connect to main database (for company records)
const connectMainDB = async () => {
    try {
        await mongoose.connect(mainDBUrl);
        console.log('Main MongoDB connected successfully');
        return mongoose.connection;
    } catch (err) {
        console.error("Main MongoDB connection failed:", err.message);
        throw err;
    }
};

// Connect to tenant database
const connectTenantDB = async (companyId) => {
    try {
        if (tenantConnections.has(companyId)) {
            return tenantConnections.get(companyId);
        }

        // Create tenant database URL (appending companyId to main DB URL)
        const tenantDBUrl = mainDBUrl.replace('/smt', `/smt_${companyId}`);
        
        const connection = mongoose.createConnection(tenantDBUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        tenantConnections.set(companyId, connection);
        
        console.log(`Tenant database connected for company: ${companyId}`);
        return connection;
    } catch (err) {
        console.error(`Tenant database connection failed for company ${companyId}:`, err.message);
        throw err;
    }
};

// Get tenant connection
const getTenantConnection = (companyId) => {
    return tenantConnections.get(companyId);
};

// Close tenant connection
const closeTenantConnection = async (companyId) => {
    if (tenantConnections.has(companyId)) {
        await tenantConnections.get(companyId).close();
        tenantConnections.delete(companyId);
    }
};

module.exports = {
    connectMainDB,
    connectTenantDB,
    getTenantConnection,
    closeTenantConnection,
    tenantConnections
};