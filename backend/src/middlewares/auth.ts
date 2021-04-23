
import jwt from "jsonwebtoken";
import { Users } from "../entities/User";

export async function authToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // if we have an authHeader,then return authHeader portion

    if (token == null)
        return res.sendStatus(401)

    try {
        var decode = jwt.verify(token, 'shhhhh');
    } catch (err) {
        res.sendStatus(401);
        return;
    }

    var username = decode["name"];
    let user = await Users.getOne(username);

    if (!user) {
        res.sendStatus(401);
        return;
    }

    if (token !== user.token) { // checks if token exits in database
        res.sendStatus(401);
        return;
    }

    next()
}
