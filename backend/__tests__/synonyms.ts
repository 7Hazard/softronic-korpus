import { api } from "../__testhelpers__/server"
import { addWord } from "../__testhelpers__/helpers";

test("getAllSynonyms", async() =>{
  await addWord("hello")

  let resp = await api.get("/synonyms")
    .expect(200)
    .expect([{
      text: "hello",
      id: 1,
      synonyms: []
    }])
});

test("getSpecificSynonym", async()=>{
    let resp = await api.get("/synonyms/1")
      .expect(200)
      .expect({
        text: "hello",
        id: 1,
        synonyms: []
      })
});