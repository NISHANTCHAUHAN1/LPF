import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from 'cors';
import connectDb from './Database/db.js';


dotenv.config();

const app = express();

const port = process.env.PORT || 5000;


app.use(cors());


//using middleweares
app.use(express.json());  // data pass for register and login
app.use(cookieParser());  // npm cookie cookies pass for profile
 
// import routing


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
})