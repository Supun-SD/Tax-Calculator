export interface Bank {
  id: number;
  name: string;
  tinNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankCreateReq {
  name: string;
  tinNumber: string;
}

export interface BankUpdateReq {
  name: string;
  tinNumber: string;
}