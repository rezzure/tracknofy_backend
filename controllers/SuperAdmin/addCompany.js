const AddCompany = require("../../Schema/superAdmin.schema/addCompany.model");




const addCompany = async(req, res)=>{
    
    const { companyName , companyAddress , companyContactNo, contactPersonName, contactNo, contactPersonEmail, noOfUser} = req.body;
    const companyLogo = req.file
   
    console.log(companyName , companyAddress , companyContactNo, contactPersonName, contactNo, contactPersonEmail, noOfUser)


    try {
        if(!companyName || companyAddress || companyContactNo || contactPersonName || contactNo || contactPersonEmail|| noOfUser || companyLogo){
            return res.status(401).send({
                success : false,
                message : "Please provide valid data"
            })
        }

        const addCompanyData = {
            companyName : companyName,
            companyAddress : companyAddress,
            companyContactNo : companyContactNo,
            contactPersonName : contactPersonName,
            contactNo : contactNo,
            contactPersonEmail : contactPersonEmail,
            noOfUser : noOfUser,
            companyLogo : companyLogo
            
        }

        const data = await AddCompany.create(addCompanyData)
        
        

        return res.status(200).send({
            success : true,
            message : "company data added successfully",
            companyData : data
        })
        

    } catch (error) {
        return res.status(200).send({
            success : false,
            message : "Failed to add company data",
            companyData : data
        })
        
    }
}

module.exports=addCompany;