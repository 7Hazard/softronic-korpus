
import * as korpusapi from "../src/server";
import supertest, { Test } from "supertest";
import { Users } from "../src/entities/User" // second
import { Phrase } from "../src/entities/Phrase";
import { Synonym } from "../src/entities/Synonym";
import { Group } from "../src/entities/Group";

let stuff = await korpusapi.start({ dbpath: ":memory:", port: null, logging: false });

export const db = stuff.db
export const server = stuff.server
export const app = stuff.app
export const api = supertest(app)

afterAll(async () => {
  await korpusapi.stop()
})


declare module "supertest" {
  class Test {
    authenticate(token?: string): this;
  }
}

Test.prototype.authenticate = function (token = authToken) {
  var self = this as Test;
  self.set("Authorization", `Bearer ${token}`)
  return this;
}

const name = "testUser"
const password = "test123"
let user = await Users.create(name, password)
const authToken = await signin(name, password)

export async function signin(username: string, password: string) {
  let resp = await api.post("/signin").send({
    username,
    password
  }).expect(200)
  let token = resp.body.token as string
  if (!token) throw Error("Could not sign in and get token")
  return token
}

type Method = "post" | "get" | "put" | "delete"
function testByMethod(method: Method, path: string) {
  switch (method) {
    case "delete": return api.delete(path)
    case "get": return api.get(path)
    case "post": return api.post(path)
    case "put": return api.put(path)
  }
}

/**
 * The function is designed to produce two successful API requests
 * @param options 
 */
export async function testAuth(options: {
  method: Method,
  path: string,
  data?: object
  secondData?: object,
  secondExpectedCode?: number
}) {
  if (options.secondData == undefined) options.secondData = options.data
  if (options.secondExpectedCode == undefined) options.secondExpectedCode = 200

  // test directly
  let r1 = await testByMethod(options.method, options.path).send(options.data).expect(401)

  function retry(token, data, expectedCode) {
    return testByMethod(options.method, options.path)
      .send(data)
      .authenticate(token)
      .expect(expectedCode)
  }
  // test with bad token
  let r2 = await retry("b4d t0ken", options.data, 401)

  // add user
  let name = `${options.method}${options.path.replace(/\//g, "")}AuthTest`
  let password = "p4ssw0rd"
  await Users.create(name, password)

  // sign in
  let firstToken = await signin(name, password)

  // test with valid token
  let r3 = await retry(firstToken, options.data, 200)

  // replace token by signing in again
  let secondToken = await signin(name, password)

  // test with first old token
  let r4 = await retry(firstToken, options.secondData, 401)

  // test with second token
  let r5 = await retry(secondToken, options.secondData, options.secondExpectedCode)
}

/**
 * @param text 
 * @returns Phrase object
 */
export async function addPhrase(text: string) {
  let response = await api.post("/phrases").authenticate().send({ text: text })
  return response.body as Phrase
}

export async function addSynonym(phrase: number, meaning: number, group?: number) {
  let response = await api.post("/synonyms").authenticate().send({
    phrase, meaning, group
  })
  return response.body as Synonym
}

export async function addGroup(name: string) {
  let response = await api.post("/groups").authenticate().send({ name })
  return response.body as Group
}

export async function expectErrors(request: supertest.Test, code: number) {
  let resp = await request.expect(code)
  expect(resp.body).toHaveProperty("errors")
  return resp
}
