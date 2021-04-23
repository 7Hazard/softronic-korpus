import { Router } from "express"
import { getDb } from "../database"
import { Synonym, Synonyms } from "../entities/Synonym"
import { Words } from "../entities/Word"
import { authToken } from "../middlewares/auth"

export default Router()
    .use("/synonyms", authToken)

    .post("/synonyms", async (req, res) => {
        let id1 = req.body.id1
        let id2 = req.body.id2

        if (await Synonyms.isValidInput(id1, id2)) {
            try {
                await getDb()
                    .createQueryBuilder()
                    .insert()
                    .into(Synonym)
                    .values([{ wordId_1: id1, wordId_2: id2 }])
                    .execute()

                res.status(200).json()
            } catch (error) {
                console.log(error)
                res.status(400).json()
            }
        } else
            res.status(400).json(
                "No circular or transitive dependencies allowed"
            )
    })
    .get("/synonyms", async (req, res) => {
        console.log("Trying to get synonyms")
        try {
            let getAllSynonyms = await Synonyms.getSynonyms()
            console.log(getAllSynonyms)
            res.status(200).json(getAllSynonyms)
        } catch (error) {
            console.log(error)
            res.status(400).json()
        }
    })
    .get("/synonyms/:wordid", async (req, res) => {
        try {
            let getSpecificSynonym = await Words.getSynonyms(
                parseInt(req.params.wordid)
            )
            res.status(200).json(getSpecificSynonym)
        } catch (error) {
            console.error(error)
            res.status(400).json()
        }
    })
    .put("/synonyms", async (req, res) => {
        let IdToChange = req.body.idToChange
        let oldId2 = req.body.oldId2
        let newId2 = req.body.newId2

        if (
            (await Words.get(IdToChange)) == undefined ||
            (await Words.get(oldId2)) == undefined ||
            (await Words.get(newId2)) == undefined
        ) {
            res.status(400).json("One of the IDs do not exist")
            return
        }

        try {
            if (await Synonyms.isValidInput(IdToChange, newId2, oldId2)) {
                await getDb()
                    .getRepository(Synonym)
                    .createQueryBuilder("synonym")
                    .update()
                    .set({ wordId_2: newId2 })
                    .where("wordId_1 = :wordId1", { wordId1: IdToChange })
                    .andWhere("wordId_2 = :wordId2", { wordId2: oldId2 })
                    .execute()

                res.status(200).json()
            } else res.status(400).json("ERROR")
        } catch (error) {
            console.log(error)
            res.status(400).json("Error")
            return
        }
    })
