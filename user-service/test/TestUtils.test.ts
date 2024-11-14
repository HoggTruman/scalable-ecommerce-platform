import { DataSource, Repository } from "typeorm";
import { Login } from "../src/entity/Login";
import { User } from "../src/entity/User";
import { AppDataSource } from "../src/data-source";
import { TestUtils } from "./TestUtils";
import { TEST_LOGINS, TEST_USERS } from "./fixtureData";

let testDataSource: DataSource = AppDataSource;

let userRepo: Repository<User>;
let loginRepo: Repository<Login>;

beforeAll(async () => {
    await testDataSource.initialize();
    userRepo = testDataSource.getRepository(User);
    loginRepo = testDataSource.getRepository(Login);
});

describe("UserRepository Tests", () => {
    test("sets up correctly", async () => {
        // Ensure empty db
        await TestUtils.clearTables(testDataSource);
        expect(await userRepo.find()).toHaveLength(0);
        expect(await loginRepo.find()).toHaveLength(0);

        // Ensure test data is present
        await TestUtils.addFixtureData(testDataSource);

        const users = await userRepo.find();
        expect(users).toHaveLength(TEST_USERS.length);
        const logins = await loginRepo.find();
        expect(logins).toHaveLength(TEST_LOGINS.length);

        // Ensure empty db
        await TestUtils.clearTables(testDataSource);
        expect(await userRepo.find()).toHaveLength(0);
        expect(await loginRepo.find()).toHaveLength(0);
    });
});