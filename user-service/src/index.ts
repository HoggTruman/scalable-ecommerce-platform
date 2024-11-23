import dotenv from 'dotenv';
import { app } from './app';
import { getDataSource } from './data-source';

dotenv.config();

const dataSource = getDataSource();

async function main() {
    try {
        await dataSource.initialize();
        console.log("Data Source has been initialized!");

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

