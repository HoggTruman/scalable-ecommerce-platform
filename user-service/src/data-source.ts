import dotenv from 'dotenv';
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Login } from "./entity/Login";
import { User } from "./entity/User";

dotenv.config();

const dbPath = process.env.DB_PATH;

if (dbPath === undefined) {
    throw Error("DB_PATH environment variable must be set.");
}  

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: dbPath,
    synchronize: false,
    logging: false,
    entities: [User, Login],
    migrations: [],
    subscribers: [],
});


export const TestDataSource = new DataSource({
    type: "better-sqlite3",
    database: ":memory:",
    synchronize: true,
    logging: false,
    entities: [User, Login],
    migrations: [],
    subscribers: [],
});


export function getDataSource() {
    return process.env.NODE_ENV === "test"?
        TestDataSource:
        AppDataSource;
}
