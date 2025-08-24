import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { Calculation, CalculationReq } from '../../types/calculation';
import { useSettingsContext } from './SettingsContext';
import { Status } from '../../types/enums/status';
import { useCalculations } from '../hooks/useCalculations';

interface CalculationContextType {
    currentCalculation: Calculation | CalculationReq | null;
    setCurrentCalculation: (calculation: Calculation | CalculationReq | null) => void;
    createNewCalculation: (isEditing: boolean, calculationId: number) => Promise<void>;
    isLoading: boolean;
}

const CalculationContext = createContext<CalculationContextType | undefined>(undefined);

interface CalculationProviderProps {
    children: ReactNode;
}

export const CalculationProvider: React.FC<CalculationProviderProps> = ({ children }) => {
    const { settings } = useSettingsContext();

    const { getCalculationById } = useCalculations();
    const [currentCalculation, setCurrentCalculation] = useState<Calculation | CalculationReq | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const createNewCalculation = useCallback(async (isEditing: boolean, calculationId?: number) => {
        setIsLoading(true);
        try {
            if (isEditing && calculationId !== undefined) {
                const calculation = await getCalculationById(calculationId);
                setCurrentCalculation(calculation);
            } else {
                const newCalculation: CalculationReq = {
                    year: '',
                    status: Status.DRAFT,
                    accountId: 0,
                    calculationData: {
                        settings: settings,
                        sourceOfIncome: {
                            employmentIncome: null,
                            rentalIncome: null,
                            interestIncome: null,
                            dividendIncome: null,
                            businessIncome: null,
                            otherIncome: null,
                            totalAssessableIncome: 0
                        },
                        deductionsFromAssessableIncome: {
                            rentRelief: 0,
                            solarRelief: 0
                        },
                        totalTaxableIncome: 0,
                        grossIncomeTax: null,
                        totalPayableTax: 0,
                        balancePayableTax: {
                            total: 0,
                            quarterly: {
                                one: 0,
                                two: 0,
                                three: 0,
                                four: 0
                            }
                        }
                    }
                };
                setCurrentCalculation(newCalculation);
            }
        } finally {
            setIsLoading(false);
        }
    }, [settings, getCalculationById]);

    const value = useMemo(() => ({
        currentCalculation,
        setCurrentCalculation,
        createNewCalculation,
        isLoading,
    }), [currentCalculation, createNewCalculation, isLoading]);

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
