import { getDb } from "../database"
import { Synonym, Synonyms } from "../entities/Synonym"
import { authToken } from "../middlewares/auth"
import Validator from "validatorjs"
import { Routes } from "./Routes"

export default new Routes("/synonyms")
    .post("/", [authToken], async (req, res) => {

        let validation = new Validator(req.body, {
            phrase: ["required", "integer"], // phrase id
            meaning: ["required", "integer"], // meaning id
            group: ["integer"], // group id
        })

        if (validation.fails())
            return res.status(400).json(validation.errors)

        let synonym = new Synonym({
            phrase: req.body.phrase,
            meaning: req.body.meaning,
            group: req.body.group,
        })
        if(synonym.group == undefined){
            synonym.group = null;
        }
        
        let errors = await synonym.errors()
        if (errors)
            return res.status(409).json(errors)

        synonym = await getDb().getRepository(Synonym).save(synonym);
        res.status(200).json(await Synonyms.get(synonym))
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

    .get("/:id", [], async (req, res) => {

        let id = parseInt(req.params["id"])
        if (isNaN(id))
            return res.sendStatus(400)

        let synonyms = await Synonyms.getByIds([id])
        if (synonyms.length == 0)
            return res.sendStatus(404)
        else
            res.status(200).json(synonyms[0])
    })

    .put("/:id", [authToken], async (req, res) => {
        let validation = new Validator(req.body, {
            phrase: ["required", "integer"], // phrase id
            meaning: ["required", "integer"], // meaning id
            group: ["integer"], // group id
        })

        if (validation.fails())
            return res.status(400).json(validation.errors)

        let synonym = new Synonym({
            phrase: req.body.phrase,
            meaning: req.body.meaning,
            group: req.body.group,
            id: parseInt(req.params["id"]),
        })

        let errors = await synonym.errors()
        if (errors)
            return res.status(409).json(errors)

        synonym = await getDb().getRepository(Synonym).save(synonym);
        res.status(200).json(synonym)
    })

    .delete("/", [authToken], async (req, res) => {

        let validation = new Validator(req.body, {
            ids: "array|required",
            "ids.*": "integer",
        })

        if (validation.fails())
            return res.status(400).json(validation.errors)

        let synonyms = await Synonyms.getByIds(req.body.ids)
        let deletedIds = []
        for (const synonym of synonyms) {
            deletedIds.push(synonym.id)
        }

        await getDb().manager.delete(Synonym, req.body.ids)
        res.status(200).json({ deleted: deletedIds })
    })
