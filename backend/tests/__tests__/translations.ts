import { addGroup, addPhrase, addSynonym, api } from "../helpers"

let hello = await addPhrase("hello")
let good_day = await addPhrase("good day")
let friends = await addPhrase("friends")

await addSynonym(good_day.id, hello.id)

test("translate piece of text", async () => {
    await testTranslate("good day my mates", "hello my friends")
})

test("translate by group", async () => {

    let work = await addGroup("work")
    let collegues = await addPhrase("collegues")
    let mates = await addPhrase("mates")
    await addSynonym(collegues.id, friends.id, work.id)
    await addSynonym(mates.id, friends.id, work.id)

    // translate by group
    await testTranslate("good day my mates", "hello my collegues", [work.id])
})

test("translate by multiple groups", async () => {
    let text = "we are going to ship it"

    let ship = await addPhrase("ship")

    // marine
    let marine = await addGroup("marine")
    let large_boat = await addPhrase("large boat")
    await addSynonym(ship.id, large_boat.id, marine.id)

    // logistics
    let logistics = await addGroup("logistics")
    let send = await addPhrase("send")
    await addSynonym(ship.id, send.id, logistics.id)

    // translate prio logistics
    await testTranslate(text, "we are going to send it", [logistics.id, marine.id])

    // translate prio marine
    await testTranslate(text, "we are going to large boat it", [marine.id, logistics.id])
})


// helpers
async function testTranslate(text: string, expected: string, groups: number[] = [])
{
    await api.post("/translations").send({
        text,
        groups
    }).expect(200, {
        translation: expected
    })
}