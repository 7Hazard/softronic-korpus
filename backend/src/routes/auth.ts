import { Router } from "express"
import { argon2Verify } from "hash-wasm";
import { User, Users } from "../entities/User";
import jwt from "jsonwebtoken";
import { getDb as getDb } from "../database";

export default Router()
    .post("/signin", async (req, res) => {

        // TODO validate body
        let name = req.body.name;
        let passwordInput = req.body.password;

        let user = await Users.getOne(name);

        const isValid = await argon2Verify({
            password: passwordInput,
            hash: user.hashedPassword,
        });
        if (isValid) {

            let token = jwt.sign({
                name: user.name,
                created: Date.now()
            }, 'shhhhh');

            await getDb()
                .createQueryBuilder()
                .update(User)
                .set({ token: token })
                .where("name = :name", { name: user.name })
                .execute();

            res.status(200).json({ token });
        }
        else res.status(401).json()
    })
