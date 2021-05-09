import axios from "axios";

export const backend = axios.create({
    baseURL: "http://localhost:2525/",
    timeout: 1000
})
