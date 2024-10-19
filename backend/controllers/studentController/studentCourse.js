// course controller
import { Course } from "../../models/Course.js";
import { StudentCourses } from "../../models/StudentCourses.js";

export const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = "",
      level = "",
      primaryLanguage = "",
      sortBy = "price-lowtohigh",
    } = req.query;

    let filters = {};
    // Check and apply category filter
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    // Check and apply level filter
    if (level.length) {
      filters.level = { $in: level.split(",") };
    }
    // Check and apply primaryLanguage filter
    if (primaryLanguage.length) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    // Define sorting parameters based on sortBy query
    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.pricing = 1; // Ascending
        break;
      case "price-hightolow":
        sortParam.pricing = -1; // Descending
        break;
      case "title-atoz":
        sortParam.title = 1; // A to Z
        break;
      case "title-ztoa":
        sortParam.title = -1; // Z to A
        break;
      default:
        sortParam.pricing = 1; // Default sorting
        break;
    }

    // Fetch courses with applied filters and sorting
    const coursesList = await Course.find(filters).sort(sortParam);

    // Return the courses found
    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

export const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// check the current student purchased a course or not 
export const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const studentCourses = await StudentCourses.findOne({ userId: studentId });

    const ifStudentAlreadyBoughtCurrentCourse =
      studentCourses.courses.findIndex((item) => item.courseId === id) > -1;
    res
      .status(200)
      .json({ success: true, data: ifStudentAlreadyBoughtCurrentCourse });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
