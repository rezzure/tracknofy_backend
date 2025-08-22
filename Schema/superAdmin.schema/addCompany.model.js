const { default: mongoose } = require("mongoose");


const addCompanySchema = new mongoose.Schema({
    companyName : {
        type : String,
        required :[ true, "Company name is required"]
        
    },
    companyAddress : {
         type : String,
         required :[ true, "Company address is required"]
        
    },
    companyContactNo : {
         type : Number,
         required :[ true, "Company contact No is required"]
    },
    ContactPersonName : {
        type : String,
        required :[ true, "Contact Person Name is required"]
    },
    contactNo : {
        type : Number,
        required :[ true, "Contact Person Name is required"]
    },
    contactPersonEmail : {
        type : String,
        required : [true , "Contact person email is required"],
        match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    contactPersonPassword :{
        type : String,
        default : "admin@123"
    },
    noOfUser : {
        type : Number,
        required : [true, 'No of user required'],
        default : 0
    },
    companyLogo : {
        type : String,
        required : [true , 'Company logo required']
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    createdBy : {
        type : String,
        default : 'super admin'
    }

})

const AddCompany= mongoose.model("AddCompany", addCompanySchema)

module.exports=AddCompany