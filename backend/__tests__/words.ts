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

it("add", async () => {
  let body = {
    text: "hello",
  };
  let resp = await api.post("/words")
    .send(body)
    .expect(200)
    .expect({
      text: body.text,
      id: 1
    })
    // .end();
});
