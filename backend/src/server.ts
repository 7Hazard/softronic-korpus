import "reflect-metadata"
import express from "express"
import bodyparser from "body-parser"
import * as database from "./database"
import routers from "./routes/all"
import * as http from "http"
import cors from "cors"

export const app = express()
app.use(bodyparser.json({}))
app.use(cors())

let server: http.Server

export async function start({
    port = 2525,
    logging = true,
    dbpath = "database.db",
}) {
    // setup database
    let db = await database.start(logging, dbpath)
    if (logging) console.log("SQLite initialized in file 'database.db'")

    db.createQueryRunner()

    app.use(routers)
    server = http.createServer(app)
    if (port != null) server.listen(port)
    if (logging) {
        // log available routes
        for (const router of routers) {
            for (const layer of router.stack) {
                let methods = []
                if (layer.route) {
                    for (const prop in layer.route.methods) {
                        if (layer.route.methods[prop])
                            methods.push(prop.toUpperCase())
                    }
                    console.log(`${methods}\t${layer.route.path}`)
                }
            }
        }
        console.log(`Listening at http://localhost:${port}`)
    }

    return {
        db,
        app,
        server,
    }
}

export async function stop() {
    await new Promise((resolve, reject) => {
        server.close((err) => {
            resolve(null)
        })
    })
}
