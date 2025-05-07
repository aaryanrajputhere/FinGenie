"use strict";
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
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const client_1 = require("@prisma/client");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const GEMINI_KEY = process.env.GEMINI_KEY;
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_KEY);
router.post('/process_spending', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sentence = (req.body.sentence || '').toLowerCase();
    if (!sentence) {
        return res.status(400).json({ error: 'No sentence provided' });
    }
    const predefinedTags = [
        'entertainment', 'food', 'groceries', 'travel',
        'shopping', 'rent', 'utilities', 'coffee', 'books', 'electronics'
    ];
    const prompt = `
    Extract the amount and category (tag) from the following sentence: "${sentence}".
    The possible tags for the categories are: 
    ${predefinedTags.join(', ')}.
    Make sure the amount is a numerical value (integer or decimal).
    Return the response in the following JSON format:
    {
      "amount": <amount>,
      "category": "<category>"
    }
    `;
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = yield model.generateContent(prompt);
        const responseText = result.response.text();
        const amountRegex = /"amount":\s*(\d+(\.\d+)?)/;
        const categoryRegex = /"category":\s*"([^"]+)"/;
        const amountMatch = responseText.match(amountRegex);
        const categoryMatch = responseText.match(categoryRegex);
        if (amountMatch && categoryMatch) {
            const amount = parseFloat(amountMatch[1]);
            const category = categoryMatch[1];
            const newExpense = yield prisma.expense.create({
                data: {
                    amount: amount,
                    category: category,
                    sentence: sentence,
                    userId: req.user.id
                }
            });
            return res.json({ amount, tag: category });
        }
        else {
            return res.status(400).json({ error: 'Could not extract both amount and tag' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: `Error processing sentence: ${error.message}` });
    }
}));
router.get('/transactions', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    // Get all transactions for the logged-in user
    try {
        const transactions = yield prisma.expense.findMany({
            where: {
                userId: userId, // Filter by userId
            },
        });
        // Send the transactions as a response
        res.json(transactions);
    }
    catch (error) {
        console.error("Error retrieving transactions:", error);
        res.status(500).json({ message: "Error retrieving transactions" });
    }
}));
exports.default = router;
