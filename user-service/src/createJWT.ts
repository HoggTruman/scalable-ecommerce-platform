import { User } from "./entity/User";
import jwt from "jsonwebtoken";


export function createJWT(user: User, signingKey: string) : string {
    return jwt.sign(
        { 
            "customer_id": user.id 
        }, 
        signingKey, 
        {
            algorithm: "HS256",
            expiresIn: '1h',
            issuer:  "ecommerce-platform"            
        }
    );
}