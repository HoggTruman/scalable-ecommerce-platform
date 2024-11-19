import { createJWT } from "../src/createJWT"
import { User } from "../src/entity/User";
import jwt from "jsonwebtoken";

describe("createJWT Tests", () => {
    test("Produces valid json web token", () => {
        // Arrange
        const SigningKey = "test";

        const user: User = new User();
        user.id = "id"
        user.firstName = "firstName";
        user.lastName = "lastName";
        user.email = "email";
        user.password = "password";

        // Act
        const token = createJWT(user, SigningKey);
        const result = jwt.verify(token, SigningKey);        

        // Assert
        expect(result).toHaveProperty('customer_id');
        expect(result).toHaveProperty('exp');
        expect(result).toHaveProperty('iat');
        expect(result).toHaveProperty('iss');
    })
})