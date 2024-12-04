import { createApp } from './app';
import { AppDataSource } from './data-source';
import { getEnv } from './utility/getEnv';


async function main() {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        const app = createApp(AppDataSource);        

        const port = getEnv("PORT");

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (err) {
        throw err;
    }    
}


main();

