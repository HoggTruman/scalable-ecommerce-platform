import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { LoginDto } from "./dto/LoginDto";
import { validateOrReject } from "class-validator";
import { UserRepository } from "./respository/UserRepository";
import { AppDataSource } from "./data-source";
import { createJWT } from "./createJWT";
import { LoginRepository } from "./respository/LoginRepository";
import { RegisterDto } from "./dto/RegisterDto";


const SigningKey = process.env.JWT_SIGNING_KEY
if (SigningKey === undefined) {
    throw Error("JWT_SIGNING_KEY environment variable must be set.");
}

const userRepository = new UserRepository(AppDataSource);
const loginRepository = new LoginRepository(AppDataSource);

const userRouter : Router = express.Router();


userRouter.get("/", (req: Request, res: Response) => {
    res.send("User service reached!");
});


userRouter.post("/login", (req: Request, res: Response) => {
    const loginDto: LoginDto = req.body;
    validateOrReject(loginDto, { 
        forbidNonWhitelisted: true 
    }).catch(errors => {
        return res.status(400).send("Invalid Request.");
    });

    userRepository.getUserByEmail(loginDto.email).then(async user => {
        if (user === null ||
            await bcrypt.compare(loginDto.password, user.password) == false
        ) {
            return res.status(401).send("Incorrect email or password.");
        }

        await loginRepository.addLogin(req.ip || "", user);

        return res.send(createJWT(user, SigningKey));
    });
});


userRouter.post("/register", (req: Request, res: Response) => {
    const registerDto: RegisterDto = req.body;
    validateOrReject(registerDto, { 
        forbidNonWhitelisted: true 
    }).catch(errors => {
        return res.status(400).send("Invalid Request.");
    });

    userRepository.addUser(
        registerDto.firstName,
        registerDto.lastName,
        registerDto.email,
        registerDto.password
    ).then(async user => {
        if (user === null) {
            return res.status(401).send("User already registered with the provided email address.");
        }

        await loginRepository.addLogin(req.ip || "", user);

        return res.send(createJWT(user, SigningKey));
    });
});


export { userRouter };