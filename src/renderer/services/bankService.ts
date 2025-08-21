import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { Bank } from "src/types/bank";
import { BankCreateReq } from "src/types/BankCreateReq";
import { BankUpdateReq } from "src/types/BankUpdateReq";

const getAllBanks = async (): Promise<Bank[]> => {
    const response = await axios.get(`${API_BASE_URL}/bank`);
    return response.data.data;
}

const createBank = async (bank: BankCreateReq): Promise<Bank> => {
    const response = await axios.post(`${API_BASE_URL}/bank`, bank);
    return response.data.data;
}

const updateBank = async (id: number, bank: BankUpdateReq): Promise<Bank> => {
    const response = await axios.put(`${API_BASE_URL}/bank/${id}`, bank);
    return response.data.data;
}

const deleteBank = async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/bank/${id}`);
}

export const bankService = {
    getAllBanks,
    createBank,
    updateBank,
    deleteBank
}
