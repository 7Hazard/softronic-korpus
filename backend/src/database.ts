import { createConnection } from "typeorm";
import { Word } from "./entities/Word";

export async function start(logging: boolean, path = "database.db") {
  return await createConnection({
    type: "sqlite",
    database: path,
    entities: [Word],
    synchronize: true,
    logging: logging,
  });
}
