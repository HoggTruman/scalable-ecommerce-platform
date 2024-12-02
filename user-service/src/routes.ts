import bcrypt from "bcrypt";
import { validateOrReject } from "class-validator";
import dotenv from "dotenv";
import express, { Request, Response, Router } from "express";
import { DataSource } from "typeorm";
import { createJWT } from "./createJWT";
import { LoginDto } from "./dto/LoginDto";
import { RegisterDto } from "./dto/RegisterDto";
import { LoginRepository } from "./respository/LoginRepository";
import { UserRepository } from "./respository/UserRepository";

dotenv.config();


function createUserRouter(dataSource: DataSource) : Router {
    const SigningKey = process.env.JWT_SIGNING_KEY
    if (SigningKey === undefined) {
        throw Error("JWT_SIGNING_KEY environment variable must be set.");
    }

    const userRepository = new UserRepository(dataSource);
    const loginRepository = new LoginRepository(dataSource);

    const userRouter : Router = express.Router();
    userRouter.use(express.json());


    userRouter.get("/", (req: Request, res: Response) => {
        res.send("User service reached.");
    });


    userRouter.post("/login", (req: Request, res: Response) => {
        const loginDto= new LoginDto(
            req.body?.email,
            req.body?.password
        );

        validateOrReject(loginDto, { 
            forbidNonWhitelisted: true
        }).then(async () => {
            const user = await userRepository.getUserByEmail(loginDto.email)
            if (user === null ||
                await bcrypt.compare(loginDto.password, user.password) == false
            ) {
                return res.status(401).send("Incorrect email or password.");
            }
        
            await loginRepository.addLogin(req.ip || "", user);

            return res.send(createJWT(user, SigningKey));
        }).catch(errors => {
            console.log(errors);
            return res.status(400).send("Invalid Request Body.");
        });
    });


    userRouter.post("/register", (req: Request, res: Response) => {
        const registerDto = new RegisterDto(
            req.body?.firstName,
            req.body?.lastName,
            req.body?.email,
            req.body?.password
        );

        validateOrReject(registerDto, { 
            forbidNonWhitelisted: true 
        }).then(async () => {
            const user = await userRepository.addUser(
                registerDto.firstName,
                registerDto.lastName,
                registerDto.email,
                registerDto.password
            )
            
            if (user === null) {
                return res.status(401).send("User already registered with the provided email address.");
            }

            await loginRepository.addLogin(req.ip || "", user);

            return res.send(createJWT(user, SigningKey));
        })
        .catch(errors => {
            console.log(errors);
            return res.status(400).send("Invalid Request Body.");
        });    
    });

    return userRouter
}


export { createUserRouter };

