import { api } from "./server"

// Returns id
export async function addWord(text: string): Promise<number> {
  let response = await api.post("/words").send({ text: text })
  return response.body.id
}
export async function addGroup(text: string): Promise<number> {
  let response = await api.post("/customerGroup").send({ text: text })
  return response.body.id
}
