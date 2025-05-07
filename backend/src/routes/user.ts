import * as express from "express";
import { signupSchema , loginSchema} from "../schema/index"; 
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'; 
import authMiddleware from "../middleware/authMiddleware"
import { before } from "node:test";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient();
const userRouter = express.Router();

userRouter.post("/signup", async (req: any, res: any) => {
    
    const body = signupSchema.safeParse(req.body);
  
    if (!body.success) {
      return res.status(400).json({ message: "Invalid data", errors: body.error.errors });
    }
  
    const { name, email, password } = body.data;
    console.log("existingUser")

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.log("existingUser")
    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, 
        },
    });
  
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET as string,
      { expiresIn: '30d' }
    );  
    return res.status(201).json({
      message: "User signed up successfully",
      token,
      user: { name: newUser.name, email: newUser.email },
    });
  });
userRouter.post('/login' , async (req: any, res: any) => {
    const body = loginSchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ message: "Invalid data", errors: body.error.errors });
    }
    const { email, password } = body.data;
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Check if password is correct
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET as string,
      { expiresIn: '30d' }
    );
    
    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: { name: user.name, email: user.email },
    });
})


export default userRouter;
