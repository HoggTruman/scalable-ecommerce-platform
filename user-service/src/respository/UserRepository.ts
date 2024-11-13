import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

export class UserRepository {
    private readonly _userRepo = AppDataSource.getRepository(User);

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