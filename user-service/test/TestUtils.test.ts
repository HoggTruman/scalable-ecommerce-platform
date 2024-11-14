import { Repository } from "typeorm";
import { Login } from "../src/entity/Login";
import { User } from "../src/entity/User";
import { TestUtils } from "./TestUtils";
import { TEST_LOGINS, TEST_USERS } from "./fixtureData";
import { TestDataSource } from "./test-data-source";

let userRepo: Repository<User>;
let loginRepo: Repository<Login>;

beforeAll(async () => {
    userRepo = TestDataSource.getRepository(User);
    loginRepo = TestDataSource.getRepository(Login);
});

describe("TestUtils Tests", () => {
    test("sets up correctly", async () => {
        // Ensure empty db
        await TestUtils.clearTables();
        expect(await userRepo.find()).toHaveLength(0);
        expect(await loginRepo.find()).toHaveLength(0);

        // Ensure test data is present
        await TestUtils.addFixtureData();

        const users = await userRepo.find();
        expect(users).toHaveLength(TEST_USERS.length);
        const logins = await loginRepo.find();
        expect(logins).toHaveLength(TEST_LOGINS.length);

        // Ensure empty db
        await TestUtils.clearTables();
        expect(await userRepo.find()).toHaveLength(0);
        expect(await loginRepo.find()).toHaveLength(0);
    });
});