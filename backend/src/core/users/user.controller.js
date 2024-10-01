import UserRepository from "./user.repository.js";
import { hashedPassword } from "../../utils/passwordHashed.js";
import { AppError } from "../../middleware/errorHandler.middleware.js";
import jwt from "jsonwebtoken";


export default class UserController{
    constructor(){
        this.userRepository = new UserRepository();
    }


    //====== user signun controller =============//
    async signup(req, res, next){
        try{
            const {name, email, password, role} = req.body;

            const errors = [];
            if(!email?.trim()){
                errors.push("email is required")
            }

            if(!password?.trim()){
                errors.push("password is required")
            }

            if(!name?.trim()){
                errors.push("name is required");
            }

            if(!role){
                errors.push("user role is required")
            }

            if(errors.length>0){
                throw new AppError(errors[0], 401);
            }

              //===== else check strong password and hashed the password =====//
              const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
              if (!strongPasswordRegex.test(password)) {
                  throw new AppError("Password must strong!", 400);
              }

            const encriptedPassword = await hashedPassword(password);
            const result = await this.userRepository.signup({
                name:name,
                email:email, 
                password:encriptedPassword,
                role:role
            });

            if(result?.success){
                return res.status(201).json(result);
            }


        }catch(error){
            next(error)
        }
       
    }

     //======= users signin controller ==========//
     async signin(req, res, next){
        try{
            const {email, password} = req.body;

            const result = await this.userRepository.signin({email, password});
            if(result?.success){
                //---- create jwt token -----//
                const jwtToken = jwt.sign({
                    email:result.user.email,
                    userId:result.user._id
                }, process.env.JWT_SECRET, {expiresIn:"4h"});

                return res.status(200).cookie("jwtToken", jwtToken, {maxAge:4*60*60*1000, httpOnly:true})
                .json({success:true, message:"signin sucessfully", user:result.user, jwtToken})

            }


        }catch(error){
            next(error);
        }
            
     }

     //======= get users controller ============//
     async getUsers(req, res, next){
        try{
            const result = await this.userRepository.findUsers();
            
            if(result){
                return res.status(200).json(result);
            }


        }catch(error){
            next(error);
        }
     }

     //======= users logout controller =========//
     async logout(req, res, next){
        try{
            res.clearCookie('jwtToken').status(200).send({message:"User logout sucessfully!"});

        }catch(error){
            next(error);
        }
     }
}
