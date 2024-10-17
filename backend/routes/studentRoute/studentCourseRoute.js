import express from "express";
import {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
} from "../../controllers/studentController/studentCourse.js";

const router = express.Router();

router.get("/get", getAllStudentViewCourses);
router.get("/get/details/:id", getStudentViewCourseDetails);

export default router;
