import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import { setLoading, clearLoading } from "./loadingReducer";
import { setError } from "./errorReducer";
import axios from "axios";

const initialState = {
    tasks:[],
    taskLoading:false,
    taskError:null
}

//===== add new task apiAsync ==============//
export const addTaskApiAsync = createAsyncThunk("task/addTaskApi",
    async(arg, thunkApi)=>{
        try{
            thunkApi.dispatch(setLoading());
            const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/tasks/addTask`,
                 arg, {withCredentials:true});
            
            console.log("res.data for addTask Api: ", res.data);
            return res.data;

        }catch(error){
            console.log("error in add task: ", error);
            thunkApi.dispatch(setError(error.response.data.message));
            return thunkApi.rejectWithValue(error.response.data.message);

        }finally{
            thunkApi.dispatch(clearLoading());
        }
    }
)


export const updateTaskStatusAsync = createAsyncThunk("task/updateTaskApi",
    async(arg, thunkApi)=>{
        try{
            thunkApi.dispatch(setLoading());
            const res = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/tasks/editTaskStatus`,
                arg, {withCredentials:true}
            );
           // console.log("res.data for update task: ", res.data);

            return res.data;

        }catch(error){
            thunkApi.dispatch(setError(error.response.data.message));
            return thunkApi.rejectWithValue(error.response.data.message);
        
        }finally{
            thunkApi.dispatch(clearLoading());
        }

    }
)

//====== update a task api async ===================================================//
export const updateTaskApiAsync = createAsyncThunk("/task/updateTodoApi",
    async(arg, thunkApi)=>{
        try{

            const { taskId, updatedTask } = arg;
            thunkApi.dispatch(setLoading());
            const res = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/tasks/updateTask/${taskId}`,
                updatedTask, {withCredentials:true});

            return res.data;


        }catch(error){
            thunkApi.dispatch(setError(error.response.data.message));
            return thunkApi.rejectWithValue(error.response.data.message);

        }finally{
            thunkApi.dispatch(clearLoading());
        }
    }
)



//======= deleteTask Api async thunk =================================================//
export const deleteTaskApiAsync = createAsyncThunk("task/deleteTask",
    async(arg, thunkApi)=>{
        try{
            const {taskId} = arg;
            thunkApi.dispatch(setLoading());
            const res = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/tasks/deleteTask/${taskId}`, 
                {withCredentials:true}
            );
          

            console.log("res.data delete task: ", res.data);
            return res.data;

        }catch(error){
            thunkApi.dispatch(setError(error.response.data.message));
            return thunkApi.rejectWithValue(error.response.data.message);

        }finally{
            thunkApi.dispatch(clearLoading());
        }
    }
)


//======= get task by status api async ==============//
export const getTaskByStatusApi = createAsyncThunk("task/getTaskByStatus",
    async(arg, thunkApi)=>{
        try{
         
            const {status} = arg;
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/tasks/byStatus`,
                {
                    params:{
                        status:status
                    },
                    withCredentials:true
                } )

            console.log("res.data for status task: ", res.data);
            return res.data;

        }catch(error){
            thunkApi.dispatch(setError(error.response.data.message));
            return thunkApi.rejectWithValue(error.response.data.message);

        }
       
    }
)



//======= search todo api async ==================//
export const searchTodoApiAsync = createAsyncThunk("todo/searchTodoApiAsync",
    async(arg, thunkApi)=>{
        try{

            const {searchText} = arg;
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/tasks/search`, {
                params: { q: searchText }, 
                withCredentials: true});

           // console.log("res.data for search todo: ", res.data);

            if(res.data?.tasks.length<1){
                thunkApi.dispatch(setError("No todo is found."));

            }

            thunkApi.dispatch(taskActions.setInitialTask(res.data.tasks));

            return res.data.tasks;

        }catch(error){
           
            thunkApi.dispatch(setError(error.response.data.message));
            return thunkApi.rejectWithValue(error.response.data.message);
        }
    }
)


//======== creating taskSlice for creating task reducer and perform actions ===========//
const taskSlice = createSlice({
    name:"task",
    initialState:initialState,
    reducers:{
        setInitialTask:(state, action)=>{
            state.tasks = [...action.payload]
        }
    },

    extraReducers:(builders)=>{
        builders
        //========= update state for add task api ======//
        .addCase(addTaskApiAsync.fulfilled, (state, action)=>{
            state.tasks.push({...action.payload.task})
        })

        //======== update state for updateTask status ===========//
        .addCase(updateTaskStatusAsync.fulfilled, (state, action)=>{
            state.tasks = state.tasks.map((task)=>{
                if(task._id === action.payload.task._id){
                    task = {...action.payload.task}
                }

                return task;
            })
        })

        //============ update taskApi for update state ===========//
        .addCase(updateTaskApiAsync.fulfilled, (state, action)=>{
            state.tasks = state.tasks.map((task)=>{
                if(task._id === action.payload.task._id){
                    task = {...action.payload.task}
                }

                return task;
            })
        })



        //========= update state for deleteTask Api =============//
        .addCase(deleteTaskApiAsync.fulfilled, (state, action)=>{
            state.tasks = state.tasks.filter((task)=> task._id !== action.payload.task._id)
        })

        //========= get tasks by status ========================//
        .addCase(getTaskByStatusApi.fulfilled, (state, action)=>{
            state.tasks = [...action.payload.tasks];
        })
    }
})



export const taskReducer = taskSlice.reducer;
export const taskActions = taskSlice.actions;
export const taskSelector = (state)=>state.taskReducer;