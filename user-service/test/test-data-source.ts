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


TestDataSource.initialize()
    .then(() => {
        console.log("Test Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Test Data Source initialization", err)
    })
