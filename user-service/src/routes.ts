import express, { Router, Request, Response } from "express";

const userRouter : Router = express.Router();


userRouter.get("/", (req: Request, res: Response) => {
    res.send("User service reached!");
});

userRouter.post("/login", (req: Request, res: Response) => {

});

userRouter.post("/register", (req: Request, res: Response) => {

});


export { userRouter };