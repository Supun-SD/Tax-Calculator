import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { Settings, SettingsUpdateReq } from "src/types/settings";

const getSettingsByYear = async (year: string): Promise<Settings> => {
    year = year.replace("/", "%2F");
    const response = await axios.get(`${API_BASE_URL}/settings/year/${year}`);
    return response.data.data;
}

const updateSettings = async (id: number, settings: SettingsUpdateReq): Promise<Settings> => {
    const response = await axios.put(`${API_BASE_URL}/settings/${id}`, settings);
    return response.data.data;
}

export const settingsService = {
    getSettingsByYear,
    updateSettings
}