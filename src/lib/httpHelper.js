// import axios from "axios"

// export const httpAxios = axios.create({
//     baseURL : process.env.BACKEND_URL,
// })

import axios from "axios";

export const httpAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Use NEXT_PUBLIC for frontend access
});