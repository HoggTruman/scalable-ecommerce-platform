import express from 'express';
import { userRouter } from "./routes";

const app = express();

app.set('trust proxy', true);
app.use("/api/user", userRouter);

export { app };