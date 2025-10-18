// utils/dbConnection.js - UPDATED VERSION
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

// Connect to tenant database - UPDATED TO USE DATABASE NAME
const connectTenantDB = async (companyId, databaseName) => {
    try {
        if (tenantConnections.has(companyId)) {
            return tenantConnections.get(companyId);
        }

        // Use the provided database name instead of companyId
        const tenantDBUrl = mainDBUrl.replace('/smt', `/${databaseName}`);
        
        console.log(`🔗 Connecting to tenant database: ${databaseName} (URL: ${tenantDBUrl.replace(/mongodb\+srv:\/\/[^@]+@/, 'mongodb+srv://***@')})`);

        const connection = mongoose.createConnection(tenantDBUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        // Wait for connection to be established
        await new Promise((resolve, reject) => {
            connection.on('connected', resolve);
            connection.on('error', reject);
        });

        tenantConnections.set(companyId, connection);
        
        console.log(`✅ Tenant database connected: ${databaseName} for company: ${companyId}`);
        return connection;
    } catch (err) {
        console.error(`❌ Tenant database connection failed for ${databaseName} (company: ${companyId}):`, err.message);
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
        console.log(`🔌 Tenant database connection closed for company: ${companyId}`);
    }
};

module.exports = {
    connectMainDB,
    connectTenantDB,
    getTenantConnection,
    closeTenantConnection,
    tenantConnections
};