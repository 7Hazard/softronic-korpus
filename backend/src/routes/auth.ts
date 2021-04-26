import { Router } from "express"
import { argon2Verify } from "hash-wasm";
import { User, Users } from "../entities/User";
import jwt from "jsonwebtoken";
import { getDb as getDb } from "../database";
import Validator from "validatorjs";

export default Router()
    .post("/signin", async (req, res) => {

        let validation = new Validator(req.body, {
            name: ["required", "min:1", "max:100", "regex:/^[A-z0-9@._!-]+$/"],
            password: ["required", "min:1", "max:100", "regex:/^[A-z0-9@._%*]+$/"]
        })

        if (validation.fails()) {
            res.status(400).json(validation.errors)
            return
        } else if (validation.passes()) {
            let name = req.body.name as string;
            name = name.toLowerCase();
            let passwordInput = req.body.password;

            let user = await Users.getOne(name);

            if (!user) {
                res.sendStatus(401);
                return
            }
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
        }
    })
