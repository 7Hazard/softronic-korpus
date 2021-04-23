import { Router } from "express"
import { getDb } from "../database"
import { Synonym, Synonyms } from "../entities/Synonym"
import { Words } from "../entities/Word"
import { authToken } from "../middlewares/auth"

export default Router()
    .use("/synonyms", authToken)
    .post("/synonyms", async (req, res) => {
        // TODO validate
        let phrase = req.body.phrase
        let meaning = req.body.meaning

        if (await Synonyms.isValidInput(phrase, meaning)) {
            try {
                let result = await getDb()
                    .createQueryBuilder()
                    .insert()
                    .into(Synonym)
                    .values([{ phrase, meaning }])
                    .execute()

                res.status(200).json({
                    id: result.identifiers[0].id,
                    phrase,
                    meaning
                })
            } catch (error) {
                console.log(error)
                res.status(500).json()
            }
        } else
            res.status(400).json(
                "No circular or transitive dependencies allowed"
            )
    })
    .get("/synonyms", async (req, res) => {
        try {
            let all = await Synonyms.getAll()
            res.status(200).json(all)
        } catch (error) {
            console.error(error)
            res.status(500).json()
        }
    })
    .get("/synonyms/:wordid", async (req, res) => {
        // TODO validate
        let wordid = parseInt(req.params["wordid"])
        try {
            let synonym = await Synonyms.getByWord(wordid)
            res.status(200).json(synonym)
        } catch (error) {
            console.error(error)
            res.status(500).json()
        }
    })
    .put("/synonyms", async (req, res) => {
        let phrase = req.body.phrase
        let meaning = req.body.meaning
        let newMeaning = req.body.newMeaning

        if (
            (await Words.get(phrase)) == undefined ||
            (await Words.get(meaning)) == undefined ||
            (await Words.get(newMeaning)) == undefined
        ) {
            res.status(400).json({ error: "One of the IDs do not exist" })
            return
        }

        try {
            if (await Synonyms.isValidInput(phrase, newMeaning, meaning)) {
                await getDb()
                    .getRepository(Synonym)
                    .createQueryBuilder("synonym")
                    .update()
                    .set({ phrase: newMeaning })
                    .where("phrase = :phrase", { phrase })
                    .andWhere("meaning = :meaning", { meaning })
                    .execute()

                res.status(200).json()
            } else res.status(500).json()
        } catch (error) {
            console.error(error)
            res.status(500).json()
            return
        }
    })
