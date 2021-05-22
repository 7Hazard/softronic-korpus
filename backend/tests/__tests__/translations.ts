import { addGroup, addPhrase, addSynonym, api } from "../helpers"

let hello = await addPhrase("hello")
let good_day = await addPhrase("good day")
await addSynonym(good_day.id, hello.id)
let hi = await addPhrase("hi")
await addSynonym(hi.id, hello.id)

let friends = await addPhrase("friends")
let mates = await addPhrase("mates")
await addSynonym(mates.id, friends.id)
let lads = await addPhrase("lads")
await addSynonym(lads.id, friends.id)

test("translate piece of text", async () => {
    await testTranslate("good day lads my mates", "hello friends my friends")
})

test("translate by group", async () => {

    // in work context, mates means collegues
    let work = await addGroup("work")
    let collegues = await addPhrase("collegues")
    await addSynonym(mates.id, collegues.id, work.id)

    // translate by group
    await testTranslate("good day good day and hi my mates", "hello hello and hello my collegues", [work.id])
})

// test("translate by multiple groups", async () => {
//     let text = "we are going to ship it"

//     let ship = await addPhrase("ship")

//     // marine
//     let marine = await addGroup("marine")
//     let large_boat = await addPhrase("large boat")
//     await addSynonym(ship.id, large_boat.id, marine.id)

//     // logistics
//     let logistics = await addGroup("logistics")
//     let send = await addPhrase("send")
//     await addSynonym(ship.id, send.id, logistics.id)

//     // translate prio logistics
//     await testTranslate(text, "we are going to send it", [logistics.id, marine.id])

//     // translate prio marine
//     await testTranslate(text, "we are going to large boat it", [marine.id, logistics.id])
// })


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