import express from "express";
import "reflect-metadata";
import typeorm from "typeorm";
import { Word } from "./entities/Word.js";

/// config
const port = 2525;
///

// setup database
const connection = await typeorm.createConnection({
  type: "sqlite",
  database: "./database.db",
  entities: [Word],
  synchronize: true,
  logging: true,
});
console.log("SQLite initialized in file 'database.db'");
const app = express();

const queryRunner = connection.createQueryRunner();

app.get('/words', async (req, res) => {
  let g = await connection.manager.find(Word);
  res.status(200).json(g)
})


// let word = new Word;
// word.text = "HEJ";
// await connection.manager.save(word);
//connection.getRepository(Word).insert(word);


app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


