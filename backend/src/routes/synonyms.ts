import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";

const db = database.get();

export default Router()
    .use(authenticateToken)
    .post("/synonyms", async (req, res) => {

        let id1 = req.body.id1;
        let id2 = req.body.id2;

        let result = await db.getRepository(Synonym).
            createQueryBuilder("synonym").
            where("synonym.wordId_1 = :word1Id", { word1Id: id2 }).
            andWhere("synonym.wordId_2 = :word2Id", { word2Id: id1 }).
            getOne();

        console.log(result);
        if (!result) {
            try {
                const word = await db.manager.findOne(Word, id1);
                //const synonym = new Synonym(id1,id2);
                await db
                    .createQueryBuilder()
                    .insert()
                    .into(Synonym)
                    .values([{ wordId_1: id1, wordId_2: id2 }])
                    .execute();

                //word.synonyms.push(synonym);

                res.status(200).json();
            } catch (error) {
                console.error(error);
                res.status(400).json();
            }
        } else res.status(400).json("The inverse already exists");
    })
    .get("/synonyms", async (req, res) => {
        try {
            let getAllSynonyms = await Words.getSynonyms();
            res.status(200).json(getAllSynonyms);
        } catch (error) {
            console.error(error);
            res.status(400).json();
        }
    })
    .get("/synonyms/:wordid", async (req, res) => {
        try {
            let getSpecificSynonym = await Words.getSynonyms(parseInt(req.params.wordid));
            res.status(200).json(getSpecificSynonym);
        } catch (error) {
            console.error(error);
            res.status(400).json();
        }
    })
    