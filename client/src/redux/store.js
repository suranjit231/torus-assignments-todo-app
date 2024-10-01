import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authReducer";
import { loadingReducer } from "./loadingReducer";
import { errorReducer } from "./errorReducer";
import { taskReducer } from "./taskReducer";


//======= now consigure redux store and exposts ========//
const store = configureStore({
    reducer:{
        loadingReducer,
        errorReducer,
        authReducer,
        taskReducer,
    }
})

export default store;