import { QueryFailedError } from "typeorm"
import { Word, Words } from "../entities/Word"
import Validator from "validatorjs"
import { get as getDb } from "../database"
import { Router } from "express"

export default Router()
    .get("/words", async (req, res) => {
        let getAll = await Words.get()
        res.status(200).json(getAll)
    })
    .get("/words/:wordid", async (req, res) => {
        let wordid = parseInt(req.params.wordid)
        const wordsById = await Words.get(wordid)
        res.status(200).json(wordsById)
    })
    .post("/words", async (req, res) => {
        let text = req.body.text
        let word = new Word(text)

        let validation = new Validator(req.body, {
            text: ["required", "min:1", "max:100", "regex:/^[A-z0-9%&/-]+$/"],
        })

        if (validation.fails()) {
            res.status(400).json(validation.errors)
        } else if (validation.passes()) {
            try {
                word = await getDb().getRepository(Word).save(new Word(text))
                res.status(200).json(word)
            } catch (error) {
                if (error instanceof QueryFailedError) {
                    res.status(409).json()
                }
            }
        }
    })
    .put("/words/:wordid", async (req, res) => {
        let wordid = req.params.wordid
        let text = req.body.text

        await getDb()
            .createQueryBuilder()
            .update(Word)
            .set({ text: text })
            .where("id = :id", { id: wordid })
            .execute()
        res.status(200).json()
    })
    .delete("/words", async (req, res) => {
        let validation = new Validator(req.body, {
            //reqirement
            ids: "array|required",
            "ids.*": "integer",
        })

        if (validation.fails()) {
            res.status(400).json(validation.errors)
        } else if (validation.passes()) {
            try {
                await getDb().manager.delete(Word, req.body.ids) // find by id
                res.status(200).json()
            } catch (error) {
                res.status(500).json()
            }
        }
    })
