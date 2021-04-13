import express from "express";
import "reflect-metadata";
import typeorm from "typeorm";

/// config
const port = 2525;
///

// setup database
const connection = await typeorm.createConnection({
  type: "sqlite",
  database: "./database.db",
  entities: [`${__dirname}/entities`],
  logging: true,
});
console.log("SQLite initialized in file 'database.db'");


const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
