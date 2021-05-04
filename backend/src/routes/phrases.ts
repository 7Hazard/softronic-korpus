import { QueryFailedError } from "typeorm"
import { Phrase, Words } from "../entities/Phrase"
import Validator from "validatorjs"
import { getDb } from "../database"
import { Router } from "express"
import { authToken } from "../middlewares/auth"
import { trimText } from "../util"
import { Word } from "../entities/Word"

export default Router()
    .use("/phrases", authToken)

    .get("/phrases", async (req, res) => {
        let getAll = await Words.get()
        res.status(200).json(getAll)
    })
    .get("/phrases/:phraseid", async (req, res) => {
        let phraseid = parseInt(req.params.phraseid)
        const phrasesById = await Words.get(phraseid)
        if (!phrasesById) {
            res.status(404).json({
                error: "Word not found",
            })
            return
        }
        res.status(200).json(phrasesById)
    })
    .post("/phrases", async (req, res) => {

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
    .put("/phrases/:phraseid", async (req, res) => {

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
                .set({ text: text })     // testade att trimma
                .where("id = :id", { id: phraseid })
                .execute()
            res.status(200).json()
        }
    })

    .delete("/phrases", async (req, res) => {
        let validation = new Validator(req.body, {
            //reqirement
            ids: "array|required",
            "ids.*": "integer",
        })

        if (validation.fails()) {
            res.status(400).json(validation.errors)
        } else if (validation.passes()) {
            let phrases =await Words.getByIds(req.body.ids)
            try {
                let deletedIds=[]
                for (const phrase of phrases) {
                    deletedIds.push(phrase.id)  
                }
                res.status(200).json({deleted:deletedIds})
                await getDb().manager.delete(Phrase, req.body.ids) // find by id
            } catch (error) {
                res.status(500).json()
            }
        }
    })
