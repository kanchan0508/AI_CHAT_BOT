import {Router} from "express";
import { getAllUsers, useSignup, userLogin, verifyUser } from "../controllers/user-controllers";
import { loginValidator, signupValidator, validate } from "../utils/validators";
import { verifyToken } from "../utils/token-manager";


const userRoutes = Router();
userRoutes.get("/", getAllUsers);
userRoutes.post("/signup",validate(signupValidator), useSignup);
userRoutes.post("/login",validate(loginValidator), userLogin);
userRoutes.get("/auth-status",verifyToken,  verifyUser);


export default userRoutes;