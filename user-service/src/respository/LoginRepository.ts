import { Login } from "../entity/Login";
import { DataSource, Repository } from "typeorm";
import { User } from "../entity/User";


export class LoginRepository {
    private readonly _loginRepo : Repository<Login>;

    constructor(dataSource: DataSource) {
        this._loginRepo = dataSource.getRepository(Login);
    }


    public async addLogin(userIP: string, user: User) : Promise<Login> {
        const newLogin : Login = new Login();
        newLogin.ip = userIP;
        newLogin.loginAt = Date.now();
        newLogin.user = user;

        return await this._loginRepo.save(newLogin);
    }
}