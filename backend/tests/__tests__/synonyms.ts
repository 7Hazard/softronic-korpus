import { addWord, api } from "../helpers";

let hello = await addWord("hello")
let hi = await addWord("hi")

test("add synonym", async () => {
  await api.post("/synonyms").authenticate()
    .send({
      phrase: hello, // the id of the phrase to equalize
      meaning: hi // the id to the equivalent phrase
    })
    .expect(200)
    .expect({
      id: 1, // id of the equivalance
      phrase: hello, // the phrase to equalize
      meaning: hi // the id to the equivalent phrase
    })

    await api.post("/synonyms").authenticate()
    .send({
      phrase: 45,
      meaning: 123
    }).expect(500)
    .expect({ error: "One of the IDs do not exist" })

    await api.post("/synonyms").authenticate()
    .send({
      phrase: 2,
      meaning: 1
    }).expect(400)
    .expect('No circular or transitive dependencies allowed')

  // TODO test circular synonyms
  // TODO invalid input tests
})

test("get all synonyms", async () => {
  await api.get("/synonyms").authenticate()
    .expect(200, [
      {
        id: 1, // id of the equivalance
        phrase: {text: 'hello', id: 1,synonyms: [Array]}, // the phrase to equalize
        meaning:{text: 'hi', id: 2, synonyms: []}, // the id to the equivalent phrase
      }
    ])
});

test("get specific synonym", async () => {
  // TODO invalid input tests

  // search by phrase
  await api.get(`/synonyms/${hello.id}`).authenticate()
    .expect(200, [{ id: 1, phrase: {hello, synonyms: [Array]}, meaning: {hi, synonyms: []} }])

  // search by meaning
  await api.get(`/synonyms/${hi.id}`).authenticate()
    .expect(200, [{ id: 1, phrase: hello, meaning: hi }])
});
