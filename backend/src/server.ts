import "reflect-metadata";
import express from "express";
import bodyparser from "body-parser";
import * as database from "./database";
import { Server } from "http";
import routers from "./routes/all"

export const app = express();
app.use(bodyparser.json({}));

export async function start({
    port = 2525,
    logging = true,
    dbpath = "database.db",
}) {
    // setup database
    let db = await database.start(logging, dbpath);
    if (logging)
        console.log("SQLite initialized in file 'database.db'");

    const queryRunner = db.createQueryRunner();

    app.use(routers)

    let server = await new Promise<Server>((resolve, reject) => {
        let server = app.listen(port, () => {
            if (logging)
            {
                for (const router of routers) {
                    for (const layer of router.stack) {
                        let methods = []
                        for(const prop in layer.route.methods)
                        {
                            if(layer.route.methods[prop]) methods.push(prop.toUpperCase())
                        }
                        console.log(`${methods}\t${layer.route.path}`);
                    }
                }
                console.log(`Listening at http://localhost:${port}`);
            }
            resolve(server);
        });
    });

    return {
        db,
        app,
        server,
    };

}
