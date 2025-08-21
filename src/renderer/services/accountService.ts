import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { Account } from "../../types/account";
import { AccountCreateReq } from "../../types/AccountCreateReq";
import { AccountUpdateReq } from "../../types/AccountUpdateReq";


const getAllAccounts = async (): Promise<Account[]> => {
    const response = await axios.get(`${API_BASE_URL}/account`);
    return response.data.data;
}

const createAccount = async (account: AccountCreateReq): Promise<Account> => {
    const response = await axios.post(`${API_BASE_URL}/account`, account);
    return response.data.data;
}

const updateAccount = async (id: number, account: AccountUpdateReq): Promise<Account> => {
    const response = await axios.put(`${API_BASE_URL}/account/${id}`, account);
    return response.data.data;
}

const deleteAccount = async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/account/${id}`);
}

export const accountService = {
    getAllAccounts,
    createAccount,
    updateAccount,
    deleteAccount
}