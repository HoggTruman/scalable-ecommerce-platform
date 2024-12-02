import { DataSource } from "typeorm";
import { User } from "../src/entity/User";
import { Login } from "../src/entity/Login";


export function createTestDataSource(port: number) {
    return new DataSource({
        type: "postgres",
        host: "localhost",
        port: port,
        database: "test",
        username: "postgres",
        password: "test",
        synchronize: true,
        logging: false,
        entities: [User, Login],
        migrations: [],
        subscribers: [],
    });
}