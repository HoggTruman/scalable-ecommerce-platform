import { IsEmail, IsString, IsStrongPassword, MaxLength } from "class-validator";

export class LoginDto {
    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MaxLength(40)
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    })
    password: string;
}
