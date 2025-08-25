import { Calculation } from "../../../../../types/calculation";
import { Text } from '@radix-ui/themes';
import { MdCalculate, MdPublic, MdTrendingUp } from 'react-icons/md';

interface GrossIncomeTaxProps {
    calculation: Calculation;
}

const GrossIncomeTax = ({ calculation }: GrossIncomeTaxProps) => {
    const formatCurrency = (amount: number | string | null | undefined) => {
        if (amount === null || amount === undefined) return 'Rs. 0.00';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `Rs. ${num.toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const { grossIncomeTax } = calculation.calculationData;
    const { total, foreignIncome, slabs } = grossIncomeTax;

    return (
        <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
                <MdCalculate className="text-purple-400 text-2xl" />
                <Text className="text-white text-2xl font-bold">Gross Income Tax Calculation</Text>
            </div>

            {/* Tax Slabs Section */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                    <MdTrendingUp className="text-green-400 text-xl" />
                    <Text className="text-white text-xl font-semibold">Tax Slabs Breakdown</Text>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
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
                                <div className="inline-flex items-center px-2 py-1 bg-green-500/20 rounded text-green-400 font-bold text-xs">
                                    {slab.rate}%
                                </div>
                            </div>
                            <div className="p-3">
                                <Text className="text-white text-sm">{formatCurrency(slab.value)}</Text>
                            </div>
                            <div className="p-3">
                                <Text className="text-green-400 font-bold text-sm">{formatCurrency(slab.tax)}</Text>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Foreign Income Tax Section */}
            {foreignIncome.total > 0 && (
                <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <MdPublic className="text-orange-400 text-xl" />
                        <Text className="text-white text-xl font-semibold">Foreign Income Tax</Text>
                    </div>

                    <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <Text className="text-white font-semibold">Foreign Income</Text>
                                <Text className="text-xl font-bold text-gray-300 ml-4">
                                    {formatCurrency(foreignIncome.total)}
                                </Text>
                            </div>
                            <div>
                                <Text className="text-white font-semibold">Foreign Income Tax</Text>
                                <Text className="text-xl font-bold text-gray-300 ml-4">
                                    {formatCurrency(foreignIncome.tax)}
                                </Text>
                                <Text className="text-gray-400 text-sm ml-4">
                                    Rate: {calculation.calculationData.settings.reliefsAndAit.foreignIncomeTaxRate}%
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Calculation Summary */}
            <div className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-xl p-6 border border-gray-500/30 mb-6">
                <Text className="text-white text-lg font-semibold">Tax Calculation Summary</Text>
                <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                        <Text className="text-white">Domestic Income Tax</Text>
                        <Text className="text-white font-semibold">
                            {formatCurrency(slabs.reduce((sum, slab) => sum + slab.tax, 0))}
                        </Text>
                    </div>
                    {foreignIncome.total > 0 && (
                        <div className="flex justify-between items-center">
                            <Text className="text-white">Foreign Income Tax</Text>
                            <Text className="text-white font-semibold">
                                {formatCurrency(foreignIncome.tax)}
                            </Text>
                        </div>
                    )}
                    <div className="border-t border-white/20 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <Text className="text-white text-lg font-semibold">Total Gross Income Tax</Text>
                            <Text className="text-purple-400 text-2xl font-bold">
                                {formatCurrency(total)}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Gross Income Tax */}
            <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <MdCalculate className="text-purple-400 text-2xl" />
                        <Text className="text-white text-xl font-semibold">Total Gross Income Tax</Text>
                    </div>
                    <Text className="text-3xl font-bold text-purple-400">
                        {formatCurrency(total)}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default GrossIncomeTax;