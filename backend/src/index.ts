import express from 'express';
import bodyParser from 'body-parser';
import expenseRouter from './routes/expense';
import userRouter from './routes/user'
import cors from "cors"
const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use('/api/v1/expense', expenseRouter);
app.use('/api/v1/user' , userRouter)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
