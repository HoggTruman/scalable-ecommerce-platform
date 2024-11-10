import dotenv from 'dotenv';
import express, { Express } from 'express';
import { userRouter } from './routes';

dotenv.config();

const app : Express = express();
const port = process.env.PORT || 3000;

app.use("/api/user", userRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});