import { Connection, createConnection } from "typeorm";
import all from "./entities/all";

let database: Connection;
export async function start(logging: boolean, path = "database.db") {
  database = await createConnection({
    type: "sqlite",
    database: path,
    entities: all,
    synchronize: true,
    logging: logging,
  });
  return database;
}

export function getDb(){
  return database;
}
