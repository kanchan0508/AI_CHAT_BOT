import express,{Request,Response} from "express";
import {config} from "dotenv";
import morgan from 'morgan';
import appRouter from "./routes";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { COOKIE_NAME } from "./utils/constant";
config();

const app= express();

//middlewares
 app.use(express.json());
 app.use(cookieParser(process.env.COOKIE_SECRET));
//  app.use(cookieParser());
 app.use(cors({origin:"http://127.0.0.1:5173" , credentials:true}
      
 ));
 // remove it in production
 app.use (morgan("dev"));
 
 app.use("/api/v1",appRouter)

 export default app;