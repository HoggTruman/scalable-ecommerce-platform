import dotenv from "dotenv";
dotenv.config();

export function getEnv(name: string) : string {
    if (process.env[name] === undefined) {
        throw Error(`${name} environment variable has not been set.`);
    }

    return process.env[name];
}