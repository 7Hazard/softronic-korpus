//import express, { json } from "express";
import "reflect-metadata";
import express from "express";
import bodyparser from "body-parser";
import * as database from "./database";
import { Server } from "http";
// ES6
import Validator from 'validatorjs';
import { DeleteQueryBuilder, EntityNotFoundError, FindRelationsNotFoundError, QueryFailedError, SelectQueryBuilder, UsingJoinTableIsNotAllowedError } from "typeorm";
import { argon2id, argon2Verify } from "hash-wasm";
import { User, Users } from "./entities/User";
import jwt from "jsonwebtoken";
import routers from "./routes/all"
import { Word, Words } from "./entities/Word";

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

    app.get("/words", async (req, res) => {
        let getAll = await Words.get();
        res.status(200).json(getAll);
    });
    app.get("/words/:wordid", async (req, res) => {
        let wordid = parseInt(req.params.wordid);
        const wordsById = await Words.get(wordid); // find by id

        res.status(200).json(wordsById);
    });

    app.get("/synonyms", async (req, res) => {
        let getAllSynonyms = await Words.getSynonyms();
        res.status(200).json(getAllSynonyms);
    })

    app.get("/synonyms/:wordid", async (req, res) => {
        let getSpecificSynonym = await Words.getSynonyms(parseInt(req.params.wordid));
        res.status(200).json(getSpecificSynonym);
    })

    app.post("/words", async (req, res) => {
        let text = req.body.text;
        let word = new Word(text);

        let validation = new Validator(req.body, {
            //reqirement
            text: 'alpha|min:1|max:100|required'
        });

        if (validation.fails()) {
            res.status(400).json(validation.errors);
        } else if (validation.passes()) {
            try {
                word = await db.getRepository(Word).save(new Word(text));
                res.status(200).json(word);
            } catch (error) {
                if (error instanceof QueryFailedError) {
                    res.status(409).json();
                }
            }

        }
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

    app.delete('/words', async (req, res) => {

        let validation = new Validator(req.body, {
            //reqirement
            ids: 'array|required',
            'ids.*': 'integer'
        });

        if (validation.fails()) {
            res.status(400).json(validation.errors);
        } else if (validation.passes()) {

            try {
                await db.manager.delete(Word, req.body.ids); // find by id
                res.status(200).json();
            } catch (error) {
                res.status(500).json();
            }
        }

    })


    app.get("/", (req, res) => {
        res.status(200).json({ message: "Hello World" });
    });

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


    app.post("/signin", async (req, res) => {
        let name = req.body.name;
        let passwordInput = req.body.password;

        let user = await Users.getOne(name);

        let namePrimary = req.params.namePrimary;

        const isValid = await argon2Verify({
            password: passwordInput,
            hash: user.hashedPassword,
        });
        if (isValid)
        {
            let token = jwt.sign({name: user.name},'shhhhh');
            jwt.sign({data: 'foobar'}, 'secret', { expiresIn: '24h' });

            await db
            .createQueryBuilder()
            .update(User)
            .set({ token: token })
            .where("name = :name", { name: user.name })
            .execute();

              

            res.status(200).json({token});

        }
        else res.status(401).json()
    })

    app.get("/signin", (req, res) => {
        res.status(200).json({ name: "Emre" });
    });




    return {
        db,
        app,
        server,
    };

};



