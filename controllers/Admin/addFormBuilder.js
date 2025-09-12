const Form = require("../../Schema/formBuilder.schema/form.model");

const addFormBuilder = async (req, res) => {
     try {
    const { name, fields } = req.body;
    
    const form = new Form({
      name,
      fields
    });
    
    const newForm = await form.save();

    console.log(newForm)
    // res.status(201).json(newForm);
    res.status(201).send({
            success: true,
            message: 'Form data added successfully',
            data: newMasterType
        });

  } catch (error) {
    // res.status(400).json({ message: error.message });
    res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
  }

}


module.exports = addFormBuilder