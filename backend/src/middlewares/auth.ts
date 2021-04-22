
import jwt from "jsonwebtoken";
import { User, Users } from "../entities/User";

export async function authenticateToken(req, res, next) {
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

  var user = decode["name"];
  let userDb = await Users.getOne(user);

  if (userDb === null) {
      res.sendStatus(401);
      return;
  }

  if (token !== userDb.token) { // checks if token exits in database
      res.sendStatus(401);
      return;
  }

  next()
}
