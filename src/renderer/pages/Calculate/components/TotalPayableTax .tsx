import React, { useState, useEffect } from 'react';
import { Text, Separator } from '@radix-ui/themes';

interface TaxComponent {
    name: string;
    percentage: number;
    amount: number;
    isHighlighted?: boolean;
}

const TotalPayableTax = () => {
    const [taxComponents, setTaxComponents] = useState<TaxComponent[]>([
        { name: "AIT - Rent", percentage: 5, amount: 450000.00 },
        { name: "AIT - Interest", percentage: 5, amount: 450000.00 },
        { name: "APPIT", percentage: 5, amount: 450000.00 }
    ]);

    const [deduction, setDeduction] = useState<number>(450000.00);
    const [balancePayable, setBalancePayable] = useState<number>(1950000.00);

    useEffect(() => {
        const totalComponents = taxComponents.reduce((sum, component) => sum + component.amount, 0);
        const finalBalance = totalComponents - deduction;
        setBalancePayable(finalBalance);
    }, [taxComponents, deduction]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatPercentage = (percentage: number) => {
        return `${percentage}%`;
    };

    return (
        <div className="h-full flex flex-col">
            <Text className='text-white pl-3' size="4" weight="bold">Total payable tax</Text>
            <Separator className="w-full mt-3 bg-surface-2" />
            <div className='text-white bg-surface mt-4 p-8 rounded-2xl flex-1 flex flex-col'>
                {/* Tax Components Table */}
                <div className="flex-1">
                    <div className="space-y-3">
                        {taxComponents.map((component, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center py-2"
                            >
                                <Text className="text-white flex-1">{component.name}</Text>
                                {component.name === "APPIT" ? (
                                    <div></div>
                                ) : (
                                    <Text className="text-white text-center flex-1">{formatPercentage(component.percentage)}</Text>
                                )}
                                <Text className="text-white text-right flex-1">{formatCurrency(component.amount)}</Text>
                            </div>
                        ))}
                    </div>

                    {/* Deduction */}
                    <div className="mt-4 flex justify-end">
                        <Text className="text-white text-right">
                            ({formatCurrency(deduction)})
                        </Text>
                    </div>
                </div>

                {/* Balance Payable Tax */}
                <div className="mt-6 bg-gray-600/30 border-2 border-green-500 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <Text className="text-white font-semibold">Total payable tax</Text>
                        <Text className="text-white font-bold text-lg">
                            {formatCurrency(balancePayable)}
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalPayableTax;
