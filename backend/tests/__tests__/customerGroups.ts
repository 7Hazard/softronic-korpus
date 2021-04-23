import { addGroup, api, expectErrors } from "../helpers";


test("add", async () => {
  let resp = await api.post("/customerGroup").authenticate()
    .send({ text: "hello" })
    .expect(200)
    .expect({
      text: "hello",
      id: 1
    })
  let resp2 = await api.post("/customerGroup").authenticate()
    .send({ text: "hel lo" })
    .expect(200)
    .expect({
      text: "hel lo",
      id: 2
    })
})

test("get specific", async () => {
  let resp = await api.get("/customerGroup/1").authenticate()
    .expect(200)
    .expect({
      text: "hello",
      id: 1
    })
});

test("add duplicate", async () => {
  let resp = await api.post("/customerGroup").authenticate()
    .send({ text: "hello" })
    .expect(409)
});

test("add bad group", async () => {
  await api.post("/customerGroup").authenticate().send({ text: "@£$!?=)(/&[]{}%" }).expect(400)
  await api.post("/customerGroup").authenticate().send({ text: "longtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtext" }).expect(400)
  await api.post("/customerGroup").authenticate().send({ text: "" }).expect(400)
});

test("update group", async () => {
  await api.put("/customerGroup/1").authenticate()
    .send({ text: "bye" })
    .expect(200)
})

test("update non-existing", async () => {
  await api.put("/customerGroup/5").authenticate()
    .expect(404)
    .expect({
      error: "invalid id"
    })
})

test("bad update", async () => {
  await api.put("/customerGroup/1").authenticate().send({ text: "" }).expect(400)
  await api.put("/customerGroup/1").authenticate().send({ text: "@£$!?=)(/&[]{}%" }).expect(400)
  await api.put("/customerGroup/1").authenticate().send({ text: "longtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtext" }).expect(400)
})

test("delete one existing", async () => {
  await api.delete("/customerGroup").authenticate().send({ ids: [1] }).expect(200)//.expect({deletedCount: 1})
});

test("delete multiple", async () => {
  // add three words
  let group1 = await addGroup("hello")
  let group2 = await addGroup("bye")
  let group3 = await addGroup("goodbye")

  // delete all
  await api.delete("/customerGroup").authenticate()
    .send({ ids: [group1, group2, group3] })
    .expect(200)
  //.expect({ deletedCount: 3 })
})

test("delete non-existing", async () => {
  await api.delete("/customerGroup").authenticate()
    .send({ ids: [1] })
    .expect(200)
  //.expect({ deletedCount: 0 })
});

test("delete with bad input", async () => {
  await expectErrors(api.delete("/customerGroup").authenticate().send({ ids: "" }), 400)
  await expectErrors(api.delete("/customerGroup").authenticate().send({ ids: {} }), 400)
});
