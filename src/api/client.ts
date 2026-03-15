import axios from "axios";
import { API_URL } from "../config/env";

console.log("API_URL:", API_URL);

const client = axios.create({
	baseURL: API_URL,
	timeout: 5000, // 5s
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

export default client;
