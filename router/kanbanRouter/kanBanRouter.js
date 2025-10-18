const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/kanbanTaskController/taskController');
const verification = require('../../middleware/verification');
const taskMovement = require("../../controllers/kanbanTaskController/taskMovement")

// Get all tasks (with optional siteId filtering)
router.get('/get/tasks', taskController.getAllTasks);
router.get('/get/allTasks', taskController.getTasks);

// Get tasks by status (with optional siteId filtering)
router.get('/get/tasks/status/:status', taskController.getTasksByStatus);

// Get task by ID
router.get('/get/task/:id', taskController.getTaskById);

// Create a new task
router.post('/create/task', taskController.createTask);

// Update a task
router.put('/update/task/:id', taskController.updateTask);

// Update task blocker
router.patch('/update/task/:id/blocker', taskController.updateTaskBlocker);

// Resolve task blocker
router.patch('/resolve/task/:id/blocker', taskController.resolveTaskBlocker);

// Get blocked tasks by site
router.get('/get/blocked-tasks/site/:siteId', taskController.getBlockedTasksBySite);

// Update task status
router.patch('/update/task/status/:id', taskController.updateTaskStatus);

router.patch('/update-progress-status/:id', taskController.updateTaskProgressAndStatus);

// Delete a task
router.delete('/delete/task/:id', taskController.deleteTask);

// Get tasks statistics (with optional siteId filtering)
router.get('/get/stats/summary', taskController.getTasksStatistics);

// Additional site-specific routes
router.get('/get/tasks/site/:siteId', taskController.getTasksBySite);
router.get('/get/stats/site/:siteId', taskController.getSiteTaskStatistics);

// task movement routers

// Get all movement history for a specific task
router.get('/get/task-movements/:taskId',verification,taskMovement.getMovementById)

// Get movement history for a specific site
router.get('/site-movements/:siteId',verification,taskMovement.getMovementBySiteId)

// Log a new task movement
router.post('/log/task-movement',verification,taskMovement.recordNewMovement)

// Get movement statistics for a site
router.get('/movement-stats/:siteId',verification , taskMovement.getMovementStatsBySiteId)

module.exports = router;