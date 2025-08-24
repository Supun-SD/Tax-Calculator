import { useState } from 'react';
import { Text, Separator } from '@radix-ui/themes';
import { CalculationService } from '../../../services/calculationService';

const GrossIncomeTax = () => {
    // Dummy state values
    const [foreignIncome, setForeignIncome] = useState<string>('100000');

    // Dummy tax slabs data
    const dummyTaxSlabs = [
        { slab: "1st", value: 500000, rate: 0.06, tax: 30000 },
        { slab: "2nd", value: 500000, rate: 0.12, tax: 60000 },
        { slab: "3rd", value: 500000, rate: 0.18, tax: 90000 },
        { slab: "4th", value: 500000, rate: 0.24, tax: 120000 },
        { slab: "5th", value: 500000, rate: 0.30, tax: 150000 },
        { slab: "Remaining", value: 1000000, rate: 0.36, tax: 360000 }
    ];

    // Dummy calculations
    const totalTax = dummyTaxSlabs.reduce((sum, slab) => sum + slab.tax, 0);
    const foreignIncomeTax = 15000; // Dummy foreign income tax
    const totalGrossIncomeTax = totalTax + foreignIncomeTax;

    const formatCurrency = (amount: number) => {
        return CalculationService.formatCurrency(amount);
    };

    const formatPercentage = (rate: number) => {
        return `${Math.round(rate * 100)}%`;
    };

    const handleForeignIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setForeignIncome(value);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <Text className='text-white pl-3' size="4" weight="bold">Gross income tax</Text>
            <Separator className="w-full mt-3 bg-surface-2" />
            <div className='text-white bg-surface mt-4 p-8 rounded-2xl flex-1 flex flex-col'>
                {/* Tax Slabs Table */}
                <div className="overflow-x-auto flex-1">
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
                            {dummyTaxSlabs.map((slab) => (
                                <tr key={slab.slab} className="border-b border-gray-700">
                                    <td className="py-3 px-4">{slab.slab}</td>
                                    <td className="py-3 px-4">{formatCurrency(slab.value)}</td>
                                    <td className="py-3 px-4">{formatPercentage(slab.rate)}</td>
                                    <td className="py-3 px-4 text-right">{formatCurrency(slab.tax)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                                            value={foreignIncome}
                                            onChange={handleForeignIncomeChange}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                            inputMode="decimal"
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-gray-300">15%</td>
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
