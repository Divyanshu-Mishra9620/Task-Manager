const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Subtask = require("../models/Subtask");
const {
  getSubtasksByTaskId,
  deleteSubtask,
  saveSubtask,
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
    const { title, note, startDate, endDate, assignees } = req.body;

    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    if (title !== undefined) subtask.title = title;
    if (note !== undefined) subtask.note = note;
    if (startDate !== undefined) subtask.startDate = startDate;
    if (endDate !== undefined) subtask.endDate = endDate;
    if (assignees !== undefined) subtask.assignees = assignees;

    await subtask.save();

    res.status(200).json({ message: "Subtask updated successfully", subtask });
  } catch (error) {
    console.error("Error updating subtask:", error);
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

    const formattedSubtasks = subtasks.map((subtask) => ({
      ...subtask.toObject(),
      startDate: formatDateForFrontend(subtask.startDate),
      endDate: formatDateForFrontend(subtask.endDate),
    }));

    res.status(200).json(formattedSubtasks);
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
