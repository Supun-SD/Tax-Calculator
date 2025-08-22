import { useState, useEffect } from 'react';
import { Text, Separator } from '@radix-ui/themes';

interface TaxSlab {
    slab: string;
    value: number;
    rate: number;
    maxAmount: number;
    tax: number;
}

const GrossIncomeTax = () => {
    const [taxableIncome, setTaxableIncome] = useState<number>(2850000);
    const [taxSlabs, setTaxSlabs] = useState<TaxSlab[]>([]);
    const [totalTax, setTotalTax] = useState<number>(0);

    // Define tax slabs based on the image
    const taxSlabRates = [
        { slab: "1st", value: 500000.00, rate: 0.06, maxAmount: 500000 },
        { slab: "2nd", value: 500000.00, rate: 0.12, maxAmount: 500000 },
        { slab: "3rd", value: 500000.00, rate: 0.18, maxAmount: 500000 },
        { slab: "4th", value: 500000.00, rate: 0.24, maxAmount: 500000 },
        { slab: "5th", value: 500000.00, rate: 0.30, maxAmount: 500000 },
        { slab: "Remaining", value: 254000.00, rate: 0.36, maxAmount: Infinity }
    ];

    const calculateTax = (income: number) => {
        let remainingIncome = income;
        let totalTaxAmount = 0;
        const calculatedSlabs: TaxSlab[] = [];

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
                    value: slab.value,
                    rate: slab.rate,
                    maxAmount: slab.maxAmount,
                    tax: taxAmount
                });
            }
        });

        setTaxSlabs(calculatedSlabs);
        setTotalTax(totalTaxAmount);
    };

    useEffect(() => {
        calculateTax(taxableIncome);
    }, [taxableIncome]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatPercentage = (rate: number) => {
        return `${(rate * 100).toFixed(0)}%`;
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
                            {taxSlabs.map((slab, index) => (
                                <tr key={index} className="border-b border-gray-700">
                                    <td className="py-3 px-4">{slab.slab}</td>
                                    <td className="py-3 px-4">{slab.value.toFixed(2)}</td>
                                    <td className="py-3 px-4">{formatPercentage(slab.rate)}</td>
                                    <td className="py-3 px-4 text-right">{formatCurrency(slab.tax)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Total Payable Amount */}
                <div className="mt-6 bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <Text className="text-white font-semibold">Gross income tax payable</Text>
                        <Text className="text-white font-bold text-lg">
                            {formatCurrency(totalTax)}
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrossIncomeTax;
