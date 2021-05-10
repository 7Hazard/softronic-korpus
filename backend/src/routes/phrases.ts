import { QueryFailedError } from "typeorm"
import { Phrase, Phrases } from "../entities/Phrase"
import Validator from "validatorjs"
import { getDb } from "../database"
import { authToken } from "../middlewares/auth"
import { trimText } from "../util"
import { Routes } from "./Routes"

export default new Routes("/phrases")
    .get("/", [], async (req, res) => {
        let getAll = await Phrases.getAll()
        res.status(200).json(getAll)
    })
    .get("/:phraseid", [], async (req, res) => {
        let phraseid = parseInt(req.params.phraseid)
        const phrasesById = await Phrases.getOneById(phraseid)
        if (!phrasesById) {
            res.status(404).json({
                error: "Word not found",
            })
            return
        }
        res.status(200).json(phrasesById)
    })
    .post("/", [authToken], async (req, res) => {

        let validation = new Validator(req.body, {
            text: ["required", "min:1", "max:100", "regex:/^[A-zäöåÄÖÅ0-9% &/-]+$/"],
        })

        if (validation.fails()) {
            res.status(400).json(validation.errors)
        } else if (validation.passes()) {
            let text = trimText(req.body.text)
            let phrase = new Phrase(text)
            try {
                phrase = await getDb().getRepository(Phrase).save(phrase)
                res.status(200).json(phrase)
            } catch (error) {
                if (error instanceof QueryFailedError) {
                    res.status(409).json()
                }
            }
        }
    })
    .put("/:phraseid", [authToken], async (req, res) => {

        let validation = new Validator(req.body, {
            text: ["required", "min:1", "max:100", "regex:/^[A-zäöåÄÖÅ0-9% &/-]+$/"],
        })

        if (validation.fails()) {
            res.status(400).json(validation.errors)
            return
        } else if (validation.passes()) {
            let phraseid = req.params.phraseid
            let text = trimText(req.body.text)

            await getDb()
                .createQueryBuilder()
                .update(Phrase)
                .set({ text: text })
                .where("id = :id", { id: phraseid })
                .execute()
            res.status(200).json()
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
            let phrases =await Phrases.getByIds(req.body.ids)
            try {
                let deletedIds=[]
                for (const phrase of phrases) {
                    deletedIds.push(phrase.id)  
                }
                await getDb().manager.delete(Phrase, req.body.ids)
                res.status(200).json({deleted:deletedIds})
            } catch (error) {
                res.status(500).json()
            }
        }
    })
