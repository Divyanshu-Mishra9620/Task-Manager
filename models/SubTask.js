const mongoose = require("mongoose");

const SubtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  assignees: [{ type: String }],
  note: { type: String },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
});

module.exports =
  mongoose.models.Subtask || mongoose.model("Subtask", SubtaskSchema);
