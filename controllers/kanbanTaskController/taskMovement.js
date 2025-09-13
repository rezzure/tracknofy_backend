// const express = require('express');
const mongoose = require('mongoose');
const TaskMovement = require('../../Schema/taskMovement.schema/taskMovement.model'); // Adjust path as needed
const User = require('../../Schema/users.schema/users.model');
const Task = require('../../Schema/kanbanBoardTask.schema/kanbanBoardTask.model');
// const router = express.Router();

exports.getMovementById = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    // Validate taskId format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }
    
    const movements = await TaskMovement.find({ taskId })
      .sort({ timestamp: -1 }) // Most recent first
      .populate('movedBy', 'name email') // Populate user details if needed
      .lean();
    
    res.status(200).json({
      success: true,
      data: movements,
      message: 'Movement history retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching task movements:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve movement history' 
    });
  }
}


exports.getMovementBySiteId = async (req, res) => {
  try {
    const { siteId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    // Validate siteId format
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
      return res.status(400).json({ message: 'Invalid site ID format' });
    }
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { timestamp: -1 },
      populate: [
        { path: 'taskId', select: 'title' },
        { path: 'movedBy', select: 'name email' }
      ]
    };
    
    // Using pagination for potentially large datasets
    const movements = await TaskMovement.aggregatePaginate(
      { siteId }, 
      options
    );
    
    res.status(200).json({
      success: true,
      data: movements,
      message: 'Site movement history retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching site movements:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve site movement history' 
    });
  }
}



exports.recordNewMovement = async (req, res) => {
  try {
    const { taskId, fromColumn, toColumn, movedBy, siteId} = req.body;
    console.log(taskId, fromColumn, toColumn, movedBy, siteId)
    
    // Validate required fields
    if (!taskId || !fromColumn || !toColumn || !movedBy || !siteId) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: taskId, fromColumn, toColumn, movedBy, siteId' 
      });
    }
    
    // Validate ObjectId formats
    if (!mongoose.Types.ObjectId.isValid(taskId) || 
        !mongoose.Types.ObjectId.isValid(movedBy) || 
        !mongoose.Types.ObjectId.isValid(siteId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid ID format provided' 
      });
    }
    
    // Validate status values
    const validStatuses = ['backlog', 'todo', 'inprogress', 'review', 'done', 'none'];
    if (!validStatuses.includes(fromColumn) || !validStatuses.includes(toColumn)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status value provided' 
      });
    }
    
    const user = await User.findById(movedBy)
    const task = await Task.findById(taskId)
    // Create new movement record
    const movement = new TaskMovement({
      taskId,
      taskTitle: task.title || 'Untitled Task', // You might want to fetch this if not provided
      fromStatus: fromColumn,
      toStatus: toColumn,
      movedBy,
      movedByName:user.name,
      siteId
    });
    
    await movement.save();
    
    res.status(201).json({
      success: true,
      data: movement,
      message: 'Task movement logged successfully'
    });
  } catch (error) {
    console.error('Error logging task movement:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to log task movement' 
    });
  }
}


exports.getMovementStatsBySiteId = async (req, res) => {
  try {
    const { siteId } = req.params;
    const { days = 30 } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
      return res.status(400).json({ message: 'Invalid site ID format' });
    }
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Get movement counts by status
    const statusCounts = await TaskMovement.aggregate([
      {
        $match: {
          siteId: mongoose.Types.ObjectId(siteId),
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$toStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get daily movement trends
    const dailyTrends = await TaskMovement.aggregate([
      {
        $match: {
          siteId: mongoose.Types.ObjectId(siteId),
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            status: '$toStatus'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        statusCounts,
        dailyTrends
      },
      message: 'Movement statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching movement statistics:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve movement statistics' 
    });
  }
}
