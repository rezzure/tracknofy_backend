// const Task = require("../../Schema/kanbanBoardTask.schema/kanbanBoardTask.model");


// // Get all tasks
// exports.getAllTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find().sort({ createdAt: -1 });
//     res.status(200).json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get tasks by status
// exports.getTasksByStatus = async (req, res) => {
//   try {
//     const { status } = req.params;
//     const tasks = await Task.find({ status }).sort({ createdAt: -1 });
//     res.status(200).json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a single task by ID
// exports.getTaskById = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }
//     res.status(200).json(task);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Create a new task
// exports.createTask = async (req, res) => {
//   try {
//     const taskData = {
//       title: req.body.title,
//       description: req.body.description,
//       assignee: req.body.assignee,
//       priority: req.body.priority,
//       tags: req.body.tags,
//       dueDate: req.body.dueDate,
//       status: req.body.status || 'backlog'
//     };

//     const task = new Task(taskData);
//     const savedTask = await task.save();
//     res.status(201).json(savedTask);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Update a task
// exports.updateTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = { ...req.body, updatedAt: Date.now() };
    
//     const task = await Task.findByIdAndUpdate(id, updateData, { 
//       new: true, 
//       runValidators: true 
//     });
    
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }
    
//     res.status(200).json(task);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Update task status
// exports.updateTaskStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
    
//     const task = await Task.findByIdAndUpdate(
//       id, 
//       { status, updatedAt: Date.now() }, 
//       { new: true, runValidators: true }
//     );
    
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }
    
//     res.status(200).json(task);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a task
// exports.deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findByIdAndDelete(req.params.id);
    
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }
    
//     res.status(200).json({ message: 'Task deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get tasks statistics
// exports.getTasksStatistics = async (req, res) => {
//   try {
//     const stats = await Task.aggregate([
//       {
//         $group: {
//           _id: '$status',
//           count: { $sum: 1 }
//         }
//       }
//     ]);
    
//     // Format the statistics
//     const formattedStats = {};
//     stats.forEach(stat => {
//       formattedStats[stat._id] = stat.count;
//     });
    
//     // Ensure all statuses are represented
//     const allStatuses = ['backlog', 'todo', 'inprogress', 'review', 'done'];
//     allStatuses.forEach(status => {
//       if (!formattedStats[status]) {
//         formattedStats[status] = 0;
//       }
//     });
    
//     res.status(200).json(formattedStats);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

















const Task = require("../../Schema/kanbanBoardTask.schema/kanbanBoardTask.model");
const mongoose = require('mongoose');

// Helper function to build query filter with siteId
const buildQueryFilter = (additionalFilters = {}, siteId = null) => {
  const filter = { ...additionalFilters };
  
  // Add siteId filter if provided
  if (siteId) {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
      throw new Error('Invalid site ID format');
    }
    filter.siteId = new mongoose.Types.ObjectId(siteId);
  }
  
  return filter;
};

// Helper function to validate required fields
const validateTaskData = (data, isUpdate = false) => {
  const errors = [];
  
  if (!isUpdate && !data.title) {
    errors.push('Title is required');
  }
  
  if (!isUpdate && !data.siteId) {
    errors.push('Site ID is required');
  }
  
  if (data.siteId && !mongoose.Types.ObjectId.isValid(data.siteId)) {
    errors.push('Invalid site ID format');
  }
  
  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Priority must be low, medium, or high');
  }
  
  if (data.status && !['backlog', 'todo', 'inprogress', 'review', 'done'].includes(data.status)) {
    errors.push('Invalid status value');
  }
  
  return errors;
};

// Get all tasks with optional siteId filtering
exports.getAllTasks = async (req, res) => {
  try {
    const { siteId, status, priority, assignee } = req.query;
    
    // Build filter object
    let additionalFilters = {};
    if (status) additionalFilters.status = status;
    if (priority) additionalFilters.priority = priority;
    if (assignee) additionalFilters.assignee = new RegExp(assignee, 'i');
    
    const filter = buildQueryFilter(additionalFilters, siteId);
    
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate('siteId', 'name siteName') // Populate site info if needed
      .lean();
    
    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
      filters: { siteId, status, priority, assignee }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message.includes('Invalid site ID') ? error.message : 'Failed to fetch tasks', 
      error: error.message 
    });
  }
};

// Get tasks by status with optional siteId filtering
exports.getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { siteId } = req.query;
    
    // Validate status
    if (!['backlog', 'todo', 'inprogress', 'review', 'done'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const filter = buildQueryFilter({ status }, siteId);
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate('siteId', 'name siteName')
      .lean();
    
    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
      status,
      siteId: siteId || null
    });
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message.includes('Invalid site ID') ? error.message : 'Failed to fetch tasks by status', 
      error: error.message 
    });
  }
};

// Get tasks by site ID
exports.getTasksBySite = async (req, res) => {
  try {
    const { siteId } = req.params;
    
    if (!siteId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Site ID is required' 
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid site ID format'
      });
    }
    
    const tasks = await Task.find({ siteId: new mongoose.Types.ObjectId(siteId) })
      .sort({ createdAt: -1 })
      .populate('siteId', 'name siteName')
      .lean();
    
    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
      siteId
    });
  } catch (error) {
    console.error('Error fetching tasks by site:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch tasks for site', 
      error: error.message 
    });
  }
};

// Get a single task by ID with optional siteId validation
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const { siteId } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    
    // Build query - include siteId filter if provided
    let query = { _id: id };
    if (siteId) {
      if (!mongoose.Types.ObjectId.isValid(siteId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid site ID format'
        });
      }
      query.siteId = new mongoose.Types.ObjectId(siteId);
    }
    
    const task = await Task.findOne(query)
      .populate('siteId', 'name siteName')
      .lean();
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch task', 
      error: error.message 
    });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignee, priority, tags, dueDate, status, siteId, userId } = req.body;
    
    // Validate required fields and data format
    const validationErrors = validateTaskData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    const taskData = {
      title: title.trim(),
      description: description?.trim() || '',
      assignee: assignee?.trim() || '',
      priority: priority || 'medium',
      tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [],
      dueDate: dueDate || null,
      status: status || 'backlog',
      siteId: new mongoose.Types.ObjectId(siteId)
    };
    
    // Add userId if provided
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      taskData.userId = new mongoose.Types.ObjectId(userId);
    }
    
    const task = new Task(taskData);
    const savedTask = await task.save();
    
    // Populate the site info for response
    await savedTask.populate('siteId', 'name siteName');
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: savedTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Failed to create task', 
      error: error.message 
    });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { siteId: bodySiteId, ...updateData } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    
    // Validate update data
    const validationErrors = validateTaskData(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Build query - include siteId verification if provided
    let query = { _id: id };
    if (bodySiteId) {
      query.siteId = new mongoose.Types.ObjectId(bodySiteId);
    }
    
    // Clean and prepare update data
    const cleanUpdateData = {};
    if (updateData.title) cleanUpdateData.title = updateData.title.trim();
    if (updateData.description !== undefined) cleanUpdateData.description = updateData.description.trim();
    if (updateData.assignee !== undefined) cleanUpdateData.assignee = updateData.assignee.trim();
    if (updateData.priority) cleanUpdateData.priority = updateData.priority;
    if (updateData.tags) cleanUpdateData.tags = Array.isArray(updateData.tags) ? updateData.tags.filter(tag => tag.trim()) : [];
    if (updateData.dueDate !== undefined) cleanUpdateData.dueDate = updateData.dueDate || null;
    if (updateData.status) cleanUpdateData.status = updateData.status;
    
    cleanUpdateData.updatedAt = new Date();
    
    const task = await Task.findOneAndUpdate(query, cleanUpdateData, { 
      new: true, 
      runValidators: true 
    }).populate('siteId', 'name siteName');
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found or access denied' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Failed to update task', 
      error: error.message 
    });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, siteId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    
    if (!status || !['backlog', 'todo', 'inprogress', 'review', 'done'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }
    
    // Build query - include siteId verification if provided
    let query = { _id: id };
    if (siteId) {
      if (!mongoose.Types.ObjectId.isValid(siteId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid site ID format'
        });
      }
      query.siteId = new mongoose.Types.ObjectId(siteId);
    }
    
    const task = await Task.findOneAndUpdate(
      query, 
      { status, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    ).populate('siteId', 'name siteName');
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found or access denied' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Failed to update task status', 
      error: error.message 
    });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { siteId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    
    // Build query - include siteId verification if provided
    let query = { _id: id };
    if (siteId) {
      if (!mongoose.Types.ObjectId.isValid(siteId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid site ID format'
        });
      }
      query.siteId = new mongoose.Types.ObjectId(siteId);
    }
    
    const task = await Task.findOneAndDelete(query);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found or access denied' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Task deleted successfully',
      data: { deletedTaskId: id }
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete task', 
      error: error.message 
    });
  }
};

// Get tasks statistics with optional siteId filtering
exports.getTasksStatistics = async (req, res) => {
  try {
    const { siteId } = req.query;
    
    let matchStage = {};
    if (siteId) {
      if (!mongoose.Types.ObjectId.isValid(siteId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid site ID format'
        });
      }
      matchStage.siteId = new mongoose.Types.ObjectId(siteId);
    }
    
    const pipeline = [];
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }
    
    pipeline.push({
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    });
    
    const stats = await Task.aggregate(pipeline);
    
    // Format the statistics
    const formattedStats = {};
    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
    });
    
    // Ensure all statuses are represented
    const allStatuses = ['backlog', 'todo', 'inprogress', 'review', 'done'];
    allStatuses.forEach(status => {
      if (!formattedStats[status]) {
        formattedStats[status] = 0;
      }
    });
    
    res.status(200).json({
      success: true,
      data: formattedStats,
      siteId: siteId || null
    });
  } catch (error) {
    console.error('Error fetching task statistics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch task statistics', 
      error: error.message 
    });
  }
};

// Get site-specific task statistics
exports.getSiteTaskStatistics = async (req, res) => {
  try {
    const { siteId } = req.params;
    
    if (!siteId || !mongoose.Types.ObjectId.isValid(siteId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid site ID is required'
      });
    }
    
    const stats = await Task.getStatsBySite(siteId);
    
    // Format the statistics
    const formattedStats = {};
    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
    });
    
    // Ensure all statuses are represented
    const allStatuses = ['backlog', 'todo', 'inprogress', 'review', 'done'];
    allStatuses.forEach(status => {
      if (!formattedStats[status]) {
        formattedStats[status] = 0;
      }
    });
    
    // Get total count
    const totalTasks = Object.values(formattedStats).reduce((sum, count) => sum + count, 0);
    
    res.status(200).json({
      success: true,
      data: {
        statistics: formattedStats,
        totalTasks,
        siteId
      }
    });
  } catch (error) {
    console.error('Error fetching site task statistics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch site task statistics', 
      error: error.message 
    });
  }
};