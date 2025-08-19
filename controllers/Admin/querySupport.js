const Client = require("../../Schema/client.schema/client.model");
const Query = require("../../Schema/query.schema/query.model");
const User = require("../../Schema/users.schema/users.model");



const getAllQueries = async (req, res) => {
  try {
    // Comment: Fetch all queries (no populate for now, as client info not set up)
    const queries = await Query.find().sort({ createdAt: -1 });
    console.log(queries)
    res.status(200).json({
      success: true,
      count: queries.length,
      data: queries,
    });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching queries",
    });
  }
};

// /**
//  * @desc    Update a query with admin response
//  * @route   PATCH /api/queries/:id
//  * @access  Private/Admin
//  */

const responseQuery = async (req, res) => {
  try {
    // Extract data from request
    const { queryId } = req.params;
    const { communications, status } = req.body;

    // Validate required fields
    if (
      !communications ||
      !Array.isArray(communications) ||
      communications.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one communication is required",
      });
    }

    // Find the query
    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    // Append new communications to existing array
    query.communications = Array.isArray(query.communications)
      ? [...query.communications, ...communications]
      : [...communications];

    // Optionally update status
    if (status) {
      query.status = status;
    }
    query.respondedAt = Date.now();

    await query.save();
  

    // Only create notification if client._id is a valid ObjectId
    const isValidObjectId = (id) => {
      return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
    };

    if (query.client && isValidObjectId(query.client._id?.toString())) {
        await Notification.create({
        recipient: query.client,
        recipientModel: "Client",
        title: "Query Response",
        message: `Admin has responded to your query about "${query.queryType}"`,
        type: "response",
        relatedEntityType: "Query",
        relatedEntityId: query._id,
      });
    }

    res.status(200).json({
      success: true,
      data: query,
      message: "Query updated successfully",
    });
  } catch (error) {
    console.error("Error updating query:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating query",
    });
  }
};

// /**
//  * @desc    Get queries for a specific client
//  * @route   GET /api/queries/client/:clientId
//  * @access  Private
//  */

const getClientQueries = async (req, res) => {
  try {
    // Comment: Validate client ID from params
    const { clientId } = req.params;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    // Comment: Fetch only queries belonging to this client
    const queries = await Query.find({ client: clientId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: queries.length,
      data: queries,
    });
  } catch (error) {
    console.error("Error fetching client queries:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching client queries",
    });
  }
};

// /**
//  * @desc    Delete a query
//  * @route   DELETE /api/queries/:id
//  * @access  Private/Admin
//  */
const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;

    // Comment: Find and delete the query
    const deletedQuery = await Query.findByIdAndDelete(id);

    if (!deletedQuery) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: "Query deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting query:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting query",
    });
  }
};

module.exports = {
  deleteQuery,
  getClientQueries,
  responseQuery,
  getAllQueries,
};