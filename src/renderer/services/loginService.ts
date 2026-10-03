import axios from "axios";
import { API_BASE_URL } from "../config/api";

const login = async (username: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
    return response.data.data;
}

export const loginService = {
    login
}