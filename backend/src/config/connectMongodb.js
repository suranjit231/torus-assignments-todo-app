import mongoose from "mongoose";

const connectMongodb = async()=>{
    try{
        await mongoose.connect(`${process.env.DB_URL}/task-management`);
        console.log("mongodb is connected");


    }catch(error){
        console.log("error in connecting database: ", error)
    }
}

export default connectMongodb;