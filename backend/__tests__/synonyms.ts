import { api } from "../__testhelpers__/server"
import { addWord } from "../__testhelpers__/helpers";

let hello = await addWord("hello")
let hi = await addWord("hi")

test("add synonym", async () => {
  await api.post("/synonyms")
    .send({
      phrase: hello, // the id of the phrase to equalize
      equivalent: hi // the id to the equivalent phrase
    })
    .expect(200)
    .expect({
      id: 1, // id of the equivalance
      phrase: hello, // the phrase to equalize
      equivalent: hi // the id to the equivalent phrase
    })
})

test("get all synonyms", async () => {
  let resp = await api.get("/synonyms")
    .expect(200)
    .expect([
      {
        text: "hello",
        id: hello,
        synonyms: [
          {
            id: 1, // id of the equivalance
            phrase: hello, // the phrase to equalize
            equivalent: hi // the id to the equivalent phrase
          }
        ]
      },
      {
        text: "hi",
        id: hi,
        synonyms: []
      }
    ])
});

test("get specific synonym", async () => {
  let resp = await api.get(`/synonyms/${hi}`)
    .expect(200)
    .expect({
      text: "hi",
      id: hi,
      synonyms: []
    })
});

