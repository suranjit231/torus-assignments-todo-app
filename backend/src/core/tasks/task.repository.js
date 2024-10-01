import taskModel from "./taskSchema.js";
import { AppError } from "../../middleware/errorHandler.middleware.js";

//====== a task repository class contains methods for task database operations ======//
export default class TaskRepository{

    //======= add a new task repo =====//
    async addTask(taskInfo){
        try{
            
            const newTask = new taskModel(taskInfo);
            const savedTask = await newTask.save();

            return {success:true, message:"Task created and assigned!", task:savedTask};

        }catch(error){
            throw error;
        }
    }

    //====== view all task by admin =========//
    async getAllTaskByAdmin(userId){
        try{
            const tasks = await taskModel.find({adminUser:userId}).populate({ path:"assignedUser", select:"name" })

            if(tasks.length<1){
                return {sucess:false, message:"You have not created any task yet", tasks:[]};

            }else{
                return {sucess:true, message:"Your tasks is fetch sucessfully!", tasks:tasks};
            }


        }catch(error){
            throw error;
        }
    }

    //======= get all tasks by users ========//
    async getAllTaskByUser(userId){
        try{
            const tasks = await taskModel.find({assignedUser:userId}).populate({ path:"adminUser", select:"name" })

            if(tasks.length<1){
                return {sucess:false, message:"No taks is assigned you!", tasks:[]};

            }else{
                return {sucess:true, message:"Your tasks is fetch sucessfully!", tasks:tasks};
            }


        }catch(error){
            throw error;
        }
    }

    //====== update a tasks =========//
    async updateTask(taskId, userId, updateAbleData){
        try{
            const task = await taskModel.findOne({_id:taskId});
            //===== checked is the user is admin or not ======//
            if(task.adminUser.toString() !== userId.toString()){
                throw new AppError("You are not authorized to update task!", 401);

            }

            for (const key in updateAbleData) {
                task[key] = updateAbleData[key];
            }

            const updatedTask = await task.save();
            return {success:true, message:"task is updated!", task:updatedTask}

        }catch(error){
            throw error;
        }
    }


    //======== update task status ========//
    async updateTaskStatus(taskId, userId, status){
        try{
            const task = await taskModel.findOne({_id:taskId})
            .populate('assignedUser', 'name').populate('adminUser', 'name');
           // console.log("task: ", task);

            //===== checked is the user is admin or users ======//
            if(task.adminUser._id.toString() !== userId.toString() && task.assignedUser._id.toString() !== userId.toString()){
                throw new AppError("You are not authorized to update task!", 401);

            }

            task.status = status;
            const updatedTask = await task.save();
            return {success:true, message:"task status is updated!", task:updatedTask}

        }catch(error){
            throw error;

        }
    }

    //======= delete a task ==========//
    async deleteTask(taskId, userId){
        try{
            const task = await taskModel.findById(taskId);

              //===== checked is the user is admin or not ======//
            if(task.adminUser.toString() !== userId.toString()){
                throw new AppError("You are not authorized to update task!", 401);

            }

            await taskModel.deleteOne({_id:taskId});
            return {success:true, message:"task is deleted!", task:task};


        }catch(error){
            throw error;
        }
    }

    //========= get all users' tasks by task status =========//
async getTaskByStatus(userId, status) {
    try {

        let query = {
            $or: [
                { adminUser: userId },
                { assignedUser: userId }
            ]
        };

        // If the status is "high", search by the "Priority" field
        if (status === 'high') {
            query.priority = 'high';
        } else {
            query.status = status;
        }

        const tasks = await taskModel.find(query).populate('adminUser assignedUser');

        return { success:true, message:"task fetch sucessfully", tasks:tasks};

    } catch (error) {
        throw error;
    }
}

//========== search task repository ==============//
async searchTask(userId, searchText) {
    try {
        const tasks = await taskModel.find({
            $or: [
                { adminUser: userId },  
                { assignedUser: userId } 
            ],
            $or: [
                { title: new RegExp(searchText, 'i') },  
                { description: new RegExp(searchText, 'i') }  
            ]
        }).sort({ dueDate: 1 });

        if (tasks.length < 1) {
            return { success: false, message: "No tasks found!", tasks:[] };
        } else {
            let totalTask = tasks.length;
            return { success: true, message: `You have ${totalTask} tasks found`, tasks: tasks };
        }
    } catch (error) {
        throw error;
    }
}


//======== find a task by taskId ============//
async findTaskById(taskId){
    try{
        const task = await taskModel.findOne({_id:taskId})
                    .populate('assignedUser', 'name').populate('adminUser', 'name');
        if(!task){
            throw new AppError("Task not found", 404);

        }else{
            return { success:true, nessage:"task found", task:task}
        }


    }catch(error){
        throw error;
    }


}

}