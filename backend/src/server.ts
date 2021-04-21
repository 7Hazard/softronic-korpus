import express from "express";
import "reflect-metadata";
import { Word, Words } from "./entities/Word";
import bodyparser from "body-parser";
import * as database from "./database";
import { Server } from "http";
// ES6
import Validator from 'validatorjs';
import { DeleteQueryBuilder, EntityNotFoundError, FindRelationsNotFoundError, QueryFailedError, SelectQueryBuilder } from "typeorm";
import { Synonym, Synonyms } from "./entities/Synonym";


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

    const app = express();
    app.use(bodyparser.json({}));

    app.get("/words", async (req, res) => {
        let getAll = await Words.get();
        res.status(200).json(getAll);
    });
    app.get("/words/:wordid", async (req, res) => {
        let wordid = parseInt(req.params.wordid);
        const wordsById = await Words.get(wordid); // find by id

        res.status(200).json(wordsById);
    });

    app.post("/synonyms", async (req,res) => {

        let id1 = req.body.id1;
        let id2 = req.body.id2;

        
        if(!Synonyms.validate(id1,id2)){
            try {
                const word = await database.get().manager.findOne(Word,id1);
                //const synonym = new Synonym(id1,id2);
                await db
                .createQueryBuilder()
                .insert()
                .into(Synonym)
                .values([{ wordId_1: id1, wordId_2:id2}])
                .execute();

                res.status(200).json();
            } catch (error) {
                console.log(error);
                res.status(400).json();
            }
        } else res.status(400).json("No inverse or circular dependencies allowed");

       
    })

    app.put("/synonyms", async(req,res)=>{

        let newId1 = req.body.id1;
        let newId2 = req.body.id2;

        

    })

    app.get("/synonyms", async (req,res) =>{
        console.log("Trying to get synonyms")
        try {
            let getAllSynonyms = await Synonyms.getSynonyms();
            console.log(getAllSynonyms)
            res.status(200).json(getAllSynonyms);
        } catch (error) {
            console.log(error);
            res.status(400).json();
        }
        
    })

    app.get("/synonyms/:wordid", async (req, res) =>{
        try {
            let getSpecificSynonym = await Synonyms.getSynonyms(parseInt(req.params.wordid));
            res.status(200).json(getSpecificSynonym);
        } catch (error) {
            console.log(error);
            res.status(400).json();
        }
        
    })

    app.post("/words", async (req, res) => {
        let text = req.body.text;
        let word = new Word(text);

        let validation = new Validator(req.body, {
            //reqirement
            text: ['required','min:1','max:100', 'regex:/^[A-z0-9%&/-]+$/']
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
