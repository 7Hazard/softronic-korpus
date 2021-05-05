import { getDb } from "../database"
import { Synonym, Synonyms } from "../entities/Synonym"
import { Words } from "../entities/Phrase"
import { authToken } from "../middlewares/auth"
import Validator from "validatorjs"
import { Routes } from "./Routes"

export default new Routes("/synonyms")
    .post("/", [authToken], async (req, res) => {

        let validation = new Validator(req.body, {
            phrase: ["required", "integer"],
            meaning: ["required", "integer"]
        })

        if (validation.fails()) {
            res.status(400).json(validation.errors)
            return
        } else if (validation.passes()) {
            let phrase = req.body.phrase
            let meaning = req.body.meaning
            // if you put same id on phrase and meaning
            if (phrase == meaning) {
                res.status(400).json({ error: "phrase cannot be same as meaning" })
                return;
            }

            if ((await Words.get(phrase)) == undefined || (await Words.get(meaning)) == undefined) {
                res.status(409).json({ error: "One of the IDs do not exist" })
                return
            }

            let isValidInput = await Synonyms.isValidInput(phrase, meaning)

            if (isValidInput) {
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
                    if (error.errno == 19) {
                        res.status(400).json({ error: error.toString() })
                    }
                    res.status(500).json()
                }
            } else {
                res.status(400).json({ error: "No circular or transitive dependencies allowed" })
                return;
            }
        }
    })
    .get("/", [], async (req, res) => {
        try {
            let all = await Synonyms.getAll()
            res.status(200).json(all)
        } catch (error) {
            console.error(error)
            res.status(500).json()
        }
    })
    .get("/:phraseid", [], async (req, res) => {
        // TODO validate
        let phraseid = parseInt(req.params["phraseid"])
        try {
            let synonym = await Synonyms.getByPhrase(phraseid)
            res.status(200).json(synonym)
        } catch (error) {
            console.error(error)
            res.status(500).json()
        }
    })
    .put("/", [authToken], async (req, res) => {
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
        if ((await Synonyms.getSynonym(phrase, meaning)) == undefined) {
            res.status(400).json({ error: "The synonym does not exist!" })
            return
        }

        try {
            if (await Synonyms.isValidInput(phrase, newMeaning, meaning)) {
                let result = await getDb()
                    .getRepository(Synonym)
                    .createQueryBuilder("synonym")
                    .update()
                    .set({ meaning: newMeaning })
                    .where("phrase = :phrase", { phrase })
                    .andWhere("meaning = :meaning", { meaning })
                    .execute()

                res.status(200).json({
                    phrase,
                    newMeaning
                })
            } else res.status(400).json({ error: "No circular or transitive dependencies allowed" })
        } catch (error) {
            console.error(error)
            res.status(400).json(error.toString)
            return
        }
    })
    .delete("/", [authToken], async (req, res) => {

        let validation = new Validator(req.body, {
            ids: "array|required",
            "ids.*": "integer",
        })

        if (validation.fails()) {
            res.status(400).json(validation.errors)
        } else if (validation.passes()) {
            let synonyms = await Synonyms.getSynonymsById(req.body.ids)
            try {
                let deletedIds = []
                for (const synonym of synonyms) {
                    let phrase = await Words.getOneById(synonym.phrase)
                    deletedIds.push(phrase.id)
                }
                await getDb().manager.delete(Synonym, req.body.ids)
                res.status(200).json({ deleted: deletedIds })
            } catch (error) {
                res.status(500).json()
            }
        }
    })