import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import {
    EmploymentIncome,
    RentalIncome,
    InterestIncome,
    DividendIncome,
    BusinessIncome,
    OtherIncome,
    GrossIncomeTax
} from '../../types/calculation';
import { CalculationService, IncomeData, CalculationResult } from '../services/calculationService';
import { useSettingsContext } from './SettingsContext';

interface CalculationContextType {
    // Income data
    employmentIncome: EmploymentIncome | null;
    rentalIncome: RentalIncome | null;
    interestIncome: InterestIncome | null;
    dividendIncome: DividendIncome | null;
    businessIncome: BusinessIncome | null;
    otherIncome: OtherIncome | null;
    solarRelief: number;

    // Actions
    setEmploymentIncome: (income: EmploymentIncome | null) => void;
    setRentalIncome: (income: RentalIncome | null) => void;
    setInterestIncome: (income: InterestIncome | null) => void;
    setDividendIncome: (income: DividendIncome | null) => void;
    setBusinessIncome: (income: BusinessIncome | null) => void;
    setOtherIncome: (income: OtherIncome | null) => void;
    setSolarRelief: (relief: number) => void;
    setGrossIncomeTax: (taxData: GrossIncomeTax) => void;
    setQuarterlyPayments: (quarterly: { one: number; two: number; three: number; four: number }) => void;
    clearAllIncome: () => void;

    // Calculated values
    calculationResult: CalculationResult | null;
    assessableIncome: number;
    totalTaxableIncome: number;
    grossIncomeTax: GrossIncomeTax | null;
    totalPayableTax: number;
    payableTaxBreakdown: {
        rentWhtDeduction: number;
        totalAit: number;
        appitTotal: number;
    };
    balancePayableTax: number;
    quarterlyPayments: {
        one: number;
        two: number;
        three: number;
        four: number;
    };
}

const CalculationContext = createContext<CalculationContextType | undefined>(undefined);

interface CalculationProviderProps {
    children: ReactNode;
}

export const CalculationProvider: React.FC<CalculationProviderProps> = ({ children }) => {
    const { settings } = useSettingsContext();

    // Income state
    const [employmentIncome, setEmploymentIncome] = useState<EmploymentIncome | null>(null);
    const [rentalIncome, setRentalIncome] = useState<RentalIncome | null>(null);
    const [interestIncome, setInterestIncome] = useState<InterestIncome | null>(null);
    const [dividendIncome, setDividendIncome] = useState<DividendIncome | null>(null);
    const [businessIncome, setBusinessIncome] = useState<BusinessIncome | null>(null);
    const [otherIncome, setOtherIncome] = useState<OtherIncome | null>(null);
    const [solarRelief, setSolarRelief] = useState<number>(0);
    const [grossIncomeTax, setGrossIncomeTax] = useState<GrossIncomeTax | null>(null);
    const [quarterlyPayments, setQuarterlyPayments] = useState<{ one: number; two: number; three: number; four: number }>({ one: 0, two: 0, three: 0, four: 0 });

    // Calculate results when income data or settings change
    const calculationResult = useMemo(() => {
        if (!settings) {
            return null;
        }

        const incomeData: IncomeData = {
            employmentIncome,
            rentalIncome,
            interestIncome,
            dividendIncome,
            businessIncome,
            otherIncome,
            solarRelief
        };
        const result = CalculationService.calculateTotalTaxableIncome(incomeData, settings);

        return result;
    }, [
        employmentIncome,
        rentalIncome,
        interestIncome,
        dividendIncome,
        businessIncome,
        otherIncome,
        solarRelief,
        settings
    ]);

    const assessableIncome = CalculationService.roundToTwoDecimals(calculationResult?.assessableIncome || 0);
    const totalTaxableIncome = CalculationService.roundToTwoDecimals(calculationResult?.totalTaxableIncome || 0);

    // Calculate total payable tax
    const totalPayableTaxCalculation = useMemo(() => {
        if (!settings || !grossIncomeTax) {
            return {
                totalPayableTax: 0,
                payableTaxBreakdown: {
                    rentWhtDeduction: 0,
                    totalAit: 0,
                    appitTotal: 0
                }
            };
        }

        const grossIncomeTaxAmount = grossIncomeTax.total || 0;
        const rentIncome = rentalIncome?.total || 0;
        const whtRentRate = settings.reliefsAndAit.whtRent || 0;
        const aitInterestRate = settings.reliefsAndAit.aitInterest || 0;
        const totalAit = interestIncome?.totalAit || 0;
        const appitTotal = employmentIncome?.appitTotal || 0;

        // Calculate rent WHT deduction
        const rentWhtDeduction = (rentIncome * whtRentRate) / 100;

        // Calculate total payable tax
        const totalPayableTax = grossIncomeTaxAmount - rentWhtDeduction - totalAit - appitTotal;

        return {
            totalPayableTax: totalPayableTax,
            payableTaxBreakdown: {
                rentWhtDeduction: CalculationService.roundToTwoDecimals(rentWhtDeduction),
                totalAit: CalculationService.roundToTwoDecimals(totalAit),
                appitTotal: CalculationService.roundToTwoDecimals(appitTotal)
            }
        };
    }, [grossIncomeTax, rentalIncome, interestIncome, employmentIncome, settings]);

    // Calculate balance payable tax
    const balancePayableTaxCalculation = useMemo(() => {
        if (!settings || !grossIncomeTax) {
            return 0;
        }

        const totalPayableTax = totalPayableTaxCalculation.totalPayableTax;
        const quarterlyPaymentsSum = quarterlyPayments.one + quarterlyPayments.two + quarterlyPayments.three + quarterlyPayments.four;
        const balancePayableTax = totalPayableTax - quarterlyPaymentsSum;

        return CalculationService.roundToTwoDecimals(balancePayableTax);
    }, [totalPayableTaxCalculation.totalPayableTax, quarterlyPayments, settings]);

    const clearAllIncome = () => {
        setEmploymentIncome(null);
        setRentalIncome(null);
        setInterestIncome(null);
        setDividendIncome(null);
        setBusinessIncome(null);
        setOtherIncome(null);
        setSolarRelief(0);
        setGrossIncomeTax(null);
        setQuarterlyPayments({ one: 0, two: 0, three: 0, four: 0 });
    };

    const value: CalculationContextType = {
        // Income data
        employmentIncome,
        rentalIncome,
        interestIncome,
        dividendIncome,
        businessIncome,
        otherIncome,
        solarRelief,

        // Actions
        setEmploymentIncome,
        setRentalIncome,
        setInterestIncome,
        setDividendIncome,
        setBusinessIncome,
        setOtherIncome,
        setSolarRelief,
        setGrossIncomeTax,
        setQuarterlyPayments,
        clearAllIncome,

        // Calculated values
        calculationResult,
        assessableIncome,
        totalTaxableIncome,
        grossIncomeTax,
        totalPayableTax: totalPayableTaxCalculation.totalPayableTax,
        payableTaxBreakdown: totalPayableTaxCalculation.payableTaxBreakdown,
        balancePayableTax: balancePayableTaxCalculation,
        quarterlyPayments: quarterlyPayments
    };

    return (
        <CalculationContext.Provider value={value}>
            {children}
        </CalculationContext.Provider>
    );
};

export const useCalculationContext = (): CalculationContextType => {
    const context = useContext(CalculationContext);
    if (context === undefined) {
        throw new Error('useCalculationContext must be used within a CalculationProvider');
    }
    return context;
};
