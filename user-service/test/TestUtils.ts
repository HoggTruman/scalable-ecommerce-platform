import { User } from "../src/entity/User";
import { Login } from "../src/entity/Login";
import { TEST_LOGINS, TEST_USERS } from "./fixtureData";
import { TestDataSource } from "../src/data-source";


export class TestUtils {
    public static async clearTables() : Promise<void>{
        const entities = TestDataSource.entityMetadatas;

        for (const entity of entities) {
            const repository = TestDataSource.getRepository(entity.name);
            await repository.clear();
        }
    }


    public static async addFixtureData() : Promise<void> {
        const userRepo = TestDataSource.getRepository(User);
        const loginRepo = TestDataSource.getRepository(Login);

        await userRepo.insert(TEST_USERS);
        await loginRepo.insert(TEST_LOGINS);        
    }
}