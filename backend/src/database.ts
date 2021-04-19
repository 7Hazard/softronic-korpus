import { Connection, createConnection } from "typeorm";
import { CustomerGroup } from "./entities/CustomerGroup";
import { Word } from "./entities/Word";

let database: Connection;
export async function start(logging: boolean, path = "database.db") {

  database = await createConnection({
    type: "sqlite",
    database: path,
    entities: [Word,CustomerGroup],
    synchronize: true,
    logging: logging,
  });
  return database;
}

export function get(){
  return database;
}
