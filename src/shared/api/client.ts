import axios from "axios";
import { API_URL } from "../../app/config/env";

/* 
    Shared Axios client for all API modules.
    This file should only contain transport-level configuration that is common
    across the app, such as base URL, timeout, and default headers.
*/
const client = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export default client;