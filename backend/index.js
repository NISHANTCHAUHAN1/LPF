import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./Database/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

// app.use(cors());
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
import mediaRoutes from './routes/instructorRoutes/mediaRoutes.js'

app.use("/auth", authRoute);
app.use("/media", mediaRoutes);


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
