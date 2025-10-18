const Task = require("../../Schema/kanbanBoardTask.schema/kanbanBoardTask.model");
const mongoose = require('mongoose');
const Site = require("../../Schema/site.Schema/site.model");

// Helper function to build query filter with siteId
const buildQueryFilter = (additionalFilters = {}, siteId = null) => {
  const filter = { ...additionalFilters };
  
  if (siteId) {
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
  
  if (data.status && ![ 'todo', 'inprogress', 'done'].includes(data.status)) {
    errors.push('Invalid status value');
  }
  
  return errors;
};

// Get all tasks with optional siteId filtering
exports.getAllTasks = async (req, res) => {
  try {
    const { siteId, status, priority, assignee, isBlocked } = req.query;
    
    let additionalFilters = {};
    if (status) additionalFilters.status = status;
    if (priority) additionalFilters.priority = priority;
    if (assignee) additionalFilters.assignee = new RegExp(assignee, 'i');
    if (isBlocked !== undefined) additionalFilters.isBlocked = isBlocked === 'true';
    
    const filter = buildQueryFilter(additionalFilters, siteId);
    
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate('siteId', 'name siteName')
      .lean();
    
    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
      filters: { siteId, status, priority, assignee, isBlocked }
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

exports.getTasks = async (req,res)=>{
  try {
    const tasks = await Task.find()
    if(tasks.length === 0){
      return res.status(400).send({
        success:false,
        message:"Task Data not found"
      })
    }
    console.log(tasks)
    res.status(200).send({
      success:true,
      message:"Data found",
      data:tasks
    })
  } catch (error) {
    res.status(500).send({
      success:false,
      message:`Internal Server error:- ${error.message}`
    })
  }
}

// Get tasks by status with optional siteId filtering
exports.getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { siteId } = req.query;
    
    if (!['todo', 'inprogress', 'done'].includes(status)) {
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
    console.log("Received task data:", req.body);
    const { 
      title, 
      description, 
      assignee, 
      priority, 
      tags, 
      dueDate, 
      status, 
      siteId, 
      userId,
      assignorName,
      assignorEmail,
      assigneeName,
      assigneeEmail,
      completionPercentage
    } = req.body;
    
    const validationErrors = validateTaskData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    const site = await Site.findById(siteId)

    const taskData = {
      title: title.trim(),
      description: description?.trim() || '',
      assignee: assignee?.trim() || '',
      priority: priority ,
      tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [],
      dueDate: dueDate || null,
      status: status ,
      siteId: new mongoose.Types.ObjectId(siteId),
      siteName:site.siteName,
      assignorName: assignorName?.trim() || '',
      assignorEmail: assignorEmail?.trim() || '',
      assigneeName: assigneeName?.trim() || '',
      assigneeEmail: assigneeEmail?.trim() || '',
      completionPercentage: completionPercentage || 0
    };
    
    const task = new Task(taskData);
    const savedTask = await task.save();
    
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
    
    const validationErrors = validateTaskData(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    let query = { _id: id };
    if (bodySiteId) {
      query.siteId = new mongoose.Types.ObjectId(bodySiteId);
    }
    
    const cleanUpdateData = {};
    if (updateData.title) cleanUpdateData.title = updateData.title.trim();
    if (updateData.description !== undefined) cleanUpdateData.description = updateData.description.trim();
    if (updateData.assignee !== undefined) cleanUpdateData.assignee = updateData.assignee.trim();
    if (updateData.priority) cleanUpdateData.priority = updateData.priority;
    if (updateData.tags) cleanUpdateData.tags = Array.isArray(updateData.tags) ? updateData.tags.filter(tag => tag.trim()) : [];
    if (updateData.dueDate !== undefined) cleanUpdateData.dueDate = updateData.dueDate || null;
    if (updateData.status) cleanUpdateData.status = updateData.status;
    
    // Add blocker fields if provided
    if (updateData.blocker !== undefined) cleanUpdateData.blocker = updateData.blocker.trim();
    if (updateData.blockerDescription !== undefined) cleanUpdateData.blockerDescription = updateData.blockerDescription.trim();
    if (updateData.isBlocked !== undefined) cleanUpdateData.isBlocked = updateData.isBlocked;
    
    // Add assignor and assignee information if provided
    if (updateData.assignorName !== undefined) cleanUpdateData.assignorName = updateData.assignorName.trim();
    if (updateData.assignorEmail !== undefined) cleanUpdateData.assignorEmail = updateData.assignorEmail.trim();
    if (updateData.assigneeName !== undefined) cleanUpdateData.assigneeName = updateData.assigneeName.trim();
    if (updateData.assigneeEmail !== undefined) cleanUpdateData.assigneeEmail = updateData.assigneeEmail.trim();
    if (updateData.completionPercentage !== undefined) cleanUpdateData.completionPercentage = updateData.completionPercentage;
    
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

// Update task blocker
exports.updateTaskBlocker = async (req, res) => {
  try {
    const { id } = req.params;
    const { blocker, blockerDescription } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    
    if (!blocker || blocker.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Blocker title is required'
      });
    }
    
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }
    
    // Update blocker fields
    task.blocker = blocker.trim();
    task.blockerDescription = blockerDescription?.trim() || '';
    task.isBlocked = true;
    task.blockerAddedAt = new Date();
    task.updatedAt = new Date();
    
    const updatedTask = await task.save();
    await updatedTask.populate('siteId', 'name siteName');
    
    res.status(200).json({
      success: true,
      message: 'Task blocker updated successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error('Error updating task blocker:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Failed to update task blocker', 
      error: error.message 
    });
  }
};

// Resolve task blocker
exports.resolveTaskBlocker = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }
    
    // Clear blocker fields
    task.blocker = '';
    task.blockerDescription = '';
    task.isBlocked = false;
    task.blockerResolvedAt = new Date();
    task.updatedAt = new Date();
    
    const updatedTask = await task.save();
    await updatedTask.populate('siteId', 'name siteName');
    
    res.status(200).json({
      success: true,
      message: 'Task blocker resolved successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error('Error resolving task blocker:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Failed to resolve task blocker', 
      error: error.message 
    });
  }
};

// Get blocked tasks by site
exports.getBlockedTasksBySite = async (req, res) => {
  try {
    const { siteId } = req.params;
    
    if (!siteId || !mongoose.Types.ObjectId.isValid(siteId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid site ID is required'
      });
    }
    
    const tasks = await Task.getBlockedTasksBySite(siteId);
    
    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
      siteId
    });
  } catch (error) {
    console.error('Error fetching blocked tasks:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch blocked tasks', 
      error: error.message 
    });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, siteId, completionPercentage } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    
    if (!status || ![ 'todo', 'inprogress', 'done'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }
    
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
    
    const updateData = { 
      status, 
      updatedAt: new Date() 
    };
    
    if (completionPercentage !== undefined) {
      updateData.completionPercentage = completionPercentage;
    }
    
    const task = await Task.findOneAndUpdate(
      query, 
      updateData, 
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
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    
    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
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
    
    const formattedStats = {};
    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
    });
    
    const allStatuses = [ 'todo', 'inprogress','done'];
    allStatuses.forEach(status => {
      if (!formattedStats[status]) {
        formattedStats[status] = 0;
      }
    });
    
    // Get blocked tasks count
    let blockedMatch = {};
    if (siteId) {
      blockedMatch.siteId = new mongoose.Types.ObjectId(siteId);
    }
    blockedMatch.isBlocked = true;
    
    const blockedCount = await Task.countDocuments(blockedMatch);
    formattedStats.blocked = blockedCount;
    
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
    
    const formattedStats = {};
    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
    });
    
    const allStatuses = ['todo', 'inprogress','done'];
    allStatuses.forEach(status => {
      if (!formattedStats[status]) {
        formattedStats[status] = 0;
      }
    });
    
    // Get blocked tasks count for the site
    const blockedCount = await Task.countDocuments({ 
      siteId: new mongoose.Types.ObjectId(siteId),
      isBlocked: true 
    });
    formattedStats.blocked = blockedCount;
    
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

// Update task progress and status
exports.updateTaskProgressAndStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { completionPercentage, status } = req.body;
    console.log(id,completionPercentage, status)

    const task = await Task.findOneAndUpdate(
      { _id: id }, 
      { 
        completionPercentage, 
        status,
        updatedAt: new Date() 
      }, 
      { new: true, runValidators: true }
    ).populate('siteId', 'name siteName');
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Task progress and status updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Error updating task progress and status:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Failed to update task progress and status', 
      error: error.message 
    });
  }
};