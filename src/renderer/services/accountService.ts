import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { Account, AccountCreateReq, AccountUpdateReq } from "../../types/account";

const getHeaders = (token: string) => {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}

const getAllAccounts = async (token: string): Promise<Account[]> => {
    const response = await axios.get(`${API_BASE_URL}/account`, getHeaders(token));
    return response.data.data;
}

const createAccount = async (account: AccountCreateReq, token: string): Promise<Account> => {
    const response = await axios.post(`${API_BASE_URL}/account`, account, getHeaders(token));
    return response.data.data;
}

const updateAccount = async (id: number, account: AccountUpdateReq, token: string): Promise<Account> => {
    const response = await axios.put(`${API_BASE_URL}/account/${id}`, account, getHeaders(token));
    return response.data.data;
}

const deleteAccount = async (id: number, token: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/account/${id}`, getHeaders(token));
}

export const accountService = {
    getAllAccounts,
    createAccount,
    updateAccount,
    deleteAccount
}