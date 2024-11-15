import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../src/entity/User";
import { Login } from "../src/entity/Login";


export const TestDataSource = new DataSource({
    type: "better-sqlite3",
    database: ":memory:",
    synchronize: true,
    logging: false,
    entities: [User, Login],
    migrations: [],
    subscribers: [],
});

