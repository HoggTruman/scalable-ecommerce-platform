import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { DataSource, Repository } from "typeorm";
import { Login } from "../../../src/entity/Login";
import { User } from "../../../src/entity/User";
import { LoginRepository } from "../../../src/respository/LoginRepository";
import { TEST_USERS } from "../../fixtureData";
import { TestUtils } from "../../TestUtils";


let userRepo: Repository<User>;
let loginRepo: Repository<Login>;
let TestDataSource : DataSource;
let testContainer : StartedPostgreSqlContainer;

beforeAll(async () => {
    testContainer = await new PostgreSqlContainer("postgres:17.2").start();
    TestDataSource = TestUtils.createTestDataSource(
        testContainer.getHost(),
        testContainer.getFirstMappedPort());
    await TestDataSource.initialize();
    userRepo = TestDataSource.getRepository(User);
    loginRepo = TestDataSource.getRepository(Login)
}, 50000);

afterAll(async () => {
    await TestDataSource.destroy();
    await testContainer.stop();
});




describe("LoginRepository Tests", () => {
    beforeEach(async () => {
        await TestUtils.clearTables(TestDataSource);
        await TestUtils.addFixtureData(TestDataSource);        
    });


    describe("addLogin Tests", () => {
        test("Adds new login to database", async () => {
            // Arrange 
            const loginRepository = new LoginRepository(TestDataSource);
            
            const testIP = "test.ip.address";
            const user = await userRepo.findOneBy({email: TEST_USERS[0].email});
            
            // Act
            const addLoginResult = await loginRepository.addLogin(
                testIP,
                user!
            );
            const retrievedLogin = await loginRepo.findOneBy({ip: testIP});

            // Assert
            expect(addLoginResult.ip).toBe(testIP);
            expect(addLoginResult.user).toMatchObject(user!);
            expect(retrievedLogin).not.toBeNull()
        });
    });
});