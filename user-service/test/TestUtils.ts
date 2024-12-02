import { User } from "../src/entity/User";
import { Login } from "../src/entity/Login";
import { TEST_LOGINS, TEST_USERS } from "./fixtureData";
import { DataSource } from "typeorm";


export class TestUtils {
    public static async clearTables(dataSource: DataSource) : Promise<void>{
        const entities = dataSource.entityMetadatas;
        const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(", ");
        await dataSource.query(`TRUNCATE ${tableNames} CASCADE;`);
    }


    public static async addFixtureData(dataSource: DataSource) : Promise<void> {
        const userRepo = dataSource.getRepository(User);
        const loginRepo = dataSource.getRepository(Login);

        await userRepo.insert(TEST_USERS);
        await loginRepo.insert(TEST_LOGINS);        
    }
}