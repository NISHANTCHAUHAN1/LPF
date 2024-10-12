import { Course } from "../../models/Course.js";

export const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const newlyCreatedCourse = new Course(courseData);
    const saveCourse = await newlyCreatedCourse.save();

    if (saveCourse) {
      res.status(201).json({
        success: true,
        message: "Course saved successfully",
        data: saveCourse,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});

    res.status(200).json({ success: true, data: coursesList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

export const getCourseDetails = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

export const updateCourseByID = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};
