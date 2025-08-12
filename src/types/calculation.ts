import { Account } from './account';

export interface Calculation {
  id: number;
  dateAndTime: Date;
  year: string;
  account: Account;
  calculationData: any;
}
