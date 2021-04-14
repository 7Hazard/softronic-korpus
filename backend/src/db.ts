import typeorm, { getConnection, InsertQueryBuilder } from "typeorm";
import { Word } from "./entities/Word.js";

let db: typeorm.Connection;

export async function start()
{
  db = await typeorm.createConnection({
    type: "sqlite",
    database: "./database.db",
    entities: [Word],
    synchronize: false,
    logging: true,
  });
}

export function get() {
  return db;
}
