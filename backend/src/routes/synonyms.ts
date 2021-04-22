import { Router } from "express";
import { Words } from "../entities/Word";
import { authenticateToken } from "../middlewares/auth";

export default Router()
    .use(authenticateToken)
    .get("/synonyms", async (req, res) => {
        let getAllSynonyms = await Words.getSynonyms();
        res.status(200).json(getAllSynonyms);
    })
    .get("/synonyms/:wordid", async (req, res) => {
        let getSpecificSynonym = await Words.getSynonyms(parseInt(req.params.wordid));
        res.status(200).json(getSpecificSynonym);
    })
    