import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager";
import { COOKIE_NAME } from "../utils/constant";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get all users
    const users = await User.find();
    return res.status(201).json({ message: "ok", users });
  } catch (error) {
    console.log(Error);
    return res.status(200).json({ message: "ERROR", cause: Error });
  }
};
export const useSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // users signup
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).send("User already registered");
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // create token and store cookies
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email!, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });

    return res
      .status(200)
      .json({ message: "ok", name: user.name, email: user.email });
  } catch (error) {
    console.log(Error);
    return res.status(200).json({ message: "ERROR", cause: Error });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // users login
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).send("User not registred");
    }
    const ispasswordCorrect = await compare(password, user.password as string);
    if (!ispasswordCorrect) {
      return res.status(403).send("Incorrect password");
    }

    // create token and store cookies

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email!, "7d");
    // console.log(token);
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });

    return res
      .status(200)
      .json({ message: "ok", name: user.name, email: user.email });
  } catch (error) {
    console.log(Error);
    return res.status(200).json({ message: "ERROR", cause: Error });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // users token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registred OR Token malfunctioned");
    }
    console.log(user._id.toString(), res.locals.jwtData.id);
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res
      .status(200)
      .json({ message: "ok", name: user.name, email: user.email });
  } catch (error) {
    console.log(Error);
    return res.status(200).json({ message: "ERROR", cause: Error });
  }
};
