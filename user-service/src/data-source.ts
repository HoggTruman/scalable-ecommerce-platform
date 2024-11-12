import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.NODE_ENV === "test"? ":memory:": process.env.DB_PATH;

if (!dbPath) {
    throw Error("DB_PATH environment variable must be set.");
}  

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: dbPath,
    synchronize: true,
    logging: false,
    entities: [],
    migrations: [],
    subscribers: [],
});
