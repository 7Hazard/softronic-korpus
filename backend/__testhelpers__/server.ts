
import * as korpusapi from "../src/server";
import request from "supertest";

let stuff = await korpusapi.start({ dbpath: ":memory:", port: null, logging: false });

export const db = stuff.db
export const server = stuff.server
export const app = stuff.app
export const api = request(app)

afterAll(async () => {
  await korpusapi.stop()
})
