import { useState, useEffect } from 'react';
import { Text, Separator } from '@radix-ui/themes';
import { useCalculationContext } from '../../../contexts/CalculationContext';
import { useSettingsContext } from '../../../contexts/SettingsContext';

interface TaxSlab {
    slab: string;
    value: number;
    rate: number;
    maxAmount: number;
    tax: number;
}

const GrossIncomeTax = () => {
    const { totalTaxableIncome, setGrossIncomeTax } = useCalculationContext();
    const { settings, loading } = useSettingsContext();

    const [foreignIncome, setForeignIncome] = useState<number>(0);
    const [foreignIncomeInput, setForeignIncomeInput] = useState<string>('');
    const [taxSlabs, setTaxSlabs] = useState<TaxSlab[]>([]);
    const [totalTax, setTotalTax] = useState<number>(0);
    const [foreignIncomeTax, setForeignIncomeTax] = useState<number>(0);

    // Get tax rates from settings
    const getTaxSlabRates = () => {
        if (!settings?.taxRates) return [];

        return [
            { slab: "1st", value: 500000.00, rate: settings.taxRates.first / 100, maxAmount: 500000 },
            { slab: "2nd", value: 500000.00, rate: settings.taxRates.second / 100, maxAmount: 500000 },
            { slab: "3rd", value: 500000.00, rate: settings.taxRates.third / 100, maxAmount: 500000 },
            { slab: "4th", value: 500000.00, rate: settings.taxRates.fourth / 100, maxAmount: 500000 },
            { slab: "5th", value: 500000.00, rate: settings.taxRates.fifth / 100, maxAmount: 500000 },
            { slab: "Remaining", value: 0, rate: settings.taxRates.other / 100, maxAmount: Infinity }
        ];
    };

    const calculateTax = (income: number) => {
        let remainingIncome = income;
        let totalTaxAmount = 0;
        const calculatedSlabs: TaxSlab[] = [];
        const taxSlabRates = getTaxSlabRates();

        taxSlabRates.forEach((slab, index) => {
            let taxableAmount = 0;
            let taxAmount = 0;

            if (remainingIncome > 0) {
                if (slab.maxAmount === Infinity) {
                    // For the remaining amount
                    taxableAmount = remainingIncome;
                    taxAmount = taxableAmount * slab.rate;
                    remainingIncome = 0;
                } else {
                    // For fixed slabs
                    taxableAmount = Math.min(remainingIncome, slab.maxAmount);
                    taxAmount = taxableAmount * slab.rate;
                    remainingIncome -= taxableAmount;
                }

                totalTaxAmount += taxAmount;

                calculatedSlabs.push({
                    slab: slab.slab,
                    value: Math.round(taxableAmount * 100) / 100,
                    rate: slab.rate,
                    maxAmount: slab.maxAmount,
                    tax: Math.round(taxAmount * 100) / 100
                });
            }
        });

        setTaxSlabs(calculatedSlabs);
        setTotalTax(Math.round(totalTaxAmount * 100) / 100);
    };

    const calculateForeignIncomeTax = (income: number) => {
        if (!settings?.reliefsAndAit?.foreignIncomeTaxRate) {
            setForeignIncomeTax(0);
            return;
        }

        const taxRate = settings.reliefsAndAit.foreignIncomeTaxRate / 100;
        const tax = income * taxRate;
        setForeignIncomeTax(Math.round(tax * 100) / 100);
    };

    useEffect(() => {
        if (settings && !loading) {
            calculateTax(totalTaxableIncome);
        }
    }, [totalTaxableIncome, settings, loading]);

    useEffect(() => {
        if (settings && !loading) {
            calculateForeignIncomeTax(foreignIncome);
        }
    }, [foreignIncome, settings, loading]);

    // Update context with gross income tax data whenever it changes
    useEffect(() => {
        if (settings && !loading) {
            setGrossIncomeTax({
                total: totalTax + foreignIncomeTax,
                foreignIncome: {
                    total: foreignIncome,
                    rate: settings?.reliefsAndAit?.foreignIncomeTaxRate || 0,
                    tax: foreignIncomeTax
                },
                slabs: taxSlabs.map(slab => ({
                    slab: slab.slab,
                    value: slab.value,
                    rate: slab.rate,
                    tax: slab.tax
                }))
            });
        }
    }, [totalTax, foreignIncomeTax, foreignIncome, taxSlabs, settings, loading, setGrossIncomeTax]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatPercentage = (rate: number) => {
        return `${Math.round(rate * 100)}%`;
    };

    const handleForeignIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setForeignIncomeInput(value);
            setForeignIncome(value === '' ? 0 : parseFloat(value) || 0);
        }
    };

    // Show loading state while settings are loading
    if (loading) {
        return (
            <div className="h-full flex flex-col">
                <Text className='text-white pl-3' size="4" weight="bold">Gross income tax</Text>
                <Separator className="w-full mt-3 bg-surface-2" />
                <div className='text-white bg-surface mt-4 p-8 rounded-2xl flex-1 flex items-center justify-center'>
                    <Text className="text-gray-400">Loading tax rates...</Text>
                </div>
            </div>
        );
    }

    // Show error state if settings failed to load
    if (!settings) {
        return (
            <div className="h-full flex flex-col">
                <Text className='text-white pl-3' size="4" weight="bold">Gross income tax</Text>
                <Separator className="w-full mt-3 bg-surface-2" />
                <div className='text-white bg-surface mt-4 p-8 rounded-2xl flex-1 flex items-center justify-center'>
                    <Text className="text-red-400">Failed to load tax settings</Text>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <Text className='text-white pl-3' size="4" weight="bold">Gross income tax</Text>
            <Separator className="w-full mt-3 bg-surface-2" />
            <div className='text-white bg-surface mt-4 p-8 rounded-2xl flex-1 flex flex-col'>
                {/* Message when total taxable income is 0 */}
                {totalTaxableIncome === 0 && (
                    <div className="mb-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                        <Text className="text-blue-300 text-center">
                            No taxable income available. Please add income sources to calculate gross income tax.
                        </Text>
                    </div>
                )}

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
                            {taxSlabs.map((slab, index) => (
                                <tr key={index} className="border-b border-gray-700">
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
                                            value={foreignIncomeInput}
                                            onChange={handleForeignIncomeChange}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                            inputMode="decimal"
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-gray-300">
                                        {settings?.reliefsAndAit?.foreignIncomeTaxRate ? `${settings.reliefsAndAit.foreignIncomeTaxRate}%` : 'N/A'}
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
                            {formatCurrency(totalTax + foreignIncomeTax)}
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrossIncomeTax;
