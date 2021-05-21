import { Group, Groups } from "./entities/Group"
import { Phrase, Phrases } from "./entities/Phrase"
import { Synonym, Synonyms } from "./entities/Synonym"

export async function insertExampleData() {
    let hello = await Phrases.add(new Phrase("hello"))
    let hi = await Phrases.add(new Phrase("hi"))
    await Synonyms.add(new Synonym({ phrase: hi.id, meaning: hello.id }))
    let good_day = await Phrases.add(new Phrase("good day"))
    await Synonyms.add(new Synonym({ phrase: good_day.id, meaning: hello.id }))

    let bye = await Phrases.add(new Phrase("bye"))
    let cya = await Phrases.add(new Phrase("cya"))
    await Synonyms.add(new Synonym({ phrase: cya.id, meaning: bye.id }))
    let good_bye = await Phrases.add(new Phrase("good bye"))
    await Synonyms.add(new Synonym({ phrase: good_bye.id, meaning: bye.id }))

    let logistics = await Groups.add(new Group("logistics"))
    let marine = await Groups.add(new Group("marine"))
    let ship = await Phrases.add(new Phrase("ship"))
    let send = await Phrases.add(new Phrase("send"))
    await Synonyms.add(new Synonym({ phrase: send.id, meaning: ship.id, group: logistics.id }))
    let boat = await Phrases.add(new Phrase("boat"))
    await Synonyms.add(new Synonym({ phrase: boat.id, meaning: ship.id, group: marine.id }))
}
