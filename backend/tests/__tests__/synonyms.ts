import { send } from "node:process";
import { addWord, api } from "../helpers";

let hello = await addWord("hello")
let hi = await addWord("hi")
let hey = await addWord("hey")


test("add synonym", async () => {
  await api.post("/synonyms").authenticate()
    .send({
      phrase: hello.id, // the id of the phrase to equalize       //1 -> 2
      meaning: hi.id // the id to the equivalent phrase
    })
    .expect(200, {
      phrase: hello.id, // the phrase to equalize
      meaning: hi.id // the id to the equivalent phrase
    })

  await api.post("/synonyms").authenticate()
    .send({
      phrase: 45,
      meaning: 123
    })
    .expect(409, { error: "One of the IDs do not exist" })

  await api.post("/synonyms").authenticate()
    .send({
      phrase: hi.id,                              //2 -> 1
      meaning: hello.id
    })
    .expect(400, { error: "No circular or transitive dependencies allowed" })

  //transitiv test
  await api.post("/synonyms").authenticate()
    .send({
      phrase: hi.id,                            //2 -> 3
      meaning: hey.id
    })
    .expect(400, { error: "No circular or transitive dependencies allowed" })

})

test("get all synonyms", async () => {
  await api.get("/synonyms")
    .expect(200, [
      {
        phrase: { text: 'hello', id: 1 }, // the phrase to equalize
        meaning: { text: 'hi', id: 2 }, // the id to the equivalent phrase

      }
    ])
});

test("get specific synonym", async () => {
  // TODO invalid input tests

  // search by phrase
  await api.get(`/synonyms/${hello.id}`)
    .expect(200, [{ phrase: hello, meaning: hi }])

  // search by meaning
  await api.get(`/synonyms/${hi.id}`)
    .expect(200, [{ phrase: hello, meaning: hi }])
});
