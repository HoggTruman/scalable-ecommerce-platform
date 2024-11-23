import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { app } from './app';

dotenv.config();

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        throw Error(err);
    })

const Port = process.env.PORT;
if (Port === undefined) {
    throw Error("PORT environment variable must be set.");
}

app.listen(Port, () => {
    console.log(`Server is running at http://localhost:${Port}`);
});
