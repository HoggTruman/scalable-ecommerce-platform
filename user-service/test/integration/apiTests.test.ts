import jwt from "jsonwebtoken";
import request from "supertest";
import { app } from "../../src/app";
import { TEST_PASSWORD, TEST_USERS } from "../fixtureData";
import { TestUtils } from "../TestUtils";
import { TestDataSource } from "../../src/data-source";


const UserEndpoint = "/api/user";
const LoginEndpoint = "/api/user/login";
const RegisterEndpoint = "/api/user/register";

beforeAll(async () => {
    await TestDataSource.initialize()
})

beforeEach(async () => {
    await TestUtils.clearTables();
    await TestUtils.addFixtureData();
})

afterAll(async () => {
    await TestDataSource.destroy()
});


describe("API tests", () => {
    describe("GET /api/user", () => {
        test("Response contains status code 200", done => {
            request(app)
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

            request(app)
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
            request(app)
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

            request(app)
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

            request(app)
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

            request(app)
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

            request(app)
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

            request(app)
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

            request(app)
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

            request(app)
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

            request(app)
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

            request(app)
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
            request(app)
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

            request(app)
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

            request(app)
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

            request(app)
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

            request(app)
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

            request(app)
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

            request(app)
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

            request(app)
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

            request(app)
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

            request(app)
                .post(RegisterEndpoint)
                .send(body)
                .expect(401)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        })

    });
});