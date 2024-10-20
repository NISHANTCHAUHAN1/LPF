import express from "express";
import { getCurrentCourseProgress } from "../../controllers/studentController/CourseProgressCont.js";

const router = express.Router();

router.get("/get/:userId/:courseId", getCurrentCourseProgress);

export default router;