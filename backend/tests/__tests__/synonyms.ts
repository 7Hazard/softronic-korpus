import { send } from "node:process";
import { addWord, api, expectErrors, testAuth } from "../helpers";

let hello = await addWord("hello")
let hi = await addWord("hi")
let hey = await addWord("hey")
let sup = await addWord("sup")
let yo = await addWord("yo")
let bye = await addWord("bye")


test("add synonym", async () => {
  await api.post("/synonyms").authenticate()
    .send({
      phrase: hello.id, // the id of the phrase to equalize       //1 -> 2
      meaning: hi.id // the id to the equivalent phrase
    })
    .expect(200)
    .expect({
      phrase: hello.id, // the phrase to equalize
      meaning: hi.id // the id to the equivalent phrase
    })
  await api.post("/synonyms").authenticate()
    .send({
      phrase: sup.id, // the id of the phrase to equalize       //1 -> 2
      meaning: yo.id // the id to the equivalent phrase
    })
    .expect(200)
    .expect({
      phrase: sup.id, // the phrase to equalize
      meaning: yo.id // the id to the equivalent phrase
    })
  await api.post("/synonyms").authenticate()
    .send({
      phrase: 45,
      meaning: 123
    }).expect(409)
    .expect({ error: "One of the IDs do not exist" })

  await api.post("/synonyms").authenticate()
    .send({
      phrase: hi.id,                              //2 -> 1
      meaning: hello.id
    }).expect(400)
    .expect({ error: "No circular or transitive dependencies allowed" })

  //transitiv test
  await api.post("/synonyms").authenticate()
    .send({
      phrase: hi.id,                            //2 -> 3
      meaning: hey.id
    }).expect(400)
    .expect({ error: "No circular or transitive dependencies allowed" })

})

test("get all synonyms", async () => {
  await api.get("/synonyms").authenticate()
    .expect(200, [
      {
        phrase: {
          text: "hello",
          id: hello.id
        },
        meaning: {
          text: "hi",
          id: hi.id
        }
      },
      {
        phrase: {
          text: "sup",
          id: sup.id
        },
        meaning: {
          text: "yo",
          id: yo.id
        }
      }
    ])
});

test("get specific synonym", async () => {
  // TODO invalid input tests

  // search by phrase
  await api.get(`/synonyms/${hello.id}`).authenticate()
    .expect(200, [{ phrase: hello, meaning: hi }])

  // search by meaning
  await api.get(`/synonyms/${hi.id}`).authenticate()
    .expect(200, [{ phrase: hello, meaning: hi }])
});


test("delete existing", async () => {
  await testAuth({ method: "delete", path: "/synonyms", data: { ids: [3] } })
  await api.delete("/phrases").authenticate().send({ ids: [6] }).expect(200).expect({
    deleted: [
      bye.id
    ]
  })
});

test("delete multiple", async () => {
  // add three phrases

  // delete all
  await api.delete("/synonyms").authenticate()
    .send({ ids: [hello.id, sup.id] })
    .expect(200).expect({
      deleted: [
        hello.id,
        sup.id
      ]
    })
});

test("delete none existing", async () => {
  await api.delete("/synonyms").authenticate()
    .send({ ids: [1] })
    .expect(200)
  //.expect({ deletedCount: 0 })
});

test("delete with bad input", async () => {
  await expectErrors(api.delete("/phrases").authenticate().send({ ids: "" }), 400)
  await expectErrors(api.delete("/phrases").authenticate().send({ ids: {} }), 400)
  await expectErrors(api.delete("/phrases").authenticate().send({ ids: "abc" }), 400)
  await expectErrors(api.delete("/phrases").authenticate().send({ ids: 123 }), 400)
});
