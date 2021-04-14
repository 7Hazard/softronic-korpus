import { jest } from "@jest/globals";
import request from "supertest";
import * as korpusapi from "../src/server";
import * as http from 'http';

// jest.useFakeTimers();

let db, server: http.Server, api: request.SuperTest<request.Test>;
beforeAll(async () => {
  let stuff = (await korpusapi.start({ dbpath: ":memory:", port: 25257, logging: false }));
  api = request(stuff.app);
  server = stuff.server
  db = stuff.db
});

afterAll((done) => {
  server.close(() => {
    done()
  })
})


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
  await api.post("/words").send({ text: "with space" }).expect(400)
  await api.post("/words").send({ text: "345345" }).expect(400)
  await api.post("/words").send({ text: "@£$!?=)(/&[]{}%" }).expect(400)
  await api.post("/words").send({ text: "longtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtext" }).expect(400)
  await api.post("/words").send({ text: "" }).expect(400)
});

test("delete one existing", async () => {
  await api.delete("/words").send({ id: 1 }).expect(200).expect({deletedCount: 1})
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
    .expect({ deletedCount: 3 })
})

test("delete none existing", async () => {
  await api.delete("/words")
    .send({ id: 1 })
    .expect(200)
    .expect({ deletedCount: 0 })
});

test("delete with bad input", async () => {
  await expectErrors(api.delete("/words"), { id: {} }, 400)
  await expectErrors(api.delete("/words"), { id: [] }, 400)
  await expectErrors(api.delete("/words"), { id: "" }, 400)
  await expectErrors(api.delete("/words"), { ids: "" }, 400)
  await expectErrors(api.delete("/words"), { ids: {} }, 400)
});





/////
///// Helper functions
/////
async function expectErrors(method: request.Test, requestBody: Object, code: number) {
  let resp = await method.send(requestBody).expect(code)
  expect(resp.body).toHaveProperty("errors")
  return resp
}

// Returns id
async function addWord(text: string): Promise<number> {
  let response = await api.post("/words").send({ text: text })
  return response.body.id
}