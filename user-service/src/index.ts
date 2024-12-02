import dotenv from 'dotenv';
import { createApp } from './app';
import { AppDataSource } from './data-source';

dotenv.config();

async function main() {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        const app = createApp(AppDataSource);        

        const Port = process.env.PORT;
        if (Port === undefined) {
            throw Error("PORT environment variable must be set.");
        }

        app.listen(Port, () => {
            console.log(`Server is running at http://localhost:${Port}`);
        });
    } catch (err) {
        throw err;
    }    
}


main();

