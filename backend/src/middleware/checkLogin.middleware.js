import jwt from "jsonwebtoken";
import userModel from "../core/users/userSchema.js"

const checkedLogin = async(req, res, next)=>{
    try{

        const {jwtToken} = req.cookies;
       // console.log("auth token: ", jwtToken)
        if(!jwtToken){
            return res.status(200).json({success:false, message:"No authorized credential!"});
        }

        jwt.verify(jwtToken, process.env.JWT_SECRET, async(err, data)=>{
            if(err){
                return res.status(200).json({success:false, message:"Invalid credential!"});
            }else{
                req.userId = data.userId;
                const user =await userModel.findById(data.userId);
                if(user){
                    const { password, ...userWithoutPassword } = user.toObject();
                    return res.status(200).json({success:true, message:"User is Loggedin", user:userWithoutPassword});
                }else{
                    return res.status(200).json({success:false, message:"No user found with this credential!"});
                }
            }
        })

    }catch(error){
        next(error);
    }
    

}


export default checkedLogin;