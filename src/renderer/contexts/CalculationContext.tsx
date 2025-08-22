import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import {
    EmploymentIncome,
    RentalIncome,
    InterestIncome,
    DividendIncome,
    BusinessIncome,
    OtherIncome
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
    clearAllIncome: () => void;

    // Calculated values
    calculationResult: CalculationResult | null;
    assessableIncome: number;
    totalTaxableIncome: number;
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

    const clearAllIncome = () => {
        setEmploymentIncome(null);
        setRentalIncome(null);
        setInterestIncome(null);
        setDividendIncome(null);
        setBusinessIncome(null);
        setOtherIncome(null);
        setSolarRelief(0);
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
        clearAllIncome,

        // Calculated values
        calculationResult,
        assessableIncome,
        totalTaxableIncome
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
