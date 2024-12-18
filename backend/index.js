import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./Database/db.js";
import path from "path";
import { fileURLToPath } from 'url';


dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//using middleweares
app.use(express.json()); // data pass for register and login
app.use(cookieParser()); // npm cookie cookies pass for profile

// import routing
import authRoute from './routes/authRoute/index.js';
import mediaRoutes from './routes/instructorRoutes/mediaRoutes.js';
import courseRoutes from './routes/instructorRoutes/courseRoutes.js';
import studentCourseRoutes from './routes/studentRoute/studentCourseRoute.js';
import orderRoutes from './routes/studentRoute/orderRoute.js';
import buyCourseRoutes from './routes/studentRoute/buyCoursrRoute.js';
import CourseProgressRoutes from './routes/studentRoute/CourseProgessRoute.js';

app.use("/auth", authRoute);
app.use("/media", mediaRoutes);
app.use("/instructor/course", courseRoutes);
app.use("/student/course", studentCourseRoutes);
app.use("/student/order", orderRoutes);
app.use("/student/courses-bought", buyCourseRoutes);
app.use("/student/course-progress", CourseProgressRoutes);


app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
});



app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});
