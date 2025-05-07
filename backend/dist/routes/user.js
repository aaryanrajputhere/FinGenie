"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const index_1 = require("../schema/index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new client_1.PrismaClient();
const userRouter = express.Router();
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = index_1.signupSchema.safeParse(req.body);
    if (!body.success) {
        return res.status(400).json({ message: "Invalid data", errors: body.error.errors });
    }
    const { name, email, password } = body.data;
    console.log("existingUser");
    // Check if user already exists
    const existingUser = yield prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    console.log("existingUser");
    // Create a new user
    const newUser = yield prisma.user.create({
        data: {
            name,
            email,
            password,
        },
    });
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '30d' });
    return res.status(201).json({
        message: "User signed up successfully",
        token,
        user: { name: newUser.name, email: newUser.email },
    });
}));
userRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = index_1.loginSchema.safeParse(req.body);
    if (!body.success) {
        return res.status(400).json({ message: "Invalid data", errors: body.error.errors });
    }
    const { email, password } = body.data;
    // Check if user exists
    const user = yield prisma.user.findUnique({
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
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    return res.status(200).json({
        message: "User logged in successfully",
        token,
        user: { name: user.name, email: user.email },
    });
}));
exports.default = userRouter;
