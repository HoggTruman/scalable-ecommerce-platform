import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { User } from "./entity/User";
import { Login } from "./entity/Login";

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
