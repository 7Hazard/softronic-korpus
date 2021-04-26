import { Router } from "express"
import { argon2Verify, bcrypt, bcryptVerify } from "hash-wasm";
import { User, Users } from "../entities/User";
import jwt from "jsonwebtoken";
import { getDb as getDb } from "../database";
import Validator from "validatorjs";
import { QueryFailedError } from "typeorm";


export default Router()


    .post("/signup", async (req, res) => {

        let validation = new Validator(req.body, {
            username: ['required', 'min:1', 'max:100', 'regex:/^[A-z0-9% &/-]+$/'],
            password: ['required', 'min:1', 'max:100', 'regex:/^[A-z0-9% &/-]+$/']
        });

        if (validation.fails()) {
            res.status(400).json(validation.errors);
        } else if (validation.passes()) {
            let username = req.body.username;
            let password = req.body.password.toLowerCase()

            try {
                let varia = await Users.create(username,password)
                res.status(200).json();
            } catch (error) {
                if (error instanceof QueryFailedError) {
                    res.status(409).json();
                }
            }
        }
    })

    .post("/signin", async (req, res) => {

        let validation = new Validator(req.body, {
            username: ["required", "min:1", "max:100", "regex:/^[A-z0-9@._!-]+$/"],
            password: ["required", "min:1", "max:100", "regex:/^[A-z0-9@._%*]+$/"]
        })

        if (validation.fails()) {
            res.status(400).json(validation.errors)
            return
        } else if (validation.passes()) {
            let username = req.body.username as string;
            username = username.toLowerCase();
            let passwordInput = req.body.password;

            let user = await Users.getOne(username);

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
                    username: user.username,
                    created: Date.now()
                }, 'shhhhh');

                await getDb()
                    .createQueryBuilder()
                    .update(User)
                    .set({ token: token })
                    .where("username = :username", { username: user.username })
                    .execute();

                res.status(200).json({ token });
            }
            else res.status(401).json()
        }
    })
