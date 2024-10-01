import bcrypt from "bcrypt";

export async function hashedPassword(password){
   const hashedPass= await bcrypt.hash(password, 12);
   return hashedPass;
    
}


export async function comparePassword(password, hashedPass) {
   return await bcrypt.compare(password, hashedPass);
    
}