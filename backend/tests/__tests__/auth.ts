import { api } from "../helpers"
import { Users } from "../../src/entities/User"

//gör funktion för tester

let user1 = await Users.create("username", "password")
let user2 = await Users.create("hello@world.com", "123456")
let user3 = await Users.create("nam3", "letmein@")

test("sign in", async () => {
    {
        let result = await api.post("/signin")
            .send({ name: "username", password: "password" })
            .expect(200)
        expect(result.body).toHaveProperty("token");
    }
    {
        let result = await api.post("/signin")
            .send({ name: "hello@world.com", password: "123456" })
            .expect(200)
        expect(result.body).toHaveProperty("token");
    } 
    {
        let result = await api.post("/signin")
            .send({ name: "nam3", password: "letmein@" })
            .expect(200)
        expect(result.body).toHaveProperty("token");
    }
})