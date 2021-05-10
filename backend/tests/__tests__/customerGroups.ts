import { addGroup, api, expectErrors } from "../helpers";

test("add", async () => {
  await api.post("/customerGroup").authenticate()
    .send({ name: "hello" })
    .expect(200, {
      name: "hello",
      id: 1
    })

  await api.post("/customerGroup").authenticate()
    .send({ name: "hel lo" })
    .expect(200, {
      name: "hel lo",
      id: 2
    })
  await api.post("/customerGroup").authenticate()
    .send({ name: "hallå" })
    .expect(200, {
      name: "hallå",
      id: 3
    })

  await api.post("/customerGroup").authenticate()
    .send({ name: "            hej          då             " })
    .expect(200, {
      name: "hej då",
      id: 4
    })

  // Bad input tests
  await api.post("/customerGroup").authenticate().send({ name: "@£$!?=)(/&[]{}%" }).expect(400)
  await api.post("/customerGroup").authenticate().send({ name: "longnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongname" }).expect(400)
  await api.post("/customerGroup").authenticate().send({ name: "" }).expect(400)
})

test("get specific", async () => {
  await api.get("/customerGroup/1")
    .expect(200, {
      name: "hello",
      id: 1
    })
});

test("add duplicate", async () => {
  await api.post("/customerGroup").authenticate()
    .send({ name: "hello" })
    .expect(409)
});

test("update group", async () => {
  await api.put("/customerGroup/1").authenticate()
    .send({ name: "bye" })
    .expect(200)

  // bad input tests
  await api.put("/customerGroup/1").authenticate().send({ name: "" }).expect(400)
  await api.put("/customerGroup/1").authenticate().send({ name: "@£$!?=)(/&[]{}%" }).expect(400)
  await api.put("/customerGroup/1").authenticate().send({ name: "longnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongnamelongname" }).expect(400)
})

test("update non-existing", async () => {
  await api.put("/customerGroup/5").authenticate()
    .send({ name: "bye" })
    .expect(404, {
      error: "invalid id"
    })
})

test("delete one existing", async () => {
  await api.delete("/customerGroup").authenticate().send({ ids: [1] }).expect(200)

  // bad input tests
  await expectErrors(api.delete("/customerGroup").authenticate().send({ ids: "" }), 400)
  await expectErrors(api.delete("/customerGroup").authenticate().send({ ids: {} }), 400)
  await expectErrors(api.delete("/customerGroup").authenticate().send({ ids: "abc" }), 400)
  await expectErrors(api.delete("/customerGroup").authenticate().send({ ids: 123 }), 400)
});

test("delete multiple", async () => {
  // add three words
  let group1 = await addGroup("hello")
  let group2 = await addGroup("bye")
  let group3 = await addGroup("goodbye")

  // delete all
  await api.delete("/customerGroup").authenticate()
    .send({ ids: [group1.id, group2.id, group3.id, 99999] })
    .expect(200, {
      deleted: [
        group1.id,
        group2.id,
        group3.id,
      ]
    })
})

test("delete non-existing", async () => {
  await api.delete("/customerGroup").authenticate()
    .send({ ids: [123] })
    .expect(200, { deleted: [] })
});
