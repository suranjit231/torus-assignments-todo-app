import TaskRepository from "./task.repository.js";

export default class TaskController{
    constructor(){
        this.taskRepository = new TaskRepository();
    }

    //====== addNew task and assign task comntroller =====//
    async addTask(req, res, next){
        try{
            const taskInfo = req.body;
            const result = await this.taskRepository.addTask(taskInfo);

            if(result){
                return res.status(201).json(result);
            }

        }catch(error){
            next(error);
        }
    }

    //====== getAllTask by admin ========//
    async getAllTaskByAdmin(req, res, next){
        try{
            const userId = req.userId;
            const result = await this.taskRepository.getAllTaskByAdmin(userId);

            if(result){
                return res.status(200).json(result);
            }

        }catch(error){
            next(error);
        }
    }

    //====== getAllTask by users ========//
    async getAllTaskByUsers(req, res, next){
        try{
            const userId = req.userId;
            const result = await this.taskRepository.getAllTaskByUser(userId);
            if(result){
                return res.status(200).json(result);
            }

        }catch(error){
            next(error);
        }
    }

    //======= update task ==============//
    async updateTask(req, res, next){
        try{
            const userId = req.userId;
            const taskId = req.params.taskId;
            const updateAbleTask = req.body;
            const result = await this.taskRepository.updateTask(taskId, userId, updateAbleTask);

            if(result?.success){
                return res.status(200).json(result);
            }

        }catch(error){
            next(error);
        }
    }

    //======== update task status controller ========//
    async updateTaskStatus(req, res, next){
        try{
            const userId = req.userId;
            const {status, taskId} = req.body;

            const result = await this.taskRepository.updateTaskStatus(taskId, userId, status);
            
            if(result.success){
                return res.status(200).json(result);
            }

        }catch(error){
            next(error);
        }
    }

    //======== delete task ==========//
    async deleteTask(req, res, next){
        try{
            const userId = req.userId;
            const taskId = req.params.taskId;
            console.log("delete task clled: ", req.params);

            const result = await this.taskRepository.deleteTask(taskId, userId);
            
            if(result?.success){
                return res.status(200).json(result);
            }
        }catch(error){
            next(error);
        }
    }


    //====== get tasks by status ===========//
    async getTaskByStatus(req, res, next){
        try{
            const userId = req.userId;
            const status = req.query.status;
            const result = await this.taskRepository.getTaskByStatus(userId, status);
            if(result.success){
                return res.status(200).json(result);
            }

        }catch(error){
            next(error);
        }
    }

    //======= search task controller ==========//
    async searchTask(req, res, next) {
        try {
            const userId = req.userId;
            const searchText = req.query.q;
    
            const tasks = await this.taskRepository.searchTask(userId, searchText);
           
    
            if (tasks) {
                return res.status(200).json(tasks);
            }
            
        } catch (error) {
            next(error);
        }
    }

    //======== find task by taskId ==========//
    async findTaskById(req, res, next){
        try{
            const taskId = req.params.taskId;
            const result = await this.taskRepository.findTaskById(taskId);
            if(result){
                return res.status(200).json(result);
            }

        }catch(error){
            next(error);
        }

    }
}