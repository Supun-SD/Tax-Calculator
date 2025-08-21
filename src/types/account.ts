export interface Account {
  id: number;
  name: string;
  tinNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface AccountCreateReq {
  name: string;
  tinNumber: string;
}

export interface AccountUpdateReq {
  name: string;
  tinNumber: string;
}