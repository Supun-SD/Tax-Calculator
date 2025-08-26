import { useState, useEffect } from 'react';
import { Text, Separator } from '@radix-ui/themes';
import { MdCalculate, MdPublic, MdTrendingUp } from 'react-icons/md';
import { CalculationService } from '../../../../services/calculationService';
import { useCalculationContext } from '../../../../contexts/CalculationContext';
import { GrossIncomeTaxSlab } from '../../../../../types/calculation';

const GrossIncomeTax = () => {
    const { currentCalculation, updateForeignIncome } = useCalculationContext();

    const [foreignIncomeInput, setForeignIncomeInput] = useState<string>('');

    const totalTaxableIncome: number = currentCalculation?.calculationData?.totalTaxableIncome ?? 0;
    const foreignIncome: number = currentCalculation?.calculationData?.grossIncomeTax?.foreignIncome.total ?? 0;
    const foreignIncomeTax: number = currentCalculation?.calculationData?.grossIncomeTax?.foreignIncome.tax ?? 0;
    const totalGrossIncomeTax: number = currentCalculation?.calculationData?.grossIncomeTax?.total ?? 0;
    const slabs: Array<GrossIncomeTaxSlab> = currentCalculation?.calculationData?.grossIncomeTax?.slabs ?? [];

    useEffect(() => {
        setForeignIncomeInput(foreignIncome.toString());
    }, [foreignIncome]);

    const formatCurrency = (amount: number) => {
        return CalculationService.formatCurrency(amount);
    };

    const handleForeignIncomeChange = (value: string) => {
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setForeignIncomeInput(value);
            const numericValue = parseFloat(value) || 0;
            updateForeignIncome(numericValue);
        }
    };

    return (
        <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
                <MdCalculate className="text-purple-300 text-2xl" />
                <Text className="text-white text-2xl font-bold">Gross Income Tax Calculation</Text>
            </div>

            {/* Tax Slabs Section */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                    <MdTrendingUp className="text-green-300 text-xl" />
                    <Text className="text-white text-xl font-semibold">Tax Slabs Breakdown</Text>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                    {totalTaxableIncome > 0 ? (
                        <>
                            <div className="grid grid-cols-4 gap-0">
                                <div className="bg-white/10 p-3 px-6">
                                    <Text className="text-white font-semibold text-sm">Slab</Text>
                                </div>
                                <div className="bg-white/10 p-3">
                                    <Text className="text-white font-semibold text-sm">Rate</Text>
                                </div>
                                <div className="bg-white/10 p-3">
                                    <Text className="text-white font-semibold text-sm">Amount</Text>
                                </div>
                                <div className="bg-white/10 p-3">
                                    <Text className="text-white font-semibold text-sm">Tax</Text>
                                </div>
                            </div>
                            {slabs.map((slab, index) => (
                                <div key={index} className={`grid grid-cols-4 gap-0 hover:bg-white/5 transition-all duration-200 ${index !== slabs.length - 1 ? 'border-b border-white/10' : ''}`}>
                                    <div className="p-3">
                                        <Text className="text-white font-medium text-sm px-3">{slab.slab}</Text>
                                    </div>
                                    <div className="p-3">
                                        <div className="inline-flex items-center px-2 py-1 bg-green-400/20 rounded text-green-300 font-bold text-xs">
                                            {slab.rate}%
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <Text className="text-white text-sm">{formatCurrency(slab.value)}</Text>
                                    </div>
                                    <div className="p-3">
                                        <Text className="text-green-300 font-bold text-sm">{formatCurrency(slab.tax)}</Text>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="p-6">
                            <div className="bg-blue-400/20 border border-primary rounded-lg overflow-hidden p-5">
                                <Text className="text-gray-300 text-md mb-2">Please add source of incomes to calculate gross income tax</Text>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Foreign Income Tax Section */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                    <MdPublic className="text-orange-300 text-xl" />
                    <Text className="text-white text-xl font-semibold">Foreign Income Tax</Text>
                </div>

                <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <Text className="text-white font-semibold">Foreign Income</Text>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    value={foreignIncomeInput}
                                    onChange={(e) => handleForeignIncomeChange(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <Text className="text-white font-semibold">Foreign Income Tax</Text>
                                <Text className="text-gray-400 text-sm ml-4">
                                    Rate: {currentCalculation?.calculationData?.settings?.reliefsAndAit?.foreignIncomeTaxRate}%
                                </Text>
                            </div>
                            <div className='bg-white/10 rounded-lg p-2 mt-2'>
                                <Text className="text-xl font-bold text-gray-300 p-2">
                                    {formatCurrency(foreignIncomeTax)}
                                </Text>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Calculation Summary */}
            <div className="bg-gray-600/20 rounded-xl p-6 border border-gray-500/20 mb-6">
                <Text className="text-white text-lg font-semibold">Tax Calculation Summary</Text>
                <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                        <Text className="text-white">Domestic Income Tax</Text>
                        <Text className="text-white font-semibold">
                            {formatCurrency(slabs.reduce((sum, slab) => sum + slab.tax, 0))}
                        </Text>
                    </div>
                    {foreignIncome > 0 && (
                        <div className="flex justify-between items-center">
                            <Text className="text-white">Foreign Income Tax</Text>
                            <Text className="text-white font-semibold">
                                {formatCurrency(foreignIncomeTax)}
                            </Text>
                        </div>
                    )}
                    <div className="border-t border-white/20 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <Text className="text-white text-lg font-semibold">Total Gross Income Tax</Text>
                            <Text className="text-purple-300 text-2xl font-bold">
                                {formatCurrency(totalGrossIncomeTax)}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Gross Income Tax */}
            <div className="bg-purple-400/10 rounded-xl p-6 border border-purple-400/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <MdCalculate className="text-purple-300 text-2xl" />
                        <Text className="text-white text-xl font-semibold">Total Gross Income Tax</Text>
                    </div>
                    <Text className="text-3xl font-bold text-purple-300">
                        {formatCurrency(totalGrossIncomeTax)}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default GrossIncomeTax;
