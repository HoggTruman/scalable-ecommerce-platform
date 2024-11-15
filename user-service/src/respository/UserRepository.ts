import { User } from "../entity/User";
import { DataSource } from "typeorm";
import bcrypt from "bcrypt";

export class UserRepository {
    private readonly _userRepo;

    constructor(dataSource: DataSource) {
        this._userRepo = dataSource.getRepository(User);
    }

    public async getUserByEmail(userEmail: string) : Promise<User | null> {
        return await this._userRepo.findOneBy({
            email: userEmail
        });
    }

    public async addUser(firstName: string, lastName: string, email: string, plainPassword: string) : Promise<User | null> {
        const existingUser = await this._userRepo.findOneBy({
            email: email
        });

        if (existingUser != null) {
            return null;
        }

        const newUser : User = new User();
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.email = email;
        newUser.password = await bcrypt.hash(plainPassword, 10);
        newUser.registeredAt = Date.now();

        return await this._userRepo.save(newUser);
    }

    public async deleteUserByEmail(userEmail: string) : Promise<User | null> {
        const user = await this._userRepo.findOneBy({
            email: userEmail
        });

        if (user === null) {
            return null;
        }

        return await this._userRepo.remove(user);
    }
}