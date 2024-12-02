import dotenv from 'dotenv';
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Login } from "./entity/Login";
import { User } from "./entity/User";

dotenv.config();

const dbName = process.env.POSTGRES_DB;
const dbPassword = process.env.POSTGRES_PASSWORD;
const dbPort = process.env.POSTGRES_PORT;


if (dbName === undefined) {
    throw Error("POSTGRES_DB environment variable must be set.");
}

if (dbPassword === undefined) {
    throw Error("POSTGRES_PASSWORD environment variable must be set.");
}

if (dbPort === undefined) {
    throw Error("POSTGRES_PORT environment variable must be set.");
}


function getPort(port: string | undefined) : number {
    const numPort = Number(port);

    if (Number.isInteger(numPort) === false || numPort < 0) {
        throw Error(`Invalid port provided: ${port}`)
    }
    return numPort;
}


export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PGHOST || "localhost",
    port: getPort(dbPort),
    database: dbName,
    username: "postgres",
    password: dbPassword,
    synchronize: true, ///////////////////////////////////////
    logging: false,
    entities: [User, Login],
    migrations: [],
    subscribers: [],
});
