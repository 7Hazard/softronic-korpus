import axios from "axios";

export const backend = axios.create({
    baseURL: "http://localhost:2525/",
    timeout: 1000
})


export async function fetchCustomerGroups() {
    try {
      let response = await backend.get("/groups")
      if (response.status != 200)
        alert(response.data)
      else {
        (response.data as any []).splice(0,0,{name:"All", group: null});
        return response.data;
      }
    } catch (error) {
      alert(error)
    }
  }
