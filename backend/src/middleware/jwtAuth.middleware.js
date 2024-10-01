import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.middleware.js";

export default async function auth(req, res, next){
    try{
        const {jwtToken} = req.cookies;
        if(!jwtToken){
            throw new AppError("Users credential is missing", 401)
        }

        jwt.verify(jwtToken, process.env.JWT_SECRET, (err, data)=>{
            if(err){
                throw new AppError("invalid credential!", 401)
            }
            req.userId = data.userId;
            next()
        })



    }catch(error){
        next(error)
    }

}