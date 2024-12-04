import "reflect-metadata";
import { DataSource } from "typeorm";
import { Login } from "./entity/Login";
import { User } from "./entity/User";
import { getEnv } from './utility/getEnv';


function getPort(port: string) : number {
    const intPort = parseInt(port, 10);

    if (Number.isNaN(intPort) || intPort < 0) {
        throw Error(`Invalid port provided: ${port}`)
    }
    return intPort;
}


export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PGHOST || "localhost",
    port: getPort(getEnv("POSTGRES_PORT")),
    database: getEnv("POSTGRES_DB"),
    username: "postgres",
    password: getEnv("POSTGRES_PASSWORD"),
    synchronize: true, ///////////////////////////////////////
    logging: false,
    entities: [User, Login],
    migrations: [],
    subscribers: [],
});
