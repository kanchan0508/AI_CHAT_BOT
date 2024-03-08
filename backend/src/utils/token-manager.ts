
import { NextFunction, Request, Response } from "express";
import { COOKIE_NAME } from "./constant";

import jwt  from "jsonwebtoken";
export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn,
  });
  return token;
};

export const verifyToken= async(
  req:Request, 
  res: Response,
  next:NextFunction
) =>{
  const token= req.cookies[`${COOKIE_NAME}`];
  console.log(token);
   if(!token || token.trim() === "")
   return res.status(401).send({message:"TOken not received"});
  return new Promise<void>((resolve,reject) =>{
   return jwt.verify( token, process.env.JWT_SECRET as string,(err: any,success: any) =>{
      if(err){
          
reject(err.message);
         return res.status(401).send("Token Expired");
      }else {
         resolve();
         res.locals.jwtData = success;
         return next();   
      }
   })
  })
}
