import korpusapi from "express";
import "reflect-metadata";
import { Word, Words } from "./entities/Word";
import bodyparser from "body-parser";
import * as database from "./database";
import { Server } from "http";

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

    const app = korpusapi();
    app.use(bodyparser.json({}));

    app.get("/words", async (req, res) => {
        let getAll = await db.manager.find(Word);
        res.status(200).json(getAll);
    });
    app.get("/words/:wordid", async (req, res) => {
        let wordid = req.params.wordid;
        const wordsById = await db.manager.findOne(Word, wordid); // find by id

        res.status(200).json(wordsById);
    });

    app.post("/words", async (req, res) => {
        let text = req.body.text;
        let word = new Word(text);
        word = await db.getRepository(Word).save(new Word(text));
        res.status(200).json(word);
    });

    app.put('/words/:wordid', async (req, res) => {
        let wordid = req.params.wordid
        let text = req.body.text;

        await db
            .createQueryBuilder()
            .update(Word)
            .set({ text: text })
            .where("id = :id", { id: wordid })
            .execute();
        res.status(200).json()
    })

    app.delete('/words/:wordid', async (req, res) => {
        let wordid = req.params.wordid

        await db
            .createQueryBuilder()
            .delete()
            .from(Word)
            .where("id = :id", { id: wordid })
            .execute();

        res.status(200).json()
    })

    // let word = new Word;
    // word.text = "HEJ";
    // await connection.manager.save(word);
    //connection.getRepository(Word).insert(word);

    app.get("/", (req, res) => {
        res.status(200).json({ message: "Hello World" });
    });

    let server = await new Promise<Server>((resolve, reject) => {
        let server = app.listen(port, () => {
            if (logging)
                console.log(`Example app listening at http://localhost:${port}`);
            resolve(server);
        });
    });

    return {
        db,
        app,
        server,
    };
}
