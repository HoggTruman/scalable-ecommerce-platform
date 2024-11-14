import { User } from "../entity/User";
import { DataSource } from "typeorm";

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

    public async addUser(newUser: User) : Promise<User | null> {
        const existingUser = await this._userRepo.findOneBy({
            email: newUser.email
        });

        if (existingUser != null) {
            return null;
        }

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