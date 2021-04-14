import { jest } from "@jest/globals";
import request from "supertest";
import * as korpusapi from "../src/server";
import * as http from 'http';

// jest.useFakeTimers();

let db, server: http.Server, api: request.SuperTest<request.Test>;
beforeAll(async () => {
  let stuff = (await korpusapi.start({ dbpath: ":memory:", port: 2525, logging: false }));
  api = request(stuff.app);
  server = stuff.server
  db = stuff.db
});

afterAll((done)=>{
  server.close(()=>{
    done()
  })
})

let hellobody = {
  text: "hello",
};

it("add", async () => {
  
  let resp = await api.post("/words")
    .send(hellobody)
    .expect(200)
    .expect({
      text: hellobody.text,
      id: 1
    })
});

it("get", async () => {
  let resp = await api.get("/words")
    .expect(200)
    .expect([{
      text: "hello",
      id: 1
    }])
});

it("get specific", async () => {
  let resp = await api.get("/words/1")
    .expect(200)
    .expect({
      text: "hello",
      id: 1
    })
});

it("add duplicate", async () => {
  let resp = await api.post("/words")
    .send(hellobody)
    .expect(401)
});

it("add bad words", async () => {
  await api.post("/words").send({text:"with space"}).expect(400)
  await api.post("/words").send({text:"345345"}).expect(400)
  await api.post("/words").send({text:"@£$!?=)(/&[]{}%"}).expect(400)
  await api.post("/words").send({text:"longtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtextlongtext"})
    .expect(400)
});
