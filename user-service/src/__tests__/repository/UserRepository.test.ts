import { User } from "../../entity/User"
import { TestUtils } from "../../../test/TestUtils"
import { Repository } from "typeorm";
import { Login } from "../../entity/Login";
import { TestDataSource } from "../../../test/test-data-source";
import { TEST_USERS } from "../../../test/fixtureData";
import { UserRepository } from "../../respository/UserRepository";

let userRepo: Repository<User>;
let loginRepo: Repository<Login>;


beforeAll(async () => {
    userRepo = TestDataSource.getRepository(User);
    loginRepo = TestDataSource.getRepository(Login);
});


describe("UserRepository Tests", () => {
    beforeEach(async () => {
        await TestUtils.clearTables();
        await TestUtils.addFixtureData();        
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

            const newUser = new User();
            newUser.firstName = "testfirstName";
            newUser.lastName = "testLastName";
            newUser.email = "testEmail";
            newUser.passHash = "testPassHash";
            newUser.salt = "testSalt";
            newUser.registeredAt = 984148793;
            
            // Act
            const addUserResult = await userRepository.addUser(newUser);
            const retrievedUser = await userRepo.findOneBy({email: newUser.email});

            // Assert
            expect(addUserResult).toMatchObject(newUser);
            expect(retrievedUser).toMatchObject(newUser);
        });

        test("New user not added when email already present in database", async () => {
            // Arrange
            const userRepository = new UserRepository(TestDataSource);
            const testUser = TEST_USERS[0];

            const newUser = new User();
            newUser.firstName = "newFirstName";
            newUser.lastName = "newLastName";
            newUser.email = testUser.email;
            newUser.passHash = "newPassHash";
            newUser.salt = "newSalt";
            newUser.registeredAt = 11;

            // Act
            const addUserResult = await userRepository.addUser(newUser);
            const retrievedUser = await userRepo.findOneBy({email: newUser.email});

            // Assert
            expect(addUserResult).toBeNull();
            expect(retrievedUser).not.toMatchObject(newUser);
            expect(retrievedUser).toMatchObject(testUser);
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