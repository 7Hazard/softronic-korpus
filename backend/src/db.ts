import typeorm, { getConnection, InsertQueryBuilder } from "typeorm";
import { Word } from "./entities/Word.js";

let db: typeorm.Connection;

export async function start() {
  let dbPath = "database.db"
  
  if (process.env["KORPUS_TEST"])
    dbPath = ":memory"
  
  db = await typeorm.createConnection({
    type: "sqlite",
    database: dbPath,
    entities: [Word],
    synchronize: true,
    logging: true,
  });
}

export function get() {
  return db;
}
