const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ["To Do", "In Progress", "Completed", "Backlog"],
    required: true,
  },
  subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subtask" }],
});

module.exports = mongoose.model("Task", TaskSchema);
