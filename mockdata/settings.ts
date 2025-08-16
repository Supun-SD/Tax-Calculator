import { Settings } from "src/types/settings";

const settings: Settings = {
    reliefsAndAit: {
        personalRelief: 1200000.00,
        rentRelief: 25,
        aitInterest: 5,
        aitDividend: 15,
        whtRent: 10,
        foreignIncomeTaxRate: 15,
    },
    taxRates: {
        first: 6,
        second: 12,
        third: 18,
        fourth: 24,
        fifth: 30,
        other: 36
    }
}

export { settings }