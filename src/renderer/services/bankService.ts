import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { Bank, BankCreateReq, BankUpdateReq } from "../../types/bank";

const getHeaders = (token: string) => {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}

const getAllBanks = async (token: string): Promise<Bank[]> => {
    const response = await axios.get(`${API_BASE_URL}/bank`, getHeaders(token));
    return response.data.data;
}

const createBank = async (bank: BankCreateReq, token: string): Promise<Bank> => {
    const response = await axios.post(`${API_BASE_URL}/bank`, bank, getHeaders(token));
    return response.data.data;
}

const updateBank = async (id: number, bank: BankUpdateReq, token: string): Promise<Bank> => {
    const response = await axios.put(`${API_BASE_URL}/bank/${id}`, bank, getHeaders(token));
    return response.data.data;
}

const deleteBank = async (id: number, token: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/bank/${id}`, getHeaders(token));
}

export const bankService = {
    getAllBanks,
    createBank,
    updateBank,
    deleteBank
}
