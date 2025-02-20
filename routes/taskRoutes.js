const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Subtask = require("../models/SubTask");
const {
  getSubtasksByTaskId,
  saveSubtask,
  deleteSubtask,
} = require("../controllers/taskController");

// =============================
//        TASK ROUTES
// =============================

router.post("/", async (req, res) => {
  try {
    const { title, type } = req.body;
    const newTask = new Task({ title, type, subtasks: [] });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("subtasks");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// =============================
//        SUBTASK ROUTES
// =============================

router.get("/:taskId/subtasks", getSubtasksByTaskId);

router.post("/:taskId/subtasks", saveSubtask);

router.delete("/:taskId/subtasks/:subtaskId", deleteSubtask);

router.put("/:taskId/subtasks/:subtaskId", async (req, res) => {
  try {
    const { subtaskId } = req.params;
    const { note } = req.body;

    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    subtask.note = note;
    await subtask.save();

    res.status(200).json({ message: "Note updated successfully", subtask });
  } catch (error) {
    console.error("Error updating subtask note:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/subtasks/details", async (req, res) => {
  try {
    const { subtaskIds } = req.body;

    if (!Array.isArray(subtaskIds) || subtaskIds.length === 0) {
      return res.status(400).json({ message: "Invalid subtask IDs" });
    }

    const subtasks = await Subtask.find({ _id: { $in: subtaskIds } });
    res.status(200).json(subtasks);
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
