import { send } from "node:process";
import { Synonym } from "../../src/entities/Synonym";
import { addGroup, addPhrase, addSynonym, api, expectErrors, testAuth } from "../helpers";

let hello = await addPhrase("hello")
let hi = await addPhrase("hi")
let hey = await addPhrase("hey")
let sup = await addPhrase("sup")
let yo = await addPhrase("yo")
let bye = await addPhrase("bye")
let goodbye = await addPhrase("goodbye")
let cya = await addPhrase("cya")
let adios = await addPhrase("adios")

// becomes sup_hello after update
let hi_hello: Synonym
let hey_hello: Synonym

// (bad) - ok
// (phrase as used meaning) - meaning as used phrase
let hello_hi_bad = {
  phrase: hello.id,
  meaning: hi.id
}

// (phrase as used meaning) - meaning as new
let hello_sup_bad = {
  phrase: hello.id,
  meaning: sup.id
}

// phrase as new - (meaning as used phrase)
let sup_hi_bad = {
  phrase: sup.id,
  meaning: hi.id
}

test("add synonym", async () => {
  let response = await api.post("/synonyms").authenticate()
    .send({
      phrase: hi.id, // the id of the phrase to equalize       //1 -> 2
      meaning: hello.id // the id to the equivalent phrase
    })
    .expect(200, {
      id: 1,
      phrase: hi.id, // the phrase to equalize
      meaning: hello.id // the id to the equivalent phrase
    })
  hi_hello = response.body

  response = await api.post("/synonyms").authenticate()
    .send({
      phrase: hey.id, // the id of the phrase to equalize       //1 -> 2
      meaning: hello.id // the id to the equivalent phrase
    })
    .expect(200, {
      id: 2,
      phrase: hey.id, // the phrase to equalize
      meaning: hello.id // the id to the equivalent phrase
    })
  hey_hello = response.body

  // non existing
  await api.post("/synonyms").authenticate()
    .send({ phrase: 99999, meaning: hi.id })
    .expect(409, { error: "phrase does not exist" })
  await api.post("/synonyms").authenticate()
    .send({ phrase: hi.id, meaning: 99999 })
    .expect(409, { error: "meaning does not exist" })

  // bad combos
  await api.post("/synonyms").authenticate()
    .send(hello_hi_bad)
    .expect(409, { error: "phrase is already used as a meaning" })
  await api.post("/synonyms").authenticate()
    .send(hello_sup_bad)
    .expect(409, { error: "phrase is already used as a meaning" })
  await api.post("/synonyms").authenticate()
    .send(sup_hi_bad)
    .expect(409, { error: "meaning is already used as a phrase" })
})

let sup_hello: Synonym
test("update synonym", async () => {
  await api.put(`/synonyms/${hi_hello.id}`).authenticate()
    .send({
      phrase: sup.id,
      meaning: hi.id
    })
    .expect(409, { error: "meaning is already used as a phrase" })

  let response = await api.put(`/synonyms/${hi_hello.id}`).authenticate()
    .send({
      phrase: sup.id,
      meaning: hello.id
    })
    .expect(200, {
      id: hi_hello.id,
      phrase: sup.id,
      meaning: hello.id
    })
  sup_hello = response.body
});

test("get all synonyms", async () => {
  // api will give us expanded .phrase and .meaning
  // so we put them in the recieved synonyms
  sup_hello.phrase = sup
  sup_hello.meaning = hello
  hey_hello.phrase = hey
  hey_hello.meaning = hello

  let response = await api.get("/synonyms")
    .expect(200, [sup_hello, hey_hello])
});

test("get specific synonym", async () => {
  // TODO invalid input tests

  // test updated id
  await api.get(`/synonyms/${hi_hello.id}`)
    .expect(200, sup_hello)

  await api.get(`/synonyms/${sup_hello.id}`)
    .expect(200, sup_hello)

  await api.get(`/synonyms/${hey_hello.id}`)
    .expect(200, hey_hello)
});

let slang = await addGroup("slang")
let street = await addGroup("street")
test("add synonyms with group", async () => {
  await api.post("/synonyms").authenticate()
    .send({
      phrase: sup.id,
      meaning: hello.id,
      group: slang.id,
    })
    .expect(409, { error: "global synonym already exists" })

  await api.post("/synonyms").authenticate()
    .send({
      phrase: yo.id,
      meaning: hello.id,
      group: street.id,
    })
    .expect(200, {
      id: 3,
      phrase: yo.id,
      meaning: hello.id,
      group: street.id,
    })

  await api.post("/synonyms").authenticate()
    .send({
      phrase: yo.id,
      meaning: hello.id,
      group: slang.id,
    })
    .expect(200, {
      id: 4,
      phrase: yo.id,
      meaning: hello.id,
      group: slang.id,
    })
})

test("delete multiple", async () => {
  await api.delete("/synonyms").authenticate()
    .send({ ids: [1, 2, 10000] })
    .expect(200, {
      deleted: [1, 2]
    })
});

test("delete none existing", async () => {
  await api.delete("/synonyms").authenticate()
    .send({ ids: [1] })
    .expect(200, {
      deleted: []
    })
});

test("delete with bad input", async () => {
  await expectErrors(api.delete("/phrases").authenticate().send({ ids: "" }), 400)
  await expectErrors(api.delete("/phrases").authenticate().send({ ids: {} }), 400)
  await expectErrors(api.delete("/phrases").authenticate().send({ ids: "abc" }), 400)
  await expectErrors(api.delete("/phrases").authenticate().send({ ids: 123 }), 400)
});