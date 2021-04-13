import express from "express";
import "reflect-metadata";
import { Word, Words } from "./entities/Word";
import bodyparser from "body-parser"
import * as db from "./db"

/// config
const port = 2525;
///

// setup database
await db.start();
console.log("SQLite initialized in file 'database.db'");

const queryRunner = db.get().createQueryRunner();

const app = express();
app.use(bodyparser.json({}))

app.get('/words', async (req, res) => {
  let getAll = await db.get().manager.find(Word);
  res.status(200).json(getAll)
})
app.get('/words/:wordid', async (req, res) => {
  let wordid = req.params.wordid
  const wordsById = await db.get().manager.findOne(Word, wordid); // find by id  

  res.status(200).json(wordsById)

})

app.post('/words', async (req, res) => {
  let text = req.body.text;
  let word = new Word(text);
  word = await db.get().getRepository(Word).save(new Word(text));
  res.status(200).json(word)
})

app.delete('/words/:wordid', async (req, res) => {
  let wordid = req.params.wordid

  await db.get()
    .createQueryBuilder()
    .delete()
    .from(Word)
    .where("id = :id", { id: wordid })
    .execute();

  res.status(200).json()
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


