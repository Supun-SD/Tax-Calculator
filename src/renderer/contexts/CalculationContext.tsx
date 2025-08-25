import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { Calculation, CalculationReq, EmploymentIncome, RentalIncome, InterestIncome, DividendIncome, BusinessIncome, OtherIncome, GrossIncomeTaxSlab } from '../../types/calculation';
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

    if (employmentIncome) {
        total += employmentIncome.total;
    }

    if (rentalIncome) {
        total += rentalIncome.total;
    }

    if (interestIncome) {
        total += interestIncome.totalGrossInterest;
    }

    if (dividendIncome) {
        total += dividendIncome.totalGrossDividend;
    }

    if (businessIncome) {
        total += businessIncome.amountForAssessableIncome;
    }

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
    updateForeignIncome: (foreignIncome: number) => void;
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

    const calculateAndUpdateTotalTaxableIncome = useCallback((calculation: Calculation | CalculationReq) => {
        const totalAssessableIncome = calculation.calculationData.sourceOfIncome.totalAssessableIncome;
        const personalRelief = calculation.calculationData.settings.reliefsAndAit.personalRelief;
        const rentRelief = calculation.calculationData.deductionsFromAssessableIncome.rentRelief;
        const solarRelief = calculation.calculationData.deductionsFromAssessableIncome.solarRelief;

        const totalTaxableIncome = Math.max(0, totalAssessableIncome - personalRelief - rentRelief - solarRelief);

        const updatedCalculation = {
            ...calculation,
            calculationData: {
                ...calculation.calculationData,
                totalTaxableIncome
            }
        };
        setCurrentCalculation(updatedCalculation);
        calculateAndUpdateGrossIncomeTax(updatedCalculation);
    }, []);

    const calculateAndUpdateGrossIncomeTax = useCallback((calculation: Calculation | CalculationReq) => {
        const totalTaxableIncome = calculation.calculationData.totalTaxableIncome;
        const taxRates = calculation.calculationData.settings.taxRates;
        const foreignIncome = calculation.calculationData.grossIncomeTax?.foreignIncome.total ?? 0;
        const foreignIncomeTaxRate = calculation.calculationData.settings.reliefsAndAit.foreignIncomeTaxRate;

        let slabs: Array<GrossIncomeTaxSlab> = [];
        let totalTax = 0;

        if (totalTaxableIncome > 0) {
            const slabLimits = [
                { limit: 500000, rate: taxRates.first, name: "First" },
                { limit: 1000000, rate: taxRates.second, name: "Second" },
                { limit: 1500000, rate: taxRates.third, name: "Third" },
                { limit: 2000000, rate: taxRates.fourth, name: "Fourth" },
                { limit: 2500000, rate: taxRates.fifth, name: "Fifth" },
                { limit: Infinity, rate: taxRates.other, name: "Remaining" },
            ];

            let remainingIncome = totalTaxableIncome;
            let previousLimit = 0;

            for (const slab of slabLimits) {
                if (remainingIncome <= 0) break;

                const slabAmount = Math.min(remainingIncome, slab.limit - previousLimit);
                const slabTax = slabAmount * (slab.rate / 100);

                if (slabAmount > 0) {
                    slabs.push({
                        slab: slab.name,
                        value: slabAmount,
                        rate: slab.rate,
                        tax: slabTax
                    });
                    totalTax += slabTax;
                }

                remainingIncome -= slabAmount;
                previousLimit = slab.limit;
            }
        }

        const foreignIncomeTax = foreignIncome * (foreignIncomeTaxRate / 100);
        totalTax += foreignIncomeTax;

        const grossIncomeTax = {
            total: totalTax,
            foreignIncome: {
                total: foreignIncome,
                tax: foreignIncomeTax
            },
            slabs: slabs
        };

        const updatedCalculation = {
            ...calculation,
            calculationData: {
                ...calculation.calculationData,
                grossIncomeTax
            }
        };
        setCurrentCalculation(updatedCalculation);

        calculateAndUpdateTotalPayableTax(updatedCalculation);
    }, []);

    const calculateAndUpdateTotalPayableTax = useCallback((calculation: Calculation | CalculationReq) => {
        const grossIncomeTax = calculation.calculationData.grossIncomeTax?.total ?? 0;
        const rentalIncome = calculation.calculationData.sourceOfIncome.rentalIncome?.total ?? 0;
        const totalAitInterest = calculation.calculationData.sourceOfIncome.interestIncome?.totalAit ?? 0;
        const totalAppit = calculation.calculationData.sourceOfIncome.employmentIncome?.appitTotal ?? 0;

        const whtRentRate = calculation.calculationData.settings.reliefsAndAit.whtRent;
        const aitRent = (rentalIncome * whtRentRate) / 100;

        const totalPayableTax = grossIncomeTax - aitRent - totalAitInterest - totalAppit;

        const updatedCalculation = {
            ...calculation,
            calculationData: {
                ...calculation.calculationData,
                totalPayableTax
            }
        };
        setCurrentCalculation(updatedCalculation);
    }, []);

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

            calculateAndUpdateTotalTaxableIncome(updatedCalculation);
        }
    }, [currentCalculation, calculateAndUpdateTotalTaxableIncome]);

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

            let finalCalculation = updatedCalculation;

            if (rentalIncome) {
                const rentReliefAmount = (rentalIncome.total * currentCalculation.calculationData.settings.reliefsAndAit.rentRelief) / 100;
                finalCalculation = {
                    ...updatedCalculation,
                    calculationData: {
                        ...updatedCalculation.calculationData,
                        deductionsFromAssessableIncome: {
                            ...updatedCalculation.calculationData.deductionsFromAssessableIncome,
                            rentRelief: rentReliefAmount
                        }
                    }
                };
            } else {
                finalCalculation = {
                    ...updatedCalculation,
                    calculationData: {
                        ...updatedCalculation.calculationData,
                        deductionsFromAssessableIncome: {
                            ...updatedCalculation.calculationData.deductionsFromAssessableIncome,
                            rentRelief: 0
                        }
                    }
                };
            }

            setCurrentCalculation(finalCalculation);

            calculateAndUpdateTotalTaxableIncome(finalCalculation);
        }
    }, [currentCalculation, calculateAndUpdateTotalTaxableIncome]);

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

            calculateAndUpdateTotalTaxableIncome(updatedCalculation);
        }
    }, [currentCalculation, calculateAndUpdateTotalTaxableIncome]);

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

            calculateAndUpdateTotalTaxableIncome(updatedCalculation);
        }
    }, [currentCalculation, calculateAndUpdateTotalTaxableIncome]);

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

            calculateAndUpdateTotalTaxableIncome(updatedCalculation);
        }
    }, [currentCalculation, calculateAndUpdateTotalTaxableIncome]);

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

            calculateAndUpdateTotalTaxableIncome(updatedCalculation);
        }
    }, [currentCalculation, calculateAndUpdateTotalTaxableIncome]);

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

            calculateAndUpdateTotalTaxableIncome(updatedCalculation);
        }
    }, [currentCalculation, calculateAndUpdateTotalTaxableIncome]);

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

            calculateAndUpdateTotalTaxableIncome(updatedCalculation);
        }
    }, [currentCalculation, calculateAndUpdateTotalTaxableIncome]);

    const updateForeignIncome = useCallback((foreignIncome: number) => {
        if (currentCalculation) {
            const updatedCalculation = {
                ...currentCalculation,
                calculationData: {
                    ...currentCalculation.calculationData,
                    grossIncomeTax: {
                        ...currentCalculation.calculationData.grossIncomeTax,
                        foreignIncome: {
                            total: foreignIncome,
                            tax: foreignIncome * (currentCalculation.calculationData.settings.reliefsAndAit.foreignIncomeTaxRate / 100)
                        }
                    }
                }
            };
            setCurrentCalculation(updatedCalculation);

            calculateAndUpdateGrossIncomeTax(updatedCalculation);
        }
    }, [currentCalculation, calculateAndUpdateGrossIncomeTax]);

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
        updateForeignIncome,
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
        updateForeignIncome,
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
