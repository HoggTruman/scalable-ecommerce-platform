import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Express } from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { DataSource } from "typeorm";
import { createApp } from "../../src/app";
import { TEST_PASSWORD, TEST_USERS } from "../fixtureData";
import { TestUtils } from "../TestUtils";

const TEST_SIGNING_KEY = "TESTSIGNINGKEY!!!!!!!!!!!!!!!!!!!!!!";

const UserEndpoint = "/api/user";
const LoginEndpoint = "/api/user/login";
const RegisterEndpoint = "/api/user/register";

let TestDataSource : DataSource;
let testContainer : StartedPostgreSqlContainer;
let App : Express;


beforeAll(async () => {
    testContainer = await new PostgreSqlContainer("postgres:17.2").start();
    TestDataSource = TestUtils.createTestDataSource(
        testContainer.getHost(),
        testContainer.getFirstMappedPort());
    await TestDataSource.initialize();
    App = createApp(TestDataSource, TEST_SIGNING_KEY);
}, 50000);

afterAll(async () => {
    await TestDataSource.destroy();
    await testContainer.stop();
});

beforeEach(async () => {
    await TestUtils.clearTables(TestDataSource);
    await TestUtils.addFixtureData(TestDataSource);
})




describe("API tests", () => {
    describe("GET /api/user", () => {
        test("Response contains status code 200", done => {
            request(App)
                .get(UserEndpoint)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });        
    });




    describe("POST /api/user/login", () => {
        test("Returns status code 200 with valid body and existing user", done => {
            const testUser = TEST_USERS[0];            
            const body = {
                email: testUser.email,
                password: TEST_PASSWORD
            };

            request(App)
                .post(LoginEndpoint)
                .send(body)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    const decoded = jwt.decode(res.text);
                    expect(decoded).toHaveProperty('customer_id');
                    expect(decoded).toHaveProperty('iat');
                    expect(decoded).toHaveProperty('exp');
                    expect(decoded).toHaveProperty('iss');
                    return done();
                });
        })


        test("Returns status code 400 with empty body", done => {
            request(App)
                .post(LoginEndpoint)
                .send({})
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 400 with invalid email", done => {
            const body = {
                email: "bademail",
                password: TEST_PASSWORD
            };

            request(App)
                .post(LoginEndpoint)
                .send(body)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 400 with password shorter than 8 characters", done => {
            const testUser = TEST_USERS[0]; 

            const body = {
                email: testUser.email,
                password: "Aa1abcd"
            };

            request(App)
                .post(LoginEndpoint)
                .send(body)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 400 with password longer than 40 characters", done => {
            const testUser = TEST_USERS[0]; 

            const body = {
                email: testUser.email,
                password: "Aa1abcdfakggwugkufgkuagkfugkufafgakuafkgu"
            };

            request(App)
                .post(LoginEndpoint)
                .send(body)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 400 when password contains no upper case characters", done => {
            const testUser = TEST_USERS[0]; 

            const body = {
                email: testUser.email,
                password: "aa1abcdfaf"
            };

            request(App)
                .post(LoginEndpoint)
                .send(body)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 400 when password contains no lower case characters", done => {
            const testUser = TEST_USERS[0]; 

            const body = {
                email: testUser.email,
                password: "AA1ABCDEF"
            };

            request(App)
                .post(LoginEndpoint)
                .send(body)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 400 when password contains no digits", done => {
            const testUser = TEST_USERS[0]; 

            const body = {
                email: testUser.email,
                password: "AaABdcEFfos"
            };

            request(App)
                .post(LoginEndpoint)
                .send(body)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 401 email does not match an existing user", done => {
            const body = {
                email: "unregistereduser@example.com",
                password: TEST_PASSWORD
            };

            request(App)
                .post(LoginEndpoint)
                .send(body)
                .expect(401)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 401 when incorrect password provided", done => {
            const testUser = TEST_USERS[0]; 

            const body = {
                email: testUser.email,
                password: "ValidButIncorrect1"
            };

            request(App)
                .post(LoginEndpoint)
                .send(body)
                .expect(401)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });
    })




    describe("POST /api/user/register", () => {
        test("Returns status code 200 with valid body and new email", done => {         
            const body = {
                firstName: "testFirstName",
                lastName: "testLastName",
                email: "newUser@example.com",
                password: TEST_PASSWORD
            };

            request(App)
                .post(RegisterEndpoint)
                .send(body)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    const decoded = jwt.decode(res.text);
                    expect(decoded).toHaveProperty('customer_id');
                    expect(decoded).toHaveProperty('iat');
                    expect(decoded).toHaveProperty('exp');
                    expect(decoded).toHaveProperty('iss');
                    return done();
                });
        });


        test("Returns status code 400 with empty body", done => {
            request(App)
                .post(RegisterEndpoint)
                .send({})
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 400 with blank firstName", done => {
            const body = {
                firstName: "",
                lastName: "testLastName",
                email: "newUser@example.com",
                password: TEST_PASSWORD
            };

            request(App)
                .post(RegisterEndpoint)
                .send(body)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 400 with blank lastName", done => {
            const body = {
                firstName: "testFirstName",
                lastName: "",
                email: "newUser@example.com",
                password: TEST_PASSWORD
            };

            request(App)
                .post(RegisterEndpoint)
                .send(body)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 400 with invalid email", done => {
            const body = {
                firstName: "testFirstName",
                lastName: "testLastName",
                email: "BADEMAIL",
                password: TEST_PASSWORD
            };

            request(App)
                .post(RegisterEndpoint)
                .send(body)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 400 with password shorter than 8 characters", done => {
            const body = {
                firstName: "testFirstName",
                lastName: "testLastName",
                email: "newUser@example.com",
                password: "Aa1abcd"
            };

            request(App)
                .post(RegisterEndpoint)
                .send(body)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 400 with password longer than 40 characters", done => {
            const body = {
                firstName: "testFirstName",
                lastName: "testLastName",
                email: "newUser@example.com",
                password: "Aa1abcdfakggwugkufgkuagkfugkufafgakuafkgu"
            };

            request(App)
                .post(RegisterEndpoint)
                .send(body)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 400 when password contains no upper case characters", done => {
            const body = {
                firstName: "testFirstName",
                lastName: "testLastName",
                email: "newUser@example.com",
                password: "aa1abcdfaf"
            };

            request(App)
                .post(RegisterEndpoint)
                .send(body)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 400 when password contains no lower case characters", done => {
            const body = {
                firstName: "testFirstName",
                lastName: "testLastName",
                email: "newUser@example.com",
                password: "AA1ABCDEF"
            };

            request(App)
                .post(RegisterEndpoint)
                .send(body)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 400 when password contains no digits", done => {
            const body = {
                firstName: "testFirstName",
                lastName: "testLastName",
                email: "newUser@example.com",
                password: "AaABdcEFfos"
            };

            request(App)
                .post(RegisterEndpoint)
                .send(body)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });


        test("Returns status code 401 when email matches existing user", done => {
            const existingUser = TEST_USERS[0];

            const body = {
                firstName: "testFirstName",
                lastName: "testLastName",
                email: existingUser.email,
                password: TEST_PASSWORD
            };

            request(App)
                .post(RegisterEndpoint)
                .send(body)
                .expect(401)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });
    });



    
    describe("Multiple Endpoint Tests", () => { 
        test("POST /api/user/register into POST /api/user/login for same user returns 200", done => {
            // Arrange
            const registerBody = {
                firstName: "testFirstName",
                lastName: "testLastName",
                email: "newUser@example.com",
                password: TEST_PASSWORD
            };

            const loginBody = {
                email: registerBody.email,
                password: registerBody.password
            };

            // Act + Assert
            request(App)
                .post(RegisterEndpoint)
                .send(registerBody)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);

                    request(App)
                        .post(LoginEndpoint)
                        .send(loginBody)
                        .expect(200)
                        .end((err, res) => {
                            if (err) return done(err);
                            const decoded = jwt.decode(res.text);
                            expect(decoded).toHaveProperty('customer_id');
                            expect(decoded).toHaveProperty('iat');
                            expect(decoded).toHaveProperty('exp');
                            expect(decoded).toHaveProperty('iss');
                            return done();
                        });
                });
        });
    });
});