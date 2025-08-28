// Comment: Import the Query model from the correct schema file, not from mongoose


const { default: mongoose } = require("mongoose");
// const Client = require("../../Schema/client.schema/client.model");
const Query = require("../../Schema/query.schema/query.model");
const User = require("../../Schema/users.schema/users.model");

// Comment: Controller for managing client queries and communications
const queryController = {

  createQuery: async (req, res) => {
    try {
      const {queryType, description } = req.body;
      const clientId = req.user;
      // Modify the photo path handling in createQuery
      const photos = req.files?.map(file => `/uploads/${file.filename}`) || [];
  

      if (!queryType || !description) {
        return res.status(400).json({
          success: false,
          message: "Query Type and Description are Required",
        });
      }

      const clientObjId = new mongoose.Types.ObjectId(clientId)
      console.log(clientObjId)

      const clientUser = await User.findOne({ _id: clientObjId }).select('-password');;
      console.log("Found client:", clientUser);

      if (!clientUser) {
        return res.status(404).json({
          success: false,
          message: "Client Not Found",
          
        });
      }

      const newQuery = new Query({
        clientId : clientObjId,
        client : clientUser?.name || "clientQuery",
        queryType,
        description,
        photos,
        communications: [
          {
            sender: "client", // Use clientId as sender
            message: description,
            attachments: photos,
            sentAt: new Date(),
          },
        ],
        status: "open",
      });

      const savedQuery = await newQuery.save();

      res.status(201).json({
        success: true,
        data: savedQuery,
        message: "Query Submitted Successfully",
      });
    } catch (error) {
      console.error("Error in createQuery:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to Submit Query",
        error: error.message,
      });
    }
  },

  getClientQueries: async (req, res) => {
    const { clientId } = req.params;

    try {
      const queries = await Query.find({ clientId })
        .sort({ createdAt: -1 })
        .lean(); // Convert to plain JS objects


      // Ensure photos are properly formatted
      const formattedQueries = queries.map((query) => ({
        ...query,
        photos: Array.isArray(query.photos) ? query.photos : [],
        communications: Array.isArray(query.communications)
          ? query.communications
          : [],
      }));

      res.status(200).json({
        success: true,
        data: formattedQueries,
        message: "Queries Fetched Successfully",
      });
    } catch (error) {
      console.error("Error in getClientQueries:", error);
      res.status(500).json({
        success: false,
        message: "Failed to Fetch Queries",
        error: error.message,
      });
    }
  },

  // Comment: Client replies to admin response
  addClientReply: async (req, res) => {
    try {
      const { queryId } = req.params;
      // Accept both 'replyMessage' and 'message' for compatibility
      const message = req.body.replyMessage || req.body.message;
      const attachments = req.files?.map((file) => file.path) || [];

      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Reply Message is Required",
        });
      }

      const query = await Query.findById(queryId);
      if (!query) {
        return res.status(404).json({
          success: false,
          message: "Query Not Found",
        });
      }

      query.communications.push({
        sender: "client",
        message,
        attachments,
      });

      query.status = "open";
      await query.save();

      res.status(200).json({
        success: true,
        data: query,
        message: "Reply Added Successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to Add Reply",
        error: error.message,
      });
    }
  },
};

module.exports = queryController;