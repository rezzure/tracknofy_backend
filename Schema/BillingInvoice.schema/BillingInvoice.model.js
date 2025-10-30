// const mongoose = require('mongoose')

// const invoiceSchema = new mongoose.Schema(
//     {
//         invoiceNumber:
//         {
//             type: String,
//         },
//         date:
//         {
//             type: Date,
//             default: Date.now()
//         },
//         dueDate: {
//             type: Date,
//         },

//         companyData:
//         {
//             companyName: {
//                 type: String,
//             },
//             companyGSTIN: {
//                 type: String
//             },
//             phoneNumber: {
//                 type: Number,
//             },
//             email: {
//                 type: String,

//             },
//         },
//         clientData:
//         {
//             clientName: {
//                 type: String,
//             },
//             clientGSTIN: {
//                 type: String,
//             },
//             phoneNumber: {
//                 type: Number,
//             },
//             email: {
//                 type: String,
//             },
//         },

//         itemDescription:
//             [
//                 {
//                     description: {
//                         type: String,
//                     },
//                     HSN_SAC: {
//                         type: String,
//                     },
//                     unit: {
//                         type: String,
//                     },
//                     quantity: {
//                         type: Number,
//                     },
//                     rate: {
//                         type: Number,
//                     },
//                     discount: {
//                         type: Number,
//                     },
//                     amount: {
//                         type: Number,
//                     },
//                 },
//             ],
//         totalAmount: {
//             subTotal: {
//                 type: Number,
//             },
//             CGST_Percentage: {
//                 type: Number,
//             },
//             SGST_Percentage: {
//                 type: Number,
//             },
//             previousDue: {
//                 type: Number,
//             },
//             advancePayment: {
//                 type: Number,
//             },
//             grandTotal: {
//                 type: Number,
//             },
//         },
//         notes: {
//             type: String,
//         },

//         createdBy: {
//             type: String,
//         },
//         updatedBy: {
//             type: String,
//         },
//     },
//     {
//         timestamps: true
//     }
// )
// const BillingInvoice = mongoose.model('BillingInvoice', invoiceSchema)
// module.exports = BillingInvoice















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
            address: {
                type: String,
            }
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
            address: {
                type: String,
            }
        },
        shipToData: {
            shipToName: {
                type: String,
            },
            shipToGSTIN: {
                type: String,
            },
            phoneNumber: {
                type: Number,
            },
            email: {
                type: String,
            },
            address: {
                type: String,
            }
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
        
        // Additional charges array - FIXED to accept both label and title
        additionalCharges: [
            {
                label: {
                    type: String,
                    default: ""
                },
                title: {
                    type: String,
                    default: ""
                },
                amount: {
                    type: Number,
                    default: 0
                }
            }
        ],
        
        // GST, due, and payment flags - FIXED
        includeGST: {
            type: Boolean,
            default: false
        },
        previousDue: {
            type: Boolean,
            default: false
        },
        advancePayment: {
            type: Boolean,
            default: false
        },

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
        termsConditions: {
            type: String,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
    },
    {
        timestamps: true
    }
)

const BillingInvoice = mongoose.model('BillingInvoice', invoiceSchema)
module.exports = BillingInvoice