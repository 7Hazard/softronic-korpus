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
                let synonym = new Synonym(phrase,meaning)
                try {
                    synonym = await getDb().getRepository(Synonym).save(synonym);

                    res.status(200).json({
                        phrase,
                        meaning
                    })
                } catch (error) {
                    console.log(error)
                    if (error.errno == 19) {
                        res.status(400).json({ error: error })
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

            if (phrase == meaning) {
                res.status(400).json({ error: "phrase cannot be same as meaning" })
                return;
            }
            if (
                (await Words.get(phrase)) == undefined ||
                (await Words.get(meaning)) == undefined
            ) {
                res.status(400).json({ error: "One of the IDs do not exist" })
                return
            }
            if ((await Synonyms.getSynonymsById(phrase)) == undefined) {
                res.status(400).json({ error: "The synonym does not exist!" })
                return
            }

            try {
                if (await Synonyms.isValidInput(phrase, meaning)) {
                    await getDb()
                        .createQueryBuilder()
                        .update(Synonym)
                        .set({ meaning: meaning })     // testade att trimma
                        .where("phrase = :phrase", { phrase })
                        .execute()

                    res.status(200).json({
                        phrase,
                        meaning
                    })
                } else res.status(400).json({ error: "No circular or transitive dependencies allowed" })
            } catch (error) {
                console.error(error)
                res.status(400).json(error)
                return
            }
        }
    })
    .delete("/", [authToken], async (req, res) => {

        let validation = new Validator(req.body, {
            //reqirement
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
                res.status(200).json({ deleted: deletedIds })
                await getDb().manager.delete(Synonym, req.body.ids)

            } catch (error) {
                res.status(500).json()
            }
        }
    })