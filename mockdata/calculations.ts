import { Calculation } from "src/types/calculation";
import { accounts } from "./accounts";

const calculations: Array<Calculation> = [
    {
        id: 1,
        dateAndTime: new Date("2024-01-15T10:30:00"),
        year: "2024/2025",
        account: accounts[0],
        calculationData: {
            grossIncome: 75000,
            deductions: 12000,
            taxableIncome: 63000,
            taxRate: 0.22,
            taxAmount: 13860,
            netIncome: 61140
        }
    },
    {
        id: 2,
        dateAndTime: new Date("2024-02-20T14:45:00"),
        year: "2024/2025",
        account: accounts[1],
        calculationData: {
            grossIncome: 85000,
            deductions: 15000,
            taxableIncome: 70000,
            taxRate: 0.24,
            taxAmount: 16800,
            netIncome: 68200
        }
    },
    {
        id: 3,
        dateAndTime: new Date("2024-03-10T09:15:00"),
        year: "2024/2025",
        account: accounts[2],
        calculationData: {
            grossIncome: 65000,
            deductions: 8000,
            taxableIncome: 57000,
            taxRate: 0.22,
            taxAmount: 12540,
            netIncome: 52460
        }
    },
    {
        id: 4,
        dateAndTime: new Date("2024-04-05T16:20:00"),
        year: "2024/2025",
        account: accounts[3],
        calculationData: {
            grossIncome: 95000,
            deductions: 18000,
            taxableIncome: 77000,
            taxRate: 0.24,
            taxAmount: 18480,
            netIncome: 76520
        }
    },
    {
        id: 5,
        dateAndTime: new Date("2024-05-12T11:30:00"),
        year: "2024/2025",
        account: accounts[4],
        calculationData: {
            grossIncome: 70000,
            deductions: 10000,
            taxableIncome: 60000,
            taxRate: 0.22,
            taxAmount: 13200,
            netIncome: 56800
        }
    },
    {
        id: 6,
        dateAndTime: new Date("2023-12-28T13:45:00"),
        year: "2024/2025",
        account: accounts[5],
        calculationData: {
            grossIncome: 80000,
            deductions: 14000,
            taxableIncome: 66000,
            taxRate: 0.22,
            taxAmount: 14520,
            netIncome: 65480
        }
    },
    {
        id: 7,
        dateAndTime: new Date("2023-11-15T08:30:00"),
        year: "2024/2025",
        account: accounts[6],
        calculationData: {
            grossIncome: 60000,
            deductions: 9000,
            taxableIncome: 51000,
            taxRate: 0.22,
            taxAmount: 11220,
            netIncome: 48780
        }
    },
    {
        id: 8,
        dateAndTime: new Date("2023-10-22T15:10:00"),
        year: "2024/2025",
        account: accounts[7],
        calculationData: {
            grossIncome: 90000,
            deductions: 16000,
            taxableIncome: 74000,
            taxRate: 0.24,
            taxAmount: 17760,
            netIncome: 72240
        }
    }
];

export { calculations };