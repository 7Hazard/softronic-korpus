import Validator from "validatorjs"
import { Phrase, Phrases } from "../entities/Phrase"
import { Synonym, Synonyms } from "../entities/Synonym"
import { Routes } from "./Routes"

export default new Routes("/translations").post("/", [], async (req, res) => {
    let validation = new Validator(req.body, {
        text: ["required", "max: 10000"],
    })

    if (validation.fails()) {
        res.status(400).send(validation.errors)
        return
    }

    // build phrase-meaning map
    let phrases = await Phrases.getAllWithRelations(["synonym", "synonym.meaning"])
    let phraseMeaningMap = new Map<string, string>()
    for (const phrase of phrases) {
        let synonym = phrase.synonym as Synonym
        if(!synonym) continue
        let meaning = synonym.meaning as Phrase
        phraseMeaningMap.set(phrase.text, meaning.text)
    }

    let text = new Text(req.body.text)
    let result = text.translate()

    // send translation
    res.status(200).send({ translation: result })
})

class Text {
    tokens: string[]
    phraseCandidates: string[]

    constructor(text: string) {
        // Split text into tokens
        this.tokens = text.split(" ")

        let start = 0;
        let end = 0;
        // let lastTokenIndex = this.tokens.length-1;
        let tokensCount = this.tokens.length
        while(start != tokensCount && end != tokensCount)
        {
            let tokenCandidates = []
            while(end != tokensCount)
            {
                tokenCandidates.push(this.tokens[end])
                end++
            }
            start++
            end = start
            let phraseCandidate = tokenCandidates.join(" ")
            if(!this.phraseCandidates.includes(phraseCandidate))
            {
                this.phraseCandidates.push(phraseCandidate)
            }
        }
    }

    translate() {
        return this.tokens.join(" ")
    }
}
