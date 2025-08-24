import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { Calculation, CalculationReq, EmploymentIncome, RentalIncome, InterestIncome, DividendIncome, BusinessIncome, OtherIncome } from '../../types/calculation';
import { useSettingsContext } from './SettingsContext';
import { Status } from '../../types/enums/status';
import { useCalculations } from '../hooks/useCalculations';

const calculateTotalAssessableIncome = (
    employmentIncome: EmploymentIncome | null,
    rentalIncome: RentalIncome | null,
    interestIncome: InterestIncome | null,
    dividendIncome: DividendIncome | null,
    businessIncome: BusinessIncome | null,
    otherIncome: OtherIncome | null
): number => {
    let total = 0;

    // Add employment income
    if (employmentIncome) {
        total += employmentIncome.total;
    }

    // Add rental income
    if (rentalIncome) {
        total += rentalIncome.total;
    }

    // Add interest income (gross interest)
    if (interestIncome) {
        total += interestIncome.totalGrossInterest;
    }

    // Add dividend income (gross dividend)
    if (dividendIncome) {
        total += dividendIncome.totalGrossDividend;
    }

    // Add business income (amount for assessable income)
    if (businessIncome) {
        total += businessIncome.amountForAssessableIncome;
    }

    // Add other income
    if (otherIncome) {
        total += otherIncome.total;
    }

    return total;
};

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
    recalculateTotalAssessableIncome: () => void;
    updateSolarRelief: (solarRelief: number) => void;
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
            const sourceOfIncome = currentCalculation.calculationData.sourceOfIncome;
            const totalAssessableIncome = calculateTotalAssessableIncome(
                employmentIncome,
                sourceOfIncome.rentalIncome,
                sourceOfIncome.interestIncome,
                sourceOfIncome.dividendIncome,
                sourceOfIncome.businessIncome,
                sourceOfIncome.otherIncome
            );

            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    sourceOfIncome: {
                        ...sourceOfIncome,
                        employmentIncome,
                        totalAssessableIncome
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);
        }
    }, [currentCalculation]);

    const updateRentalIncome = useCallback((rentalIncome: RentalIncome | null) => {
        if (currentCalculation) {
            const sourceOfIncome = currentCalculation.calculationData.sourceOfIncome;
            const totalAssessableIncome = calculateTotalAssessableIncome(
                sourceOfIncome.employmentIncome,
                rentalIncome,
                sourceOfIncome.interestIncome,
                sourceOfIncome.dividendIncome,
                sourceOfIncome.businessIncome,
                sourceOfIncome.otherIncome
            );

            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    sourceOfIncome: {
                        ...sourceOfIncome,
                        rentalIncome,
                        totalAssessableIncome
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
            const sourceOfIncome = currentCalculation.calculationData.sourceOfIncome;
            const totalAssessableIncome = calculateTotalAssessableIncome(
                sourceOfIncome.employmentIncome,
                sourceOfIncome.rentalIncome,
                interestIncome,
                sourceOfIncome.dividendIncome,
                sourceOfIncome.businessIncome,
                sourceOfIncome.otherIncome
            );

            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    sourceOfIncome: {
                        ...sourceOfIncome,
                        interestIncome,
                        totalAssessableIncome
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);
        }
    }, [currentCalculation]);

    const updateDividendIncome = useCallback((dividendIncome: DividendIncome | null) => {
        if (currentCalculation) {
            const sourceOfIncome = currentCalculation.calculationData.sourceOfIncome;
            const totalAssessableIncome = calculateTotalAssessableIncome(
                sourceOfIncome.employmentIncome,
                sourceOfIncome.rentalIncome,
                sourceOfIncome.interestIncome,
                dividendIncome,
                sourceOfIncome.businessIncome,
                sourceOfIncome.otherIncome
            );

            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    sourceOfIncome: {
                        ...sourceOfIncome,
                        dividendIncome,
                        totalAssessableIncome
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);
        }
    }, [currentCalculation]);

    const updateBusinessIncome = useCallback((businessIncome: BusinessIncome | null) => {
        if (currentCalculation) {
            const sourceOfIncome = currentCalculation.calculationData.sourceOfIncome;
            const totalAssessableIncome = calculateTotalAssessableIncome(
                sourceOfIncome.employmentIncome,
                sourceOfIncome.rentalIncome,
                sourceOfIncome.interestIncome,
                sourceOfIncome.dividendIncome,
                businessIncome,
                sourceOfIncome.otherIncome
            );

            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    sourceOfIncome: {
                        ...sourceOfIncome,
                        businessIncome,
                        totalAssessableIncome
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);
        }
    }, [currentCalculation]);

    const updateOtherIncome = useCallback((otherIncome: OtherIncome | null) => {
        if (currentCalculation) {
            const sourceOfIncome = currentCalculation.calculationData.sourceOfIncome;
            const totalAssessableIncome = calculateTotalAssessableIncome(
                sourceOfIncome.employmentIncome,
                sourceOfIncome.rentalIncome,
                sourceOfIncome.interestIncome,
                sourceOfIncome.dividendIncome,
                sourceOfIncome.businessIncome,
                otherIncome
            );

            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    sourceOfIncome: {
                        ...sourceOfIncome,
                        otherIncome,
                        totalAssessableIncome
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);
        }
    }, [currentCalculation]);

    const recalculateTotalAssessableIncome = useCallback(() => {
        if (currentCalculation) {
            const sourceOfIncome = currentCalculation.calculationData.sourceOfIncome;
            const totalAssessableIncome = calculateTotalAssessableIncome(
                sourceOfIncome.employmentIncome,
                sourceOfIncome.rentalIncome,
                sourceOfIncome.interestIncome,
                sourceOfIncome.dividendIncome,
                sourceOfIncome.businessIncome,
                sourceOfIncome.otherIncome
            );

            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    sourceOfIncome: {
                        ...sourceOfIncome,
                        totalAssessableIncome
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);
        }
    }, [currentCalculation]);

    const updateSolarRelief = useCallback((solarRelief: number) => {
        if (currentCalculation) {
            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    deductionsFromAssessableIncome: {
                        ...currentCalculation.calculationData.deductionsFromAssessableIncome,
                        solarRelief
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
        recalculateTotalAssessableIncome,
        updateSolarRelief,
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
        recalculateTotalAssessableIncome,
        updateSolarRelief,
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
