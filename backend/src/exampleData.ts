import { Group, Groups } from "./entities/Group"
import { Phrase, Phrases } from "./entities/Phrase"
import { Synonym, Synonyms } from "./entities/Synonym"

export async function insertExampleData() {
    // let hello = await Phrases.add(new Phrase("hello"))
    // let hi = await Phrases.add(new Phrase("hi"))
    // await Synonyms.add(new Synonym({ phrase: hi.id, meaning: hello.id }))
    // let good_day = await Phrases.add(new Phrase("good day"))
    // await Synonyms.add(new Synonym({ phrase: good_day.id, meaning: hello.id }))

    // let bye = await Phrases.add(new Phrase("bye"))
    // let cya = await Phrases.add(new Phrase("cya"))
    // await Synonyms.add(new Synonym({ phrase: cya.id, meaning: bye.id }))
    // let good_bye = await Phrases.add(new Phrase("good bye"))
    // await Synonyms.add(new Synonym({ phrase: good_bye.id, meaning: bye.id }))

    // let logistics = await Groups.add(new Group("logistics"))
    // let marine = await Groups.add(new Group("marine"))
    // let ship = await Phrases.add(new Phrase("ship"))
    // let send = await Phrases.add(new Phrase("send"))
    // await Synonyms.add(new Synonym({ phrase: ship.id, meaning: send.id, group: logistics.id }))
    // let boat = await Phrases.add(new Phrase("boat"))
    // await Synonyms.add(new Synonym({ phrase: ship.id, meaning: boat.id, group: marine.id }))

    // Dryck
    let dryck = await makePhrase("dryck")
    let kaffe = await makePhrase("kaffe")
    makeSynonym(kaffe, dryck)
    let saft = await makePhrase("saft")
    makeSynonym(saft, dryck)

    let noccoab = await makeGroup("Nocco AB")
    let koffeindryck = await makePhrase("koffeindryck")
    makeSynonym(kaffe, koffeindryck, noccoab)
    // let energidryck = await makePhrase("energidryck")
    // makeSynonym(energidryck, koffeindryck, noccoab)
    let monster_energy_drink = await makePhrase("monster energy drink")
    makeSynonym(monster_energy_drink, koffeindryck, noccoab)

    // Djur
    let djur = await makePhrase("djur")

    let kolmården = await makeGroup("Kolmården")
    let vilda_djur = await makePhrase("vilda djur")
    makeSynonym(djur, vilda_djur, kolmården)

    let veterinär = await makeGroup("Veterinär")
    let husdjur = await makePhrase("husdjur")
    makeSynonym(djur, husdjur, veterinär)

    let arv = await makePhrase("arv")
    let kvarlåtenskap = await makePhrase("kvarlåtenskap")
    let överföring = await makePhrase("överföring av egenskaper")
    let IT = await makeGroup("IT")
    makeSynonym(arv,kvarlåtenskap)
    makeSynonym(arv,överföring,IT)

    let relation = await makePhrase("relation")
    let samband = await makePhrase("samband")
    let tabell = await makePhrase("tabell")
    makeSynonym(relation, samband)
    makeSynonym(relation, tabell, IT)
    
    let tupel = await makePhrase("tupel")
    let ordnadMängd = await makePhrase("ordnad mängd")
    let matematik = await makeGroup("matematik")
    let rad = await makePhrase("rad i tabell")
    makeSynonym(tupel, ordnadMängd,matematik)
    makeSynonym(tupel, rad,IT)

    let match = await makePhrase("match")
    let tävlingsomgång = await makePhrase("tävlingsomgång")
    let paraIhop = await makePhrase("para ihop")
    let dejting = await makeGroup("dejting")
    makeSynonym(match, tävlingsomgång)
    makeSynonym(match, paraIhop,dejting)
}

async function makePhrase(text) {
    return await Phrases.add(new Phrase(text))
}

async function makeSynonym(phrase: Phrase, meaning: Phrase, group?: Group) {
    return await Synonyms.add(new Synonym({ phrase: phrase.id, meaning: meaning.id, group: group ? group.id : null }))
}

async function makeGroup(name: string) {
    return await Groups.add(new Group(name))
}
