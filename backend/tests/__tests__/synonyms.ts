import { addWord, api } from "../helpers";

let hello = await addWord("hello")
let hi = await addWord("hi")

test("add synonym", async () => {
  await api.post("/synonyms").authenticate()
    .send({
      phrase: hello.id, // the id of the phrase to equalize
      meaning: hi.id // the id to the equivalent phrase
    })
    .expect(200)
    .expect({
      phrase: hello.id, // the phrase to equalize
      meaning: hi.id // the id to the equivalent phrase
    })

    await api.post("/synonyms").authenticate()
    .send({
      phrase: 45,
      meaning: 123
    }).expect(500)
    .expect({ error: "One of the IDs do not exist" })

    await api.post("/synonyms").authenticate()
    .send({
      phrase: hi.id,
      meaning: hello.id
    }).expect(400)
    .expect('"No circular or transitive dependencies allowed"')

})

test("get all synonyms", async () => {
  await api.get("/synonyms").authenticate()
    .expect(200, [
      {
        phrase: {text: 'hello', id: 1}, // the phrase to equalize
        meaning:{text: 'hi', id: 2}, // the id to the equivalent phrase
      }
    ])
});

test("get specific synonym", async () => {
  // TODO invalid input tests

  // search by phrase
  await api.get(`/synonyms/${hello.id}`).authenticate()
    .expect(200, [{phrase: hello, meaning: hi }])

  // search by meaning
  await api.get(`/synonyms/${hi.id}`).authenticate()
    .expect(200, [{phrase: hello, meaning: hi }])
});
