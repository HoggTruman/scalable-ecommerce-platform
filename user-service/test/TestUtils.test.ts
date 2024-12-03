import { DataSource, Repository } from "typeorm";
import { Login } from "../src/entity/Login";
import { User } from "../src/entity/User";
import { TestUtils } from "./TestUtils";
import { TEST_LOGINS, TEST_USERS } from "./fixtureData";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";

let userRepo: Repository<User>;
let loginRepo: Repository<Login>;
let TestDataSource : DataSource;
let testContainer : StartedPostgreSqlContainer;

beforeAll(async () => {
    testContainer = await new PostgreSqlContainer("postgres:17.2").start();
    TestDataSource = TestUtils.createTestDataSource(testContainer.getFirstMappedPort());
    await TestDataSource.initialize();
    userRepo = TestDataSource.getRepository(User);
    loginRepo = TestDataSource.getRepository(Login)
}, 50000);

afterAll(async () => {
    await TestDataSource.destroy();
    await testContainer.stop();
});




describe("TestUtils Tests", () => {
    test("sets up correctly", async () => {
        // Ensure empty db
        await TestUtils.clearTables(TestDataSource);
        expect(await userRepo.find()).toHaveLength(0);
        expect(await loginRepo.find()).toHaveLength(0);

        // Ensure test data is present
        await TestUtils.addFixtureData(TestDataSource);

        const users = await userRepo.find();
        expect(users).toHaveLength(TEST_USERS.length);
        const logins = await loginRepo.find();
        expect(logins).toHaveLength(TEST_LOGINS.length);

        // Ensure empty db
        await TestUtils.clearTables(TestDataSource);
        expect(await userRepo.find()).toHaveLength(0);
        expect(await loginRepo.find()).toHaveLength(0);
    });
});