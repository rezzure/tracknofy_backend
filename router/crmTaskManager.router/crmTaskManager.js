const express = require("express");
const {
  createTask,
  getAllTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
} = require("../../controllers/crmTaskManagerController/crmTaskController");

const router = express.Router();

router.post("/crm/create/task", createTask);
router.get("/crm/get/allTasks", getAllTasks);
router.patch("/crm/update/task/status/:id", updateTaskStatus);
router.put("/crm/update/task/:id", updateTask);
router.delete("/crm/delete/task/:id", deleteTask);

module.exports = router;
