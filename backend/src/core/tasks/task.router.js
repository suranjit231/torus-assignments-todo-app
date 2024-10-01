import express from "express";
import TaskController from "./task.controller.js";
import adminProtect from "../../middleware/adminProtect.middleware.js";
import auth from "../../middleware/jwtAuth.middleware.js";

const taskRouter = express.Router();
const taskController = new TaskController();

//===== add new task router ===================//
taskRouter.post("/addTask", adminProtect, (req, res, next)=>{
    taskController.addTask(req, res, next);
})

//====== getAllTask by admin router ========//
taskRouter.get("/getTaskByAdmin", adminProtect, (req, res, next)=>{
    taskController.getAllTaskByAdmin(req, res, next);
});

//========== update task =======================//
taskRouter.put("/updateTask/:taskId", adminProtect, (req, res, next)=>{
    taskController.updateTask(req, res, next);
});

//======== deteta task router ==================//
taskRouter.delete("/deleteTask/:taskId", adminProtect, (req, res, next)=>{
    console.log("delete task clled: ", req.params);
    taskController.deleteTask(req, res, next);
})

//====== getAllTask by users =================//
taskRouter.get("/getTaskByUsers", auth, (req, res, next)=>{
    taskController.getAllTaskByUsers(req, res, next);
});

//========= update task status ================//
taskRouter.put("/editTaskStatus", auth, (req, res, next)=>{
    taskController.updateTaskStatus(req, res, next);
});

//======== getTask by status ==================//
taskRouter.get("/byStatus", auth, (req, res, next)=>{
    taskController.getTaskByStatus(req, res, next);
})

//======== search task router ==================//
taskRouter.get("/search", auth, (req, res, next)=>{
    taskController.searchTask(req, res, next);
})

//======== find taskBy id ======================//
taskRouter.get("/taskById/:taskId", auth, (req, res, next)=>{
    console.log("get taskBu is called: ");
    taskController.findTaskById(req, res, next);
})


export default taskRouter;