import dotenv from 'dotenv';
import express, { Express } from 'express';
import { userRouter } from './routes';
import { AppDataSource } from './data-source';

dotenv.config();

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        throw new Error(err);
    })


const app : Express = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', true)
app.use("/api/user", userRouter);
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});