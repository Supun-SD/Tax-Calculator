import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { Settings, SettingsUpdateReq } from "src/types/settings";

const getHeaders = (token: string) => {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}

const getSettingsByYear = async (year: string, token: string): Promise<Settings> => {
    year = year.replace("/", "%2F");
    const response = await axios.get(`${API_BASE_URL}/settings/year/${year}`, getHeaders(token));
    return response.data.data;
}

const updateSettings = async (id: number, settings: SettingsUpdateReq, token: string): Promise<Settings> => {
    const response = await axios.put(`${API_BASE_URL}/settings/${id}`, settings, getHeaders(token));
    return response.data.data;
}

export const settingsService = {
    getSettingsByYear,
    updateSettings
}