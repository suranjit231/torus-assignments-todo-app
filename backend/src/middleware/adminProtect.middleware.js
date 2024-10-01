import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.middleware.js"
import userModel from "../core/users/userSchema.js"

const adminProtectorMiddleware = async (req, res, next)=>{
   
    try{
        const {jwtToken} = req.cookies;
        if(!jwtToken){
            throw new AppError("Unauthorized! credential is missing!", 404)
        }

        jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, data)=>{

            if(err){
                throw new AppError("Invalid credential.", 401);

            }else{

                const userId = data.userId;
                const user = await userModel.findById(userId);

                if(!user){
                    throw new AppError("Invalid credential.", 401);

                }
                
                 if(user.role !=="admin"){
                    throw new AppError("Unauthorized you can't access this route.", 401);

                 }

                    req.userId = data.userId;

                    // console.log("tesing admin protect route: ", data.userId);
                    next();
                

            }
        })

    }catch(error){
        next(error);
    }
}


export default adminProtectorMiddleware;