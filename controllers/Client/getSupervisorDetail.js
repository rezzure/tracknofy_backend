const Client = require("../../Schema/client.schema/client.model")
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model")

const getSupervisorDetail = async (req, res) => {
    const email = req.query.email
    try {
        const client = await Client.findOne({email:email})
        console.log(client.supervisor_name)
        const supervisor = await Supervisor.findById(client.supervisorId)
        if(!supervisor){
            return res.status(400).send({
                success:true,
                message:"Supervisor Not Found"
            })
        }
        return res.status(200).send({
            success: true,
            message: 'Supervisor Detail Found Successfully',
            supervisorDetails : supervisor

        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message:`Internal server error ${error.message}`
        })
    }
}

module.exports = getSupervisorDetail