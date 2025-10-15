const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber:
        {
            type: String,
        },
        date:
        {
            type: Date,
            default: Date.now()
        },
        dueDate: {
            type: Date,
        },

        companyData:
        {
            companyName: {
                type: String,
            },
            companyGSTIN: {
                type: String
            },
            phoneNumber: {
                type: Number,
            },
            email: {
                type: String,

            },
        },
        clientData:
        {
            clientName: {
                type: String,
            },
            clientGSTIN: {
                type: String,
            },
            phoneNumber: {
                type: Number,
            },
            email: {
                type: String,
            },
        },

        itemDescription:
            [
                {
                    description: {
                        type: String,
                    },
                    HSN_SAC: {
                        type: String,
                    },
                    unit: {
                        type: String,
                    },
                    quantity: {
                        type: Number,
                    },
                    rate: {
                        type: Number,
                    },
                    discount: {
                        type: Number,
                    },
                    amount: {
                        type: Number,
                    },
                },
            ],
        totalAmount: {
            subTotal: {
                type: Number,
            },
            CGST_Percentage: {
                type: Number,
            },
            SGST_Percentage: {
                type: Number,
            },
            previousDue: {
                type: Number,
            },
            advancePayment: {
                type: Number,
            },
            grandTotal: {
                type: Number,
            },
        },
        notes: {
            type: String,
        },

        createdBy: {
            type: String,
        },
        updatedBy: {
            type: String,
        },
    },
    {
        timestamps: true
    }
)
const BillingInvoice = mongoose.model('BillingInvoice', invoiceSchema)
module.exports = BillingInvoice
