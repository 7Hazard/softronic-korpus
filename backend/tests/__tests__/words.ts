import { addWord, expectErrors, testAuth } from "../helpers";
import { api } from "../helpers";

test("auth", async () => {
  await testAuth({
    method: "post",
    path: "/words",
    data: { text: "hi" },
    secondExpectedCode: 409
  })
  await testAuth({ method: "get", path: "/words" })
  await testAuth({ method: "get", path: "/words/1" })
  await testAuth({ method: "put", path: "/words/1", data: { text: "bye bye" } })
  await testAuth({ method: "delete", path: "/words", data: { ids: [1] } })
})

test("add", async () => {
  // add word 1
  await api.post("/words").authenticate()
    .send({ text: "hello" })
    .expect(200)
    .expect({
      text: "hello",
      id: 2
    })

  // add word 2
  await api.post("/words").authenticate()
    .send({ text: "hell o" })
    .expect(200)
    .expect({
      text: "hell o",
      id: 3
    })
});

test("get", async () => {
  let resp = await api.get("/words").authenticate()
    .expect(200)
    .expect([
      {
        text: "hello",
        id: 2
      },
      {
        text: "hell o",
        id: 3
      }
    ])
});

test("get specific", async () => {
  let resp = await api.get("/words/2").authenticate()
    .expect(200)
    .expect({
      text: "hello",
      id: 2
    })
});

test("add duplicate", async () => {
  let resp = await api.post("/words").authenticate()
    .send({ text: "hello" })
    .expect(409)
});

test("add bad words", async () => {
  await api.post("/words").authenticate().send({ text: "@£$!?=)(/&[]{}%" }).expect(400)
  await api.post("/words").authenticate().send({ text: "longtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtext" }).expect(400)
  await api.post("/words").authenticate().send({ text: "" }).expect(400)
});

test("update", async () => {
  await api.put("/words/1").authenticate().send({ text: "bye" }).expect(200)
})

test("delete one existing", async () => {
  await api.delete("/words").authenticate().send({ ids: [1] }).expect(200)//.expect({deletedCount: 1})
});

test("delete multiple", async () => {
  // add three words
  let word1 = await addWord("hello")
  let word2 = await addWord("bye")
  let word3 = await addWord("goodbye")

  // delete all
  await api.delete("/words").authenticate()
    .send({ ids: [word1.id, word2.id, word3.id] })
    .expect(200)
  //.expect({ deletedCount: 3 })
})

test("delete none existing", async () => {
  await api.delete("/words").authenticate()
    .send({ ids: [1] })
    .expect(200)
  //.expect({ deletedCount: 0 })
});

test("delete with bad input", async () => {
  await expectErrors(api.delete("/words").authenticate().send({ ids: "" }), 400)
  await expectErrors(api.delete("/words").authenticate().send({ ids: {} }), 400)
});
