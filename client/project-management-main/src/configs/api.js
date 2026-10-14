import axios from "axios";
//api function for fetching workspaces

export const api = axios.create({
  baseURL: import.meta.env.VITE_ABSEURL,
});
