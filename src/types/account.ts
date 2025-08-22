export interface Account {
  id: number;
  name: string;
  title: string;
  tinNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface AccountCreateReq {
  title: string;
  name: string;
  tinNumber: string;
}

export interface AccountUpdateReq {
  title: string;
  name: string;
  tinNumber: string;
}