import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./src/core/users/user.router.js";
import { errorHandler } from "./src/middleware/errorHandler.middleware.js";
import connectMongodb from "./src/config/connectMongodb.js";
import taskRouter from "./src/core/tasks/task.router.js";


//====== create server =======//
const app = express();

//===== used middleware for parsing req.body ======//
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

//====== setup cors =======//
const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true,
  };

  app.use(cors(corsOptions))


//======= setup differnt routes for diddrent feature ========//
app.use("/api/users", userRouter);

app.use("/api/tasks", taskRouter);

//======== for the root route get request =========//
app.get("/", (req,res,next)=>{
    res.status(200).send("welcome to our task managements application!");

})


//======== error handler miidleware ================//
app.use(errorHandler);

const port = process.env.PORT || 3200;

app.listen(port, ()=>{
    console.log(`Server is listening on port: ${port}`);
    connectMongodb()
})