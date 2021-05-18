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
        if (!synonym) continue
        let meaning = synonym.meaning as Phrase
        phraseMeaningMap.set(phrase.text, meaning.text)
    }

    let text = new Text(req.body.text)
    let result = text.translate(phraseMeaningMap)

    // send translation
    res.status(200).send({ translation: result })
})

class Text {
    tokens: string[]
    phraseCandidates = new PhraseCandidateSet()

    constructor(text: string) {
        // Split text into tokens
        this.tokens = text.split(" ")

        let start = 0;
        let end = 0;
        // let lastTokenIndex = this.tokens.length-1;
        let tokensCount = this.tokens.length
        while (start != tokensCount && end != tokensCount) {
            let tokenCandidates: string[] = []
            while (end != tokensCount) {
                tokenCandidates.push(this.tokens[end])

                // make phrase candidate
                let phraseCandidate = new PhraseCandidate(tokenCandidates);
                // add to phrase candidates
                this.phraseCandidates.add(phraseCandidate)

                end++
            }
            start++
            end = start
        }

        // sort phrase candidates
        this.phraseCandidates.sort()
    }

    translate(translations: Map<string, string>) {
        return this.tokens.join(" ")
    }
}

class Token {
    content: string
    index: number
    translated = false
}

class PhraseCandidate {
    tokens: string[]

    constructor(tokens: string[]) {
        this.tokens = [...tokens]
    }

    equals(other: PhraseCandidate) {
        if(this.tokens.length != other.tokens.length)
            return false;

        for(let i = 0; i < this.tokens.length; i++)
        {
            if(this.tokens[i] != other.tokens[i])
                return false;
        }

        return true;
    }
}

class PhraseCandidateSet {
    candidates: PhraseCandidate[] = []
    constructor() {

    }

    add(candidate: PhraseCandidate) {
        // check if candidate already exists
        for (const cand of this.candidates) {
            if(cand.equals(candidate)) return
        }

        this.candidates.push(candidate)
    }

    sort() {
        // sort by most tokens (and characters)
    }
}
