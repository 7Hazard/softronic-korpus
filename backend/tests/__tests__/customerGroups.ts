import { addGroup, api, expectErrors } from "../helpers";

test("add", async () => {
  await api.post("/customerGroup").authenticate()
    .send({ text: "hello" })
    .expect(200)
    .expect({
      text: "hello",
      id: 1
    })

  await api.post("/customerGroup").authenticate()
    .send({ text: "hel lo" })
    .expect(200)
    .expect({
      text: "hel lo",
      id: 2
    })
    await api.post("/customerGroup").authenticate()
    .send({ text: "hallå" })
    .expect(200)
    .expect({
      text: "hallå",
      id: 3
    })

    await api.post("/customerGroup").authenticate()
    .send({ text: "            hej          då             " })
    .expect(200)
    .expect({
      text: "hej då",
      id: 4
    })

  // Bad input tests
  await api.post("/customerGroup").authenticate().send({ text: "@£$!?=)(/&[]{}%" }).expect(400)
  await api.post("/customerGroup").authenticate().send({ text: "longtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtext" }).expect(400)
  await api.post("/customerGroup").authenticate().send({ text: "" }).expect(400)
})

test("get specific", async () => {
  await api.get("/customerGroup/1").authenticate()
    .expect(200)
    .expect({
      text: "hello",
      id: 1
    })
});

test("add duplicate", async () => {
  await api.post("/customerGroup").authenticate()
    .send({ text: "hello" })
    .expect(409)
});

test("update group", async () => {
  await api.put("/customerGroup/1").authenticate()
    .send({ text: "bye" })
    .expect(200)

    

  // bad input tests
  await api.put("/customerGroup/1").authenticate().send({ text: "" }).expect(400)
  await api.put("/customerGroup/1").authenticate().send({ text: "@£$!?=)(/&[]{}%" }).expect(400)
  await api.put("/customerGroup/1").authenticate().send({ text: "longtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtext" }).expect(400)
})

test("update non-existing", async () => {
  await api.put("/customerGroup/5").authenticate()
    .send({ text: "bye" })
    .expect(404, {
      error: "invalid id"
    })
})

test("delete one existing", async () => {
  await api.delete("/customerGroup").authenticate().send({ ids: [1] }).expect(200)

  // bad input tests
  await expectErrors(api.delete("/customerGroup").authenticate().send({ ids: "" }), 400)
  await expectErrors(api.delete("/customerGroup").authenticate().send({ ids: {} }), 400)
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
})

test("delete non-existing", async () => {
  await api.delete("/customerGroup").authenticate()
    .send({ ids: [1] })
    .expect(200)
});
