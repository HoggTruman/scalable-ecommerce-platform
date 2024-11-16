import { validate } from "class-validator";
import { LoginDto } from "../../dto/LoginDto";

const VALID_EMAIL: string = "example@example.com";
const VALID_PASSWORD: string = "Password1";


describe("LoginDto validation tests", () => {
    test.each([
        "Password1", // no symbols
        "aaaa23142$!$Aaoanfnfipowahafwipfhbiapwsf", // max length
        "pass1Aa!" // min length
    ]) ("No errors with valid password (%s)", async testPassword => {
        // Arrange
        const testDto : LoginDto = new LoginDto(
            VALID_EMAIL,
            testPassword
        );

        // Act
        const errors = await validate(testDto);

        // Assert
        expect(errors).toEqual([]);
    });


    test("Receive an error when password below 8 characters", async () => {
        // Arrange
        const testDto : LoginDto = new LoginDto(
            VALID_EMAIL,
            "1aA!abc"
        );

        // Act
        const errors = await validate(testDto);

        // Assert
        expect(errors.length).toEqual(1);
    });


    test("Receive an error when password above 40 characters", async () => {
        // Arrange
        const testDto : LoginDto = new LoginDto(
            VALID_EMAIL,
            "1Aa!sfhukkhsfudkudksfdkhfsdkhfdsksfdhksdfhksfdkdsfukdusfkhsfukufds"
        );

        // Act
        const errors = await validate(testDto);

        // Assert
        expect(errors.length).toEqual(1);
    });


    test("Receive an error when password contains no digits", async () => {
        // Arrange
        const testDto : LoginDto = new LoginDto(
            VALID_EMAIL,
            "Aa!saaaaa"
        );

        // Act
        const errors = await validate(testDto);

        // Assert
        expect(errors.length).toEqual(1);
    });


    test("Receive an error when password contains no uppercase characters", async () => {
        // Arrange
        const testDto : LoginDto = new LoginDto(
            VALID_EMAIL,
            "1a!saaaaa"
        );

        // Act
        const errors = await validate(testDto);

        // Assert
        expect(errors.length).toEqual(1);
    });


    test("Receive an error when password contains no lowercase characters", async () => {
        // Arrange
        const testDto : LoginDto = new LoginDto(
            VALID_EMAIL,
            "1!AAAAAAAA"
        );

        // Act
        const errors = await validate(testDto);

        // Assert
        expect(errors.length).toEqual(1);
    });


    test("Receive an error when password is null", async () => {
        // Arrange
        const testDto : LoginDto = new LoginDto(
            VALID_EMAIL,
            null!
        );

        // Act
        const errors = await validate(testDto);

        // Assert
        expect(errors.length).toEqual(1);
    });


    test("Receive an error when password is undefined", async () => {
        // Arrange
        const testDto : LoginDto = new LoginDto(
            VALID_EMAIL,
            undefined!
        );

        // Act
        const errors = await validate(testDto);

        // Assert
        expect(errors.length).toEqual(1);
    });


    test("Receive an error when email is null", async () => {
        // Arrange
        const testDto : LoginDto = new LoginDto(
            null!,
            VALID_PASSWORD
        );

        // Act
        const errors = await validate(testDto);

        // Assert
        expect(errors.length).toEqual(1);
    });


    test("Receive an error when email is undefined", async () => {
        // Arrange
        const testDto : LoginDto = new LoginDto(
            undefined!,
            VALID_PASSWORD
        );

        // Act
        const errors = await validate(testDto);

        // Assert
        expect(errors.length).toEqual(1);
    });

})