
import * as korpusapi from "../src/server";
import supertest, { Test } from "supertest";
import { Users } from "../src/entities/User" // second

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
await Users.create(name, password)
const authToken = await signin(name, password)

export async function signin(name: string, password: string) {
  let resp = await api.post("/signin").send({
    name,
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

  function retry(token, data) {
    return testByMethod(options.method, options.path)
      .send(data)
      .authenticate(token)
  }
  // test with bad token
  let r2 = await retry("b4d t0ken", options.data).expect(401)

  // add user
  let name = `${options.path}AuthTest`
  let password = "p4ssw0rd"
  await Users.create(name, password)

  // sign in
  let firstToken = await signin(name, password)

  // test with valid token
  let r3 = await retry(firstToken, options.data).expect(200)

  // replace token by signing in again
  let secondToken = await signin(name, password)

  // test with first old token
  let r4 = await retry(firstToken, options.secondData).expect(401)

  // test with second token
  let r5 = await retry(secondToken, options.secondData)
    .expect(options.secondExpectedCode)
}

/**
 * Returns ID
 * @param text 
 * @returns 
 */
export async function addWord(text: string): Promise<number> {
  let response = await api.post("/words").authenticate().send({ text: text })
  return response.body.id
}

export async function addGroup(text: string): Promise<number> {
  let response = await api.post("/customerGroup").authenticate().send({ text: text })
  return response.body.id
}

export async function expectErrors(request: supertest.Test, code: number) {
  let resp = await request.expect(code)
  expect(resp.body).toHaveProperty("errors")
  return resp
}
