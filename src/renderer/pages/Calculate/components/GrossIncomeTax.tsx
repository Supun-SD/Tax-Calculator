import { useState, useEffect } from 'react';
import { Text, Separator } from '@radix-ui/themes';
import { CalculationService } from '../../../services/calculationService';
import { useCalculationContext } from '../../../contexts/CalculationContext';
import { GrossIncomeTaxSlab } from '../../../../types/calculation';

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
        <div className="h-full flex flex-col">
            <Text className='text-white pl-3' size="4" weight="bold">Gross income tax</Text>
            <Separator className="w-full mt-3 bg-surface-2" />
            <div className='text-white bg-surface mt-4 p-8 rounded-2xl flex-1 flex flex-col'>
                {/* Tax Slabs Table */}
                <div className="overflow-x-auto flex-1">
                    {totalTaxableIncome > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-600">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-300">Slab</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-300">Value</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-300">Rate</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-300">Tax</th>
                                </tr>
                            </thead>
                            <tbody>
                                {slabs.map((slab) => (
                                    <tr key={slab.slab} className="border-b border-gray-700">
                                        <td className="py-3 px-4">{slab.slab}</td>
                                        <td className="py-3 px-4">{formatCurrency(slab.value)}</td>
                                        <td className="py-3 px-4">{slab.rate}%</td>
                                        <td className="py-3 px-4 text-right">{formatCurrency(slab.tax)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="">
                            <div className="bg-blue-400/20 border border-primary rounded-lg overflow-hidden p-5">
                                <Text className="text-gray-300 text-md mb-2">Please add source of incomes to calculate gross income tax</Text>
                            </div>
                        </div>
                    )}
                </div>

                {/* Foreign Income Section */}
                <div className="mt-6">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-600">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-300">Foreign Income</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-300">Rate</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-300">Tax</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-700">
                                    <td className="py-3 px-4">
                                        <input
                                            type="text"
                                            value={foreignIncomeInput}
                                            onChange={(e) => handleForeignIncomeChange(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                            inputMode="decimal"
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-gray-300">
                                        {currentCalculation?.calculationData?.settings?.reliefsAndAit?.foreignIncomeTaxRate ?? 0}%
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-300">
                                        {formatCurrency(foreignIncomeTax)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Total Payable Amount */}
                <div className="mt-6 bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <Text className="text-white font-semibold">Gross income tax payable</Text>
                        <Text className="text-white font-bold text-lg">
                            {formatCurrency(totalGrossIncomeTax)}
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrossIncomeTax;
