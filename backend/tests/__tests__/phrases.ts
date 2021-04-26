import { addWord, expectErrors, testAuth } from "../helpers";
import { api } from "../helpers";

test("auth", async () => {
  await testAuth({
    method: "post",
    path: "/phrases",
    data: { text: "hi" },
    secondExpectedCode: 409
  })
  await testAuth({ method: "get", path: "/phrases" })
  await testAuth({ method: "get", path: "/phrases/1" })
  await testAuth({ method: "put", path: "/phrases/1", data: { text: "bye bye" } })
  await testAuth({ method: "delete", path: "/phrases", data: { ids: [1] } })
})

test("add", async () => {
  // add phrase 1
  await api.post("/phrases").authenticate()
    .send({ text: "hello" })
    .expect(200)
    .expect({
      text: "hello",
      id: 2
    })

  // add phrase 2
  await api.post("/phrases").authenticate()
    .send({ text: "hell o" })
    .expect(200)
    .expect({
      text: "hell o",
      id: 3
    })
});

test("get", async () => {
  let resp = await api.get("/phrases").authenticate()
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
  let resp = await api.get("/phrases/2").authenticate()
    .expect(200)
    .expect({
      text: "hello",
      id: 2
    })
});

test("add duplicate", async () => {
  let resp = await api.post("/phrases").authenticate()
    .send({ text: "hello" })
    .expect(409)
});

test("add bad phrases", async () => {
  await api.post("/phrases").authenticate().send({ text: "@£$!?=)(/&[]{}%" }).expect(400)
  await api.post("/phrases").authenticate().send({ text: "longtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtext" }).expect(400)
  await api.post("/phrases").authenticate().send({ text: "" }).expect(400)
});

test("update", async () => {
  await api.put("/phrases/1").authenticate().send({ text: "bye" }).expect(200)
})

test("delete one existing", async () => {
  await api.delete("/phrases").authenticate().send({ ids: [1] }).expect(200)//.expect({deletedCount: 1})
});

test("delete multiple", async () => {
  // add three phrases
  let phrase1 = await addWord("hello")
  let phrase2 = await addWord("bye")
  let phrase3 = await addWord("goodbye")

  // delete all
  await api.delete("/phrases").authenticate()
    .send({ ids: [phrase1.id, phrase2.id, phrase3.id] })
    .expect(200)
  //.expect({ deletedCount: 3 })
})

test("delete none existing", async () => {
  await api.delete("/phrases").authenticate()
    .send({ ids: [1] })
    .expect(200)
  //.expect({ deletedCount: 0 })
});

test("delete with bad input", async () => {
  await expectErrors(api.delete("/phrases").authenticate().send({ ids: "" }), 400)
  await expectErrors(api.delete("/phrases").authenticate().send({ ids: {} }), 400)
});