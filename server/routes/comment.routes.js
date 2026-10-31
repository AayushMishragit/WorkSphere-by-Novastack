import express from "express";
import {
  addComment,
  getTaskComments,
} from "../controllers/Comment.controllers.js";

const commentrouter = express.Router();

commentrouter.post("/", addComment);
commentrouter.get("/:taskId", getTaskComments);

export default commentrouter;
