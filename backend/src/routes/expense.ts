import express, { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '../middleware/authMiddleware';
const GEMINI_KEY = process.env.GEMINI_KEY;
const router = express.Router();
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(<string>GEMINI_KEY);

router.post('/process_spending',authMiddleware, async (req: any, res: any) => {
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

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const amountRegex = /"amount":\s*(\d+(\.\d+)?)/;
        const categoryRegex = /"category":\s*"([^"]+)"/;

        const amountMatch = responseText.match(amountRegex);
        const categoryMatch = responseText.match(categoryRegex);

        if (amountMatch && categoryMatch) {
            const amount = parseFloat(amountMatch[1]);
            const category = categoryMatch[1];
            const newExpense = await prisma.expense.create({
                data:{
                    amount: amount,
                    category:category,
                    sentence:sentence,
                    userId: req.user.id
                }
            })
            return res.json({ amount, tag: category });
        } else {
            return res.status(400).json({ error: 'Could not extract both amount and tag' });
        }

    } catch (error: any) {
        return res.status(500).json({ error: `Error processing sentence: ${error.message}` });
    }
});

router.get('/transactions', authMiddleware, async (req: any, res: any) => {
    const userId = req.user.id;
    // Get all transactions for the logged-in user
    try {
        const transactions = await prisma.expense.findMany({
            where: {
                userId: userId,  // Filter by userId
            },
        });
        // Send the transactions as a response
        res.json(transactions);
    } catch (error) {
        console.error("Error retrieving transactions:", error);
        res.status(500).json({ message: "Error retrieving transactions" });
    }
});

export default router;
