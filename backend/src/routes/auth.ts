import { Router } from "express"
import { argon2Verify } from "hash-wasm";
import { User, Users } from "../entities/User";
import jwt from "jsonwebtoken";
import { get as getDb } from "../database";



export default Router()
.post("/signin", async (req, res) => {
        
        let name = req.body.name;
        let passwordInput = req.body.password;

        let user = await Users.getOne(name);

        let namePrimary = req.params.namePrimary;

        const isValid = await argon2Verify({
            password: passwordInput,
            hash: user.hashedPassword,
        });
        if (isValid)
        {
            
            let token = jwt.sign({name: user.name},'shhhhh');
            jwt.sign({data: 'foobar'}, 'secret', { expiresIn: '24h' });

            await getDb()
            .createQueryBuilder()
            .update(User)
            .set({ token: token })
            .where("name = :name", { name: user.name })
            .execute();

            res.status(200).json({token});

        }
        else res.status(401).json()
    })