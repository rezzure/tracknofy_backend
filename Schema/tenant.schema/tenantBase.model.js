//TenantBase.model.js
const mongoose = require('mongoose');
const { getTenantConnection } = require('../../utils/dbConnection');
// const { getTenantConnection } = require('../utils/dbConnection');

class TenantBase {
    constructor() {
        this.tenantConnection = null;
        this.models = new Map();
    }

    setTenant(companyId) {
        this.tenantConnection = getTenantConnection(companyId);
        if (!this.tenantConnection) {
            throw new Error(`No database connection found for company: ${companyId}`);
        }
    }

    getModel(modelName, schema) {
        if (!this.tenantConnection) {
            throw new Error('Tenant connection not set. Call setTenant first.');
        }

        if (!this.models.has(modelName)) {
            this.models.set(modelName, this.tenantConnection.model(modelName, schema));
        }

        return this.models.get(modelName);
    }
}

module.exports = TenantBase;