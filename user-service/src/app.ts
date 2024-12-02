import express from 'express';
import { createUserRouter } from "./routes";
import { DataSource } from 'typeorm';

export function createApp(dataSource: DataSource) {
    const app = express();
    app.set('trust proxy', true);
    app.use("/api/user", createUserRouter(dataSource));

    return app;
}