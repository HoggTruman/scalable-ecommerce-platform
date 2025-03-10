import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { DataSource, Repository } from "typeorm";
import { User } from "../../../src/entity/User";
import { UserRepository } from "../../../src/respository/UserRepository";
import { TEST_USERS } from "../../fixtureData";
import { TestUtils } from "../../TestUtils";


let userRepo: Repository<User>;
let TestDataSource : DataSource;
let testContainer : StartedPostgreSqlContainer;


beforeAll(async () => {
    testContainer = await new PostgreSqlContainer("postgres:17.2").start();
    TestDataSource = TestUtils.createTestDataSource(
        testContainer.getHost(),
        testContainer.getFirstMappedPort());
    await TestDataSource.initialize();
    userRepo = TestDataSource.getRepository(User);
}, 50000);

afterAll(async () => {
    await TestDataSource.destroy();
    await testContainer.stop();
});




describe("UserRepository Tests", () => {
    beforeEach(async () => {
        await TestUtils.clearTables(TestDataSource);
        await TestUtils.addFixtureData(TestDataSource);        
    });


    describe("getUserByEmail Tests", () => {
        test("Returns correct user when present", async () => {
            // Arrange
            const userRepository = new UserRepository(TestDataSource);
            const testUser = TEST_USERS[0];
            
            // Act
            const resultUser = await userRepository.getUserByEmail(testUser.email);

            // Assert
            expect(resultUser).toMatchObject(testUser);
        });


        test("returns null when not present", async () => {
            // Arrange 
            const userRepository = new UserRepository(TestDataSource);

            // Act
            const resultUser = await userRepository.getUserByEmail("EmailNotFoundInTheDatabase");

            // Assert
            expect(resultUser).toBeNull();
        });
    });




    describe("addUser Tests", () => {
        test("Adds new user to database", async () => {
            // Arrange 
            const userRepository = new UserRepository(TestDataSource);

            const testFirstName = "testfirstName";
            const testLastName = "testLastName";
            const testEmail = "testEmail";
            const testPlainPassword = "testPassword";
            
            // Act
            const addUserResult = await userRepository.addUser(
                testFirstName,
                testLastName,
                testEmail,
                testPlainPassword
            );
            const retrievedUser = await userRepo.findOneBy({email: testEmail});

            // Assert
            expect(addUserResult).not.toBeNull();
            expect(addUserResult?.firstName).toBe(testFirstName);
            expect(addUserResult?.lastName).toBe(testLastName);
            expect(addUserResult?.email).toBe(testEmail);
            expect(retrievedUser).not.toBeNull();
        });


        test("New user not added when email already present in database", async () => {
            // Arrange
            const userRepository = new UserRepository(TestDataSource);
            const existingUser = TEST_USERS[0];

            const testFirstName = "testfirstName";
            const testLastName = "testLastName";
            const testEmail = existingUser.email;
            const testPlainPassword = "testPassword";

            // Act
            const addUserResult = await userRepository.addUser(
                testFirstName,
                testLastName,
                testEmail,
                testPlainPassword
            );
            const retrievedUser = await userRepo.findOneBy({email: existingUser.email});

            // Assert
            expect(addUserResult).toBeNull();
            expect(retrievedUser).toMatchObject(existingUser);
        });
    });




    describe("deleteUserByEmail Tests", () => {
        test("Deletes user from database", async () => {
            // Arrange
            const userRepository = new UserRepository(TestDataSource);
            const testUser = TEST_USERS[0];

            // Act
            const deleteUserResult = await userRepository.deleteUserByEmail(testUser.email);
            const retrievedUser = await userRepo.findOneBy({email: testUser.email});

            // Assert            
            expect(deleteUserResult?.email).toBe(testUser.email);
            expect(retrievedUser).toBeNull();
        });


        test("Returns null when no user with provided email", async () => {
            // Arrange
            const userRepository = new UserRepository(TestDataSource);

            // Act
            const deleteUserResult = await userRepository.deleteUserByEmail("emailNotFoundInDatabase");

            // Assert
            expect(deleteUserResult).toBeNull();
        });
    }); 
});