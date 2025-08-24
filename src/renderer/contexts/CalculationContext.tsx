import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { Calculation, CalculationReq, EmploymentIncome, RentalIncome, InterestIncome, DividendIncome, BusinessIncome, OtherIncome } from '../../types/calculation';
import { useSettingsContext } from './SettingsContext';
import { Status } from '../../types/enums/status';
import { useCalculations } from '../hooks/useCalculations';

interface CalculationContextType {
    currentCalculation: Calculation | CalculationReq | null;
    setCurrentCalculation: (calculation: Calculation | CalculationReq | null) => void;
    createNewCalculation: (isEditing: boolean, calculationId?: number) => Promise<void>;
    updateCalculationAccount: (accountId: number, year: string) => void;
    updateEmploymentIncome: (employmentIncome: EmploymentIncome | null) => void;
    updateRentalIncome: (rentalIncome: RentalIncome | null) => void;
    updateInterestIncome: (interestIncome: InterestIncome | null) => void;
    updateDividendIncome: (dividendIncome: DividendIncome | null) => void;
    updateBusinessIncome: (businessIncome: BusinessIncome | null) => void;
    updateOtherIncome: (otherIncome: OtherIncome | null) => void;
    updateTotalAssessableIncome: (totalAssessableIncome: number) => void;
    updateRentRelief: (rentRelief: number) => void;
    isLoading: boolean;
    isEditing: boolean;
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
    const [isEditing, setIsEditing] = useState(false);

    const createNewCalculation = useCallback(async (isEditing: boolean, calculationId?: number) => {
        setIsLoading(true);
        try {
            if (isEditing && calculationId !== undefined) {
                const calculation = await getCalculationById(calculationId);
                setCurrentCalculation(calculation);
                setIsEditing(true);
            } else {
                setIsEditing(false);
                const newCalculation: CalculationReq = {
                    year: '',
                    status: Status.DRAFT,
                    accountId: 0,
                    calculationData: {
                        settings: {
                            reliefsAndAit: settings.reliefsAndAit,
                            taxRates: settings.taxRates
                        },
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

    const updateCalculationAccount = useCallback((accountId: number, year: string) => {
        if (currentCalculation) {
            const updatedCalculation = {
                ...currentCalculation,
                accountId,
                year
            };
            setCurrentCalculation(updatedCalculation);
        }
    }, [currentCalculation]);

    const updateEmploymentIncome = useCallback((employmentIncome: EmploymentIncome | null) => {
        if (currentCalculation) {
            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    sourceOfIncome: {
                        ...currentCalculation.calculationData.sourceOfIncome,
                        employmentIncome
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);
        }
    }, [currentCalculation]);

    const updateRentRelief = useCallback((rentRelief: number) => {
        if (currentCalculation) {
            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    deductionsFromAssessableIncome: {
                        ...currentCalculation.calculationData.deductionsFromAssessableIncome,
                        rentRelief
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);
        }
    }, [currentCalculation]);

    const updateRentalIncome = useCallback((rentalIncome: RentalIncome | null) => {
        if (currentCalculation) {
            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    sourceOfIncome: {
                        ...currentCalculation.calculationData.sourceOfIncome,
                        rentalIncome
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);

            if (rentalIncome) {
                const rentReliefAmount = (rentalIncome.total * currentCalculation.calculationData.settings.reliefsAndAit.rentRelief) / 100;
                const updatedCalculationWithRentRelief = {
                    ...updatedCalculation,
                    calculationData: {
                        ...updatedCalculation.calculationData,
                        deductionsFromAssessableIncome: {
                            ...updatedCalculation.calculationData.deductionsFromAssessableIncome,
                            rentRelief: rentReliefAmount
                        }
                    }
                };
                setCurrentCalculation(updatedCalculationWithRentRelief);
            } else {
                const updatedCalculationWithZeroRentRelief = {
                    ...updatedCalculation,
                    calculationData: {
                        ...updatedCalculation.calculationData,
                        deductionsFromAssessableIncome: {
                            ...updatedCalculation.calculationData.deductionsFromAssessableIncome,
                            rentRelief: 0
                        }
                    }
                };
                setCurrentCalculation(updatedCalculationWithZeroRentRelief);
            }
        }
    }, [currentCalculation]);

    const updateInterestIncome = useCallback((interestIncome: InterestIncome | null) => {
        if (currentCalculation) {
            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    sourceOfIncome: {
                        ...currentCalculation.calculationData.sourceOfIncome,
                        interestIncome
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);
        }
    }, [currentCalculation]);

    const updateDividendIncome = useCallback((dividendIncome: DividendIncome | null) => {
        if (currentCalculation) {
            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    sourceOfIncome: {
                        ...currentCalculation.calculationData.sourceOfIncome,
                        dividendIncome
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);
        }
    }, [currentCalculation]);

    const updateBusinessIncome = useCallback((businessIncome: BusinessIncome | null) => {
        if (currentCalculation) {
            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    sourceOfIncome: {
                        ...currentCalculation.calculationData.sourceOfIncome,
                        businessIncome
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);
        }
    }, [currentCalculation]);

    const updateOtherIncome = useCallback((otherIncome: OtherIncome | null) => {
        if (currentCalculation) {
            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    sourceOfIncome: {
                        ...currentCalculation.calculationData.sourceOfIncome,
                        otherIncome
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);
        }
    }, [currentCalculation]);

    const updateTotalAssessableIncome = useCallback((totalAssessableIncome: number) => {
        if (currentCalculation) {
            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    sourceOfIncome: {
                        ...currentCalculation.calculationData.sourceOfIncome,
                        totalAssessableIncome
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);
        }
    }, [currentCalculation]);

    const value = useMemo(() => ({
        currentCalculation,
        setCurrentCalculation,
        createNewCalculation,
        updateCalculationAccount,
        updateEmploymentIncome,
        updateRentalIncome,
        updateInterestIncome,
        updateDividendIncome,
        updateBusinessIncome,
        updateOtherIncome,
        updateTotalAssessableIncome,
        updateRentRelief,
        isLoading,
        isEditing,
    }), [
        currentCalculation,
        createNewCalculation,
        updateCalculationAccount,
        updateEmploymentIncome,
        updateRentalIncome,
        updateInterestIncome,
        updateDividendIncome,
        updateBusinessIncome,
        updateOtherIncome,
        updateTotalAssessableIncome,
        updateRentRelief,
        isLoading
    ]);

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
