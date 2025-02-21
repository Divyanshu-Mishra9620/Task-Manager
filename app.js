const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const Task = require("./models/Task");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://task-manager-frontend-7dms.vercel.app",
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/api/tasks", taskRoutes);

async function createDefaultTasks() {
  try {
    const existingTasks = await Task.countDocuments();
    if (existingTasks === 0) {
      const defaultTasks = [
        { title: "To Do", type: "To Do", subtasks: [] },
        { title: "In Progress", type: "In Progress", subtasks: [] },
        { title: "Completed", type: "Completed", subtasks: [] },
        { title: "Backlog", type: "Backlog", subtasks: [] },
      ];
      await Task.insertMany(defaultTasks);
      console.log("✅ Default tasks added to the database");
    } else {
      console.log("ℹ️ Default tasks already exist");
    }
  } catch (error) {
    console.error("❌ Error initializing default tasks:", error);
  }
}
createDefaultTasks();

module.exports = app;
