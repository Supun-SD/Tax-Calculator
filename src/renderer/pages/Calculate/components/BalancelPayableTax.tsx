import { useState } from 'react';
import { Text, Separator } from '@radix-ui/themes';
import { CalculationService } from '../../../services/calculationService';

const BalancelPayableTax = () => {
    // Dummy state values
    const [quarterlyPayments, setQuarterlyPayments] = useState({
        one: '150000',
        two: '200000',
        three: '180000',
        four: '220000'
    });

    // Dummy calculations
    const totalQuarterlyPayments = Object.values(quarterlyPayments).reduce((sum, payment) => sum + (parseFloat(payment) || 0), 0);
    const totalPayableTax = 810000; // Dummy total payable tax
    const balancePayableTax = totalPayableTax - totalQuarterlyPayments;

    const handleInputChange = (quarter: keyof typeof quarterlyPayments, value: string) => {
        const cleanValue = value.replace(/[^\d.]/g, '');

        const parts = cleanValue.split('.');
        if (parts.length > 2) {
            return;
        }

        if (parts.length === 2 && parts[1].length > 2) {
            return;
        }

        setQuarterlyPayments(prev => ({
            ...prev,
            [quarter]: cleanValue
        }));
    };

    const formatCurrency = (amount: number) => {
        return CalculationService.formatCurrency(amount);
    };

    return (
        <div className="h-full flex flex-col">
            <Text className='text-white pl-3' size="4" weight="bold">Balance payable tax</Text>
            <Separator className="w-full mt-3 bg-surface-2" />
            <div className='text-white bg-surface mt-4 p-8 rounded-2xl flex-1 flex flex-col'>
                <div className="space-y-4 flex-1">
                    {/* 1st QRT */}
                    <div className="flex justify-between items-center">
                        <Text className="text-white">1st QRT</Text>
                        <div className="bg-surface-2 rounded-lg px-4 py-2 min-w-[120px]">
                            <input
                                type="text"
                                value={quarterlyPayments.one}
                                onChange={(e) => handleInputChange('one', e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-white text-right w-full outline-none"
                            />
                        </div>
                    </div>

                    {/* 2nd QRT */}
                    <div className="flex justify-between items-center">
                        <Text className="text-white">2nd QRT</Text>
                        <div className="bg-surface-2 rounded-lg px-4 py-2 min-w-[120px]">
                            <input
                                type="text"
                                value={quarterlyPayments.two}
                                onChange={(e) => handleInputChange('two', e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-white text-right w-full outline-none"
                            />
                        </div>
                    </div>

                    {/* 3rd QRT */}
                    <div className="flex justify-between items-center">
                        <Text className="text-white">3rd QRT</Text>
                        <div className="bg-surface-2 rounded-lg px-4 py-2 min-w-[120px]">
                            <input
                                type="text"
                                value={quarterlyPayments.three}
                                onChange={(e) => handleInputChange('three', e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-white text-right w-full outline-none"
                            />
                        </div>
                    </div>

                    {/* 4th QRT */}
                    <div className="flex justify-between items-center">
                        <Text className="text-white">4th QRT</Text>
                        <div className="bg-surface-2 rounded-lg px-4 py-2 min-w-[120px]">
                            <input
                                type="text"
                                value={quarterlyPayments.four}
                                onChange={(e) => handleInputChange('four', e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-white text-right w-full outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Total */}
                <div className="mt-6 bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <Text className="text-white font-semibold">Balance payable tax</Text>
                        <Text className="text-white font-bold text-lg">
                            Rs. {formatCurrency(balancePayableTax)}
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BalancelPayableTax;
