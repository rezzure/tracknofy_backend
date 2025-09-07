const TracknofyBoard = require("../../Schema/TracknofyBoard.schema/tracknofyBoard.model");

// ✅ Add Task
const addTodo = async (req, res) => {
  try {
    const { taskName, description, status } = req.body;
    console.log(req.body);
    if (!taskName || !description) {
      return res.status(400).json({
        success: false,
        message: "Task Name, Description, and Updated By are required fields",
      });
    }

    const newTodo = new TracknofyBoard({
      taskName: taskName.trim(),
      description: description.trim(),
    //   updatedBy: updatedBy.trim(),
    //   status: status || "To Do",
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    });

    await newTodo.save();

    return res.status(201).json({
      success: true,
      message: "To-Do item added successfully",
      data: newTodo,
    });
  } catch (error) {
    console.error("❌ Error adding To-Do:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Get All Tasks
const getTodos = async (req, res) => {
  try {
    const todos = await TracknofyBoard.find().sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    console.error("❌ Error fetching To-Dos:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Get Single Task by ID
const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await TracknofyBoard.findById(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error("❌ Error fetching single To-Do:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Update Task
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskName, description, updatedBy, status } = req.body;

    const updatedTodo = await TracknofyBoard.findByIdAndUpdate(
      id,
      {
        ...(taskName && { taskName: taskName.trim() }),
        ...(description && { description: description.trim() }),
        ...(updatedBy && { updatedBy: updatedBy.trim() }),
        ...(status && { status }),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    console.error("❌ Error updating To-Do:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Delete Task
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await TracknofyBoard.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting To-Do:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  addTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
