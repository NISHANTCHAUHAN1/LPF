import express from "express";
import { getCoursesByStudentId } from "../../controllers/studentController/studentBuyCourseCont.js";

const router = express.Router();

router.get("/get/:studentId", getCoursesByStudentId);

export default router;