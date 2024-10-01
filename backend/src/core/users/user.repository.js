import userModel from "./userSchema.js";
import { AppError } from "../../middleware/errorHandler.middleware.js";
import { comparePassword, hashedPassword } from "../../utils/passwordHashed.js";

export default class UserRepository{

    //====== signup users as well as admin ========//
    async signup(userInfo){
        try{

            
            const newUser = new userModel(userInfo);
            const savedUser = await newUser.save();

            return {success:true, message:"signup sucessfully!", user:this.removePasswordField(savedUser)};

        }catch(error){
            throw error;
        }
    }

    //======= user signin ========================//
    async signin(userCredential){
        try{

            const user = await userModel.findOne({email:userCredential.email});
            if(!user){
                throw new AppError("user not found!", 404);
            }

            const isCorrectPassword = await comparePassword(userCredential.password, user.password);

            if(!isCorrectPassword){
                throw new AppError("invalid password!", 401);
            }

            return {success:true, message:"signin sucessfully!", user:this.removePasswordField(user)};

        }catch(error){
           // console.log("error in signin: ", error)
            throw error;

        }
    }

    //====== finds all users whole role is users ========//
    async findUsers(){
        try{
            const users = await userModel.find({role:"users"}).select('-password');
            if(users.length<1){
                return {success:false, message:"No users exist", users:[]};

            }else{
                return {success:true, message:"users fetch sucessfully!", users:users};
            }


        }catch(error){
            throw error;
        }
    }





     //=========== a utility function for removing password from user when return user =========//
     removePasswordField(user) {
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    }



}