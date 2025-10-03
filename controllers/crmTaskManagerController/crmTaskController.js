const CRMTask = require("../../Schema/crmTaskManager.schema/crmTaskManager.model");

// 📌 Create Task
const createTask = async (req, res) => {
  try {
    const task = new CRMTask(req.body);
    await task.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get All Tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await CRMTask.find().populate("assignee", "name email role");
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update Task Status
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await CRMTask.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Task status updated", data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update Task (priority or other fields)
const updateTask = async (req, res) => {
  try {
    const task = await CRMTask.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Task updated", data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await CRMTask.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Exporting with CommonJS
module.exports = {
  createTask,
  getAllTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
};
