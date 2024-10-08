import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },

    email:{
        type:String,
        required:true,
        unique:true

    },

    password:{
        type:String,
        required:true,

    },

    role:{
        type:String,
        enum:["users", "admin"],
        default:"users"
    }
},)

const userModel = mongoose.model("User", userSchema);
export default userModel;