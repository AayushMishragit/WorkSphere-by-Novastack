import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import workspaceRouter from "./routes/workSpace.routes.js";
import projectRouter from "./routes/project.routes.js";
import { protect } from "../server/Middlewares/auth.middlewares.js";
import taskRouter from "./routes/task.routes.js";
import commentrouter from "./routes/comment.routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("Server is in Running State"));

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));
//Routes

app.use("/apiworkspaces", protect, workspaceRouter);
app.use("/api/projects", protect, projectRouter);
app.use("/api/tasks", protect, taskRouter);
app.use("/api/comments", protect, commentrouter);
app.use((err, req, res, next) => {
  console.error("ERR:", err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on the port ${PORT}`));
