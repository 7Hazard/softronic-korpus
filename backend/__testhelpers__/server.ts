
import * as korpusapi from "../src/server";
import * as http from 'http';
import request from "supertest";

export let db
export let server: http.Server
export let api: request.SuperTest<request.Test>;

beforeAll(async () => {
  let stuff = (await korpusapi.start({ dbpath: ":memory:", port: null, logging: false }));
  api = request(stuff.app);
  server = stuff.server
  db = stuff.db
});

afterAll(() => {
  korpusapi.stop()
})