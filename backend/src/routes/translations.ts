import Validator from "validatorjs";
import { Phrase, Phrases } from "../entities/Phrase";
import { Synonym, Synonyms } from "../entities/Synonym";
import { Routes } from "./Routes";

export default new Routes("/translations")
    .post("/", [], async (req, res) => {
        let validation = new Validator(req.body, {
            text: ["required", "max: 10000"]
        });

        if (validation.fails()) {
            res.status(400).send(validation.errors)
            return;
        }

        let phrases = await Phrases.getAllWithRelations(['synonym']);
        
        let words = (req.body.text as string).split(" ")
        let synonymsCache = new Map<Number, Synonym>()

        for (const [index, word] of words.entries()) {
            for (const phrase of phrases) {
                if (word == phrase.text && phrase.synonym)
                {
                    // get the synonym from the cache
                    let synonym = synonymsCache.get(phrase.synonym)
                    // if synonym not cached, fetch from db
                    if(!synonym) {
                        // fetch synonym
                        synonym = await Synonyms.getByPhraseIds(phrase.synonym.phrase)[0];
                        // cache the synonym
                        synonymsCache.set(phrase.synonym, synonym)
                    }
                    // replace word
                    words[index] = (synonym.meaning as Phrase).text
                    break;
                }
            }
        }

        // join replaced words together
        let result = words.join(" ")
        // send translation
        res.status(200).send({ translation: result });
    })
