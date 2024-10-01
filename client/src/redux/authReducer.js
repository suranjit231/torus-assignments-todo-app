import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading, clearLoading } from "./loadingReducer";
import { setError } from "./errorReducer";

const initialState = {
    isLoggedIn:false,
    user:null,
    authLoading:false,
    authError:null,
    isSignup:false,
}

//console.log(`server url: ${process.env.REACT_APP_SERVER_URL}`)

//======== async thunkApi for user signup ==============//
export const signupApiAsync = createAsyncThunk("auth/signupApi",
    async(arg, thunkApi)=>{
        try{
            thunkApi.dispatch(setLoading());
            const res =await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/users/signup`, arg);
           // console.log("res.data for signup api: ", res.data);

            return res.data;

        }catch(error){
            console.log("error in signup: ", error);
            thunkApi.dispatch(setError(error.response.data.message));
            return thunkApi.rejectWithValue(error.response.data.message);

        }finally{
            thunkApi.dispatch(clearLoading())
        }
    }
)

//========= signin apiAsync for users signin ============//
export const signinApiAsync = createAsyncThunk("auth/signinApi",
    async(arg, thunkApi)=>{
        try{
            thunkApi.dispatch(setLoading());
            const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/users/signin`, arg, {withCredentials:true});
            console.log("res.data for signin api: ", res.data);
            return res.data;


        }catch(error){
            thunkApi.dispatch(setError(error.response.data.message));
            return thunkApi.rejectWithValue(error.response.data.message);

        }finally{
            thunkApi.dispatch(clearLoading());
        }
    }
)


//======== logout apiAsync for users logout ============//
export const logoutApiAsync = createAsyncThunk("auth/logoutApi",
    async(arg, thunkApi)=>{
        try{
            thunkApi.dispatch(setLoading());
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/logout`, {withCredentials:true});
            console.log("res.data for logout: ", res.data);
            return res.data;

        }catch(error){
            thunkApi.dispatch(setError(error.response.data.message));
            return thunkApi.rejectWithValue(error.response.data.message);

        }finally{
            thunkApi.dispatch(clearLoading());
        }
    }
)


//======== check user login api call ==============//
export const checkIsLoginAsync = createAsyncThunk("auth/isLoginAsync", 
    async(arg, thunkAPI)=>{
      try{
  
        thunkAPI.dispatch(setLoading());
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/isLogin`, {withCredentials:true});
        const responseData = response.data;
      //  console.log("response data for checked login: ", responseData);
  
        if(responseData && responseData.success){
          thunkAPI.dispatch(setAuthState(responseData.user));
        }else{
          thunkAPI.dispatch(setAuthLogout(responseData.user));
        }
  
      }catch(error){
        thunkAPI.dispatch(setError("server error"));
        return thunkAPI.rejectWithValue("Server error");
  
      }finally{
        thunkAPI.dispatch(clearLoading());
      }
    }
  )
  


//========== creating AuthSlice for performing auth state operation ============//
const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers: {
        setAuthState:(state, action)=>{
          state.isLoggedIn = true;
         // console.log("action.payload in auth reducser: ", action.payload);
          state.user = action.payload;
          state.loading = false;
        },
    
        setAuthLogout:(state, action)=>{
          state.isLoggedIn = false;
          state.user = null;
          state.loading = false;
        }
      },

    extraReducers:(builders)=>{
        builders
        .addCase(signinApiAsync.fulfilled, (state, action)=>{
            state.isLoggedIn = true;
            state.user = action.payload.user;
        })

        .addCase(signupApiAsync.fulfilled, (state, action)=>{
          state.isSignup = true;
        })

        .addCase(logoutApiAsync.fulfilled, (state, action)=>{
            state.isLoggedIn = false;
            state.user= null;
        })
    }
})


//===== now exposts authReducer, authActions, authSelector from here ============//
export const authReducer = authSlice.reducer;
export const {setAuthState, setAuthLogout} = authSlice.actions;
export const authSelector = (state)=>state.authReducer;
