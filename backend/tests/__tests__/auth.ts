import { api } from "../helpers"
import { Users } from "../../src/entities/User"

//gör funktion för tester
let signups = [];

test("sign up", async () => {
    {
        signups.push(api.post("/signup")
            .send({ username: "username", password: "password" })
            .expect(200)
        )
    }
    {
        signups.push(api.post("/signup")
            .send({ username: "[username]", password: "password" })
            .expect(400)
        )
    }
    {
        signups.push(api.post("/signup")
            .send({ username: "^^", password: "password" })
            .expect(400)
        )
    }
    {
        signups.push(api.post("/signup")
            .send({ username: "¤¤", password: "password" })
            .expect(400)
        )
    }
    {
        signups.push(api.post("/signup")
            .send({ username: "hello@world.com", password: "123456" })
            .expect(200)
        )
    }
    {
        signups.push(api.post("/signup")
            .send({ username: "hallå", password: "password" })
            .expect(200)
        )
    }
    {
        signups.push(api.post("/signup")
            .send({ username: "random", password: "lösenord" })
            .expect(200)
        )
    }
    {
        signups.push(api.post("/signup")
            .send({ username: "randåm", password: "losenord" })
            .expect(200)
        )
    }
    {
        signups.push(api.post("/signup")
            .send({ username: "blablå", password: "lösenord" })
            .expect(200)
        )
    }
    {
        signups.push(api.post("/signup")
            .send({ username: "åäöÅÄÖ", password: "åäöÅÄÖ" })
            .expect(200)
        )
    }
})
test("sign in", async () => {
    await Promise.all(signups)
    {
        let result = await api.post("/signin")
            .send({ username: "username", password: "password" })
            .expect(200)
        expect(result.body).toHaveProperty("token");
    }
    {
        let result = await api.post("/signin")
            .send({ username: "hello@world.com", password: "123456" })
            .expect(200)
        expect(result.body).toHaveProperty("token");
    }
    {
        let result = await api.post("/signin")
            .send({ username: "hallå", password: "password" })
            .expect(200)
        expect(result.body).toHaveProperty("token");
    }
    {
        let result = await api.post("/signin")
            .send({ username: "random", password: "lösenord" })
            .expect(200)
        expect(result.body).toHaveProperty("token");
    }
    {
        let result = await api.post("/signin")
            .send({ username: "randåm", password: "losenord" })
            .expect(200)
        expect(result.body).toHaveProperty("token");
    }
    {
        let result = await api.post("/signin")
            .send({ username: "blablå", password: "lösenord" })
            .expect(200)
        expect(result.body).toHaveProperty("token");
    }
})
