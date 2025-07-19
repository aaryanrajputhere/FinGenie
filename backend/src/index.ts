import express from 'express';
import bodyParser from 'body-parser';
import expenseRouter from './routes/expense';
import userRouter from './routes/user'
import cors from "cors"
const app = express();
app.use(bodyParser.json());

const allowedOrigins = ['https://fingenieai.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/v1/expense', expenseRouter);
app.use('/api/v1/user' , userRouter)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
