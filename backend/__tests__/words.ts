import request from "supertest";
import { addWord } from "../__testhelpers__/helpers";
import { api } from "../__testhelpers__/server";

test("add", async () => {
  let resp = await api.post("/words")
    .send({ text: "hello" })
    .expect(200)
    .expect({
      text: "hello",
      id: 1
    })
});

test("get", async () => {
  let resp = await api.get("/words")
    .expect(200)
    .expect([{
      text: "hello",
      id: 1
    }])
});

test("get specific", async () => {
  let resp = await api.get("/words/1")
    .expect(200)
    .expect({
      text: "hello",
      id: 1
    })
});

test("add duplicate", async () => {
  let resp = await api.post("/words")
    .send({ text: "hello" })
    .expect(409)
});

test("add bad words", async () => {
  await api.post("/words").send({ text: "@£$!?=)(/&[]{}%" }).expect(400)
  await api.post("/words").send({ text: "longtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtext" }).expect(400)
  await api.post("/words").send({ text: "" }).expect(400)
});

test("update", async () => {
  await api.put("/words/1").send({text:"bye"}).expect(200)
})

test("delete one existing", async () => {
  await api.delete("/words").send({ ids: [1] }).expect(200)//.expect({deletedCount: 1})
});

test("delete multiple", async () => {
  // add three words
  let word1 = await addWord("hello")
  let word2 = await addWord("bye")
  let word3 = await addWord("goodbye")

  // delete all
  await api.delete("/words")
    .send({ ids: [word1, word2, word3] })
    .expect(200)
    //.expect({ deletedCount: 3 })
})

test("delete none existing", async () => {
  await api.delete("/words")
    .send({ ids: [1] })
    .expect(200)
    //.expect({ deletedCount: 0 })
});

test("delete with bad input", async () => {
  await expectErrors(api.delete("/words"), { ids: "" }, 400)
  await expectErrors(api.delete("/words"), { ids: {} }, 400)
});





/////
///// Helper functions
/////
export async function expectErrors(method: request.Test, requestBody: Object, code: number) {
  let resp = await method.send(requestBody).expect(code)
  expect(resp.body).toHaveProperty("errors")
  return resp
}
