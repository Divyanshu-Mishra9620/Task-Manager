const Task = require("../models/Task");
const SubTask = require("../models/SubTask");
const mongoose = require("mongoose");

// Fetch subtasks for a specific task
exports.getSubtasksByTaskId = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId).populate("subtasks");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task.subtasks);
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Save a subtask for a specific task
exports.saveSubtask = async (req, res) => {
  const { taskId } = req.params;
  const { title, startDate, endDate, assignees, note } = req.body;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task ID format" });
  }

  try {
    // Create and save new subtask
    const newSubtask = new SubTask({
      title,
      startDate,
      endDate,
      assignees,
      note,
      task: taskId,
    });
    await newSubtask.save();

    // Update the parent task with the new subtask reference
    await Task.findByIdAndUpdate(taskId, {
      $push: { subtasks: newSubtask._id },
    });

    res.status(201).json(newSubtask);
  } catch (err) {
    console.error("Error saving subtask:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a subtask
exports.deleteSubtask = async (req, res) => {
  const { taskId, subtaskId } = req.params;

  try {
    // Find the task and ensure it exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Remove the subtask reference from the task
    task.subtasks = task.subtasks.filter(
      (subtask) => subtask.toString() !== subtaskId
    );
    await task.save();

    // Delete the subtask document
    await SubTask.findByIdAndDelete(subtaskId);

    res.json({ message: "Subtask deleted successfully" });
  } catch (error) {
    console.error("Error deleting subtask:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
