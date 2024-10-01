import express from "express";
import UserController from "./user.controller.js";
import checkedLogin from "../../middleware/checkLogin.middleware.js";
import adminProtectorMiddleware from "../../middleware/adminProtect.middleware.js";

const userRouter = express.Router();
const userController = new UserController();

//====== user signup router ========//
userRouter.post("/signup", (req, res, next)=>{
    userController.signup(req, res, next);
});

//====== user signin router ========//
userRouter.post("/signin", (req, res, next)=>{
    userController.signin(req, res, next);
});

//====== user logout router =========//
userRouter.get("/logout", (req, res, next)=>{
    userController.logout(req, res, next);
});

//===== get all users ================//
userRouter.get("/getUsers", adminProtectorMiddleware, (req, res, next)=>{
    userController.getUsers(req, res, next);
})

//== check is loggedIn ===================//
userRouter.get("/isLogin", checkedLogin, (req,res)=>{
    console.log("User cheked loggin called!");
})


export default userRouter;