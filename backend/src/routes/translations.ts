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
    let phrases = await Phrases.getAllWithRelations([
        "synonym",
        "synonym.meaning",
    ])
    let dictionary = new Dictionary()
    for (const phrase of phrases) {
        let synonym = phrase.synonym as Synonym
        if (!synonym) continue
        let meaning = synonym.meaning as Phrase
        dictionary.set(phrase.text, meaning.text)
    }

    let text = new Text(req.body.text, dictionary)
    let result = text.translation

    // send translation
    res.status(200).send({ translation: result })
})

class Dictionary extends Map<string, string> {}
class Text {
    tokens: Token[] = []
    phraseCandidates = new PhraseCandidateSet()

    constructor(text: string, dictionary: Dictionary) {
        // Split text into tokens
        let tmp = text.split(" ")
        tmp.forEach((element, i) => {
            this.tokens.push(new Token(element, i))
        });

        let start = 0
        let end = 0
        // let lastTokenIndex = this.tokens.length-1;
        let tokensCount = this.tokens.length
        while (start != tokensCount && end != tokensCount) {
            let tokenCandidates: Token[] = []
            while (end != tokensCount) {
                tokenCandidates.push(this.tokens[end])

                // make phrase candidate
                let phraseCandidate = new PhraseCandidate(tokenCandidates)
                // add to phrase candidates
                this.phraseCandidates.add(phraseCandidate)

                end++
            }
            start++
            end = start
        }

        // sort phrase candidates
        this.phraseCandidates.sort()
        
        for (const candidate of this.phraseCandidates) {
            let str = candidate.toString()
            let translation = dictionary.get(str)
            if(!translation) continue

            // position of token in tokens
            let candidatePosition = candidate.tokens[0].position

            // build tokens from translation
            let translatedSplit = translation.split(" ")
            let translatedTokens: Token[] = []
            for (let i = 0; i < translatedSplit.length; i++) {
                const element = translatedSplit[i];
                translatedTokens.push(new Token(element, i+candidatePosition))
            }

            // remove tokens from current and insert translated tokens
            this.tokens.splice(candidatePosition, candidate.tokens.length, ...translatedTokens)

            // update new positions after candidatePosition+candidate.tokens.length
            for (let i = candidatePosition+translatedTokens.length; i < this.tokens.length; i++) {
                const token = this.tokens[i]
                token.position -= translatedTokens.length
            }
        }
    }
    
    public get translation() {
        return this.tokens.join(" ")
    }
}

class Token {
    translated = false

    constructor(public content: string, public position: number)
    {

    }

    toString() {
        return this.content
    }
}

class PhraseCandidate {
    tokens: Token[]

    constructor(tokens: Token[]) {
        this.tokens = [...tokens]
    }

    equals(other: PhraseCandidate) {
        if (this.tokens.length != other.tokens.length) return false

        for (let i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i] != other.tokens[i]) return false
        }

        return true
    }

    toString() {
        return this.tokens.join(" ")
    }
}

class PhraseCandidateSet {
    candidates: PhraseCandidate[] = []
    constructor() {}

    add(candidate: PhraseCandidate) {
        // check if candidate already exists
        for (const cand of this.candidates) {
            if (cand.equals(candidate)) return
        }

        this.candidates.push(candidate)
    }

    sort() {
        // TODO more efficient sorting based on token count
        this.candidates.sort((a, b) => {
            if (a.tokens.length < b.tokens.length) return 1
            else if (a.tokens.length > b.tokens.length) return -1
            return 0
        })
    }

    [Symbol.iterator]() { return this.candidates.values() }
}
