import express from "express";

// config
const port = 2525
//

const app = express()

app.get('/', (req, res) => {
  res.status(200).json({message: "Hello World"})
})

app.get('/words', (req, res) => {
  res.status(200).json({message: "Hello Words"})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


