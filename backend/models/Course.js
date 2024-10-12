import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({});

export const Course = mongoose.model("Course", CourseSchema);