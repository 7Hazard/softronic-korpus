import { Connection, createConnection } from "typeorm";
import { User } from "./entities/User";
import { Word } from "./entities/Word";

let database: Connection;
export async function start(logging: boolean, path = "database.db") {

  database = await createConnection({
    type: "sqlite",
    database: path,
    entities: [Word,User],
    synchronize: true,
    logging: logging,
  });
  return database;
}

export function get(){
  return database;
}
