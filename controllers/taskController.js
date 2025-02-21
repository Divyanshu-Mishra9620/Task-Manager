const Task = require("../models/Task");
const Subtask = require("../models/Subtask");
const mongoose = require("mongoose");

exports.getSubtasksByTaskId = async (req, res) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task ID format" });
  }

  try {
    const task = await Task.findById(taskId).populate("subtasks");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task.subtasks || []);
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.saveSubtask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, startDate, endDate, assignees, note } = req.body;

    console.log("📥 Received Subtask Data:", req.body);

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      console.log("🚫 Invalid Task ID:", taskId);
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      console.log("🚫 Task not found:", taskId);
      return res.status(404).json({ message: "Task not found" });
    }

    const newSubtask = new Subtask({
      title,
      startDate,
      endDate,
      assignees,
      note,
      task: taskId,
    });
    await newSubtask.save();

    task.subtasks.push(newSubtask._id);
    await task.save();

    console.log("✅ Subtask added successfully:", newSubtask);
    res
      .status(201)
      .json({ message: "Subtask added successfully", subtask: newSubtask });
  } catch (error) {
    console.error("❌ Error in saveSubtask:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.deleteSubtask = async (req, res) => {
  const { taskId, subtaskId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(taskId) ||
    !mongoose.Types.ObjectId.isValid(subtaskId)
  ) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    await Task.findByIdAndUpdate(taskId, {
      $pull: { subtasks: subtaskId },
    });

    await Subtask.findByIdAndDelete(subtaskId);

    res.json({ message: "Subtask deleted successfully" });
  } catch (error) {
    console.error("Error deleting subtask:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
