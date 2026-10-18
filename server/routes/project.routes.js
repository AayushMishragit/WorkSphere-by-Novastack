import express from "express";
import {
  addMember,
  createProject,
  updateProject,
} from "../controllers/project.Controllers.js";

const projectRouter = express.Router();

projectRouter.post("/", createProject);
projectRouter.put("/", updateProject);
projectRouter.post("/:projectId/addMember", addMember);
