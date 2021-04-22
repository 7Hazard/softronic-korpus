import { jest } from "@jest/globals";
import request from "supertest";
import { addGroup } from "../__testhelpers__/helpers";
import { api } from "../__testhelpers__/server";

test("add", async () => {
  let resp = await api.post("/customerGroup")
    .send({ text: "hello" })
    .expect(200)
    .expect({
      text: "hello",
      id: 1
    })
  let resp2 = await api.post("/customerGroup")
    .send({ text: "hel lo" })
    .expect(200)
    .expect({
      text: "hel lo",
      id: 2
    })
})

test("get specific", async () => {
  let resp = await api.get("/customerGroup/1")
    .expect(200)
    .expect({
      text: "hello",
      id: 1
    })
});

test("add duplicate", async () => {
  let resp = await api.post("/customerGroup")
    .send({ text: "hello" })
    .expect(409)
});

test("add bad group", async () => {
  await api.post("/customerGroup").send({ text: "@£$!?=)(/&[]{}%" }).expect(400)
  await api.post("/customerGroup").send({ text: "longtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtext" }).expect(400)
  await api.post("/customerGroup").send({ text: "" }).expect(400)
});

test("update group", async () => {
  await api.put("/customerGroup/1")
    .send({ text: "bye" })
    .expect(200)
})

test("update non-existing", async () => {
  await api.put("/customerGroup/5")
    .expect(404)
    .expect({
      error: "invalid id"
    })
})

test("bad update", async () => {
  await api.put("/customerGroup/1").send({ text: "" }).expect(400)
  await api.put("/customerGroup/1").send({ text: "@£$!?=)(/&[]{}%" }).expect(400)
  await api.put("/customerGroup/1").send({ text: "longtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtext" }).expect(400)
})

test("delete one existing", async () => {
  await api.delete("/customerGroup").send({ ids: [1] }).expect(200)//.expect({deletedCount: 1})
});

test("delete multiple", async () => {
  // add three words
  let group1 = await addGroup("hello")
  let group2 = await addGroup("bye")
  let group3 = await addGroup("goodbye")

  // delete all
  await api.delete("/customerGroup")
    .send({ ids: [group1, group2, group3] })
    .expect(200)
  //.expect({ deletedCount: 3 })
})

test("delete non-existing", async () => {
  await api.delete("/customerGroup")
    .send({ ids: [1] })
    .expect(200)
  //.expect({ deletedCount: 0 })
});

test("delete with bad input", async () => {
  await expectErrors(api.delete("/customerGroup"), { ids: "" }, 400)
  await expectErrors(api.delete("/customerGroup"), { ids: {} }, 400)
});

export async function expectErrors(method: request.Test, requestBody: Object, code: number) {
  let resp = await method.send(requestBody).expect(code)
  expect(resp.body).toHaveProperty("errors")
  return resp
}

