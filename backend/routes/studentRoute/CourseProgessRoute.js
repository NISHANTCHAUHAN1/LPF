import express from "express";
import { getCurrentCourseProgress, markCurrentLectureAsViewed, resetCurrentCourseProgress } from "../../controllers/studentController/CourseProgressCont.js";

const router = express.Router();

router.post("/mark-lecture-viewed", markCurrentLectureAsViewed);
router.get("/get/:userId/:courseId", getCurrentCourseProgress);
router.post("/reset-progress", resetCurrentCourseProgress);

export default router;