import { Calculation } from "../../../../../types/calculation";
import { Text } from '@radix-ui/themes';
import { MdCalculate, MdRemoveCircle } from 'react-icons/md';

interface TotalPayableTaxProps {
    calculation: Calculation;
}

const TotalPayableTax = ({ calculation }: TotalPayableTaxProps) => {
    const formatCurrency = (amount: number | string | null | undefined) => {
        if (amount === null || amount === undefined) return 'Rs. 0.00';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `Rs. ${num.toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const { totalPayableTax, grossIncomeTax, sourceOfIncome } = calculation.calculationData;
    const { total: grossIncomeTaxTotal } = grossIncomeTax;
    const { rentalIncome, interestIncome, employmentIncome } = sourceOfIncome;
    const { whtRent } = calculation.calculationData.settings.reliefsAndAit;

    const aitRent = rentalIncome ? (rentalIncome.total * whtRent) / 100 : 0.00;
    const aitInterestTotal = interestIncome.totalAit;
    const appitTotal = employmentIncome.appitTotal;

    const totalDeductions = aitRent + aitInterestTotal + appitTotal;

    return (
        <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
                <MdCalculate className="text-blue-300 text-2xl" />
                <Text className="text-white text-2xl font-bold">Total Payable Tax</Text>
            </div>

            {/* Tax Deductions Section */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                    <MdRemoveCircle className="text-red-300 text-xl" />
                    <Text className="text-white text-xl font-semibold">Tax Deductions</Text>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                    <div className="grid grid-cols-2 gap-0">
                        <div className="bg-white/10 p-3 px-6">
                            <Text className="text-white font-semibold text-sm">Tax Type</Text>
                        </div>
                        <div className="bg-white/10 p-3">
                            <Text className="text-white font-semibold text-sm">Amount</Text>
                        </div>
                    </div>

                    {aitRent > 0 && (
                        <div className="grid grid-cols-2 gap-0 border-b border-white/10">
                            <div className="p-3">
                                <Text className="text-white text-sm">AIT - Rent ({whtRent}%)</Text>
                            </div>
                            <div className="p-3">
                                <Text className="text-red-300 font-bold text-sm">
                                    ({formatCurrency(aitRent)})
                                </Text>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-0 border-b border-white/10">
                        <div className="p-3">
                            <Text className="text-white text-sm">AIT - Interest</Text>
                        </div>
                        <div className="p-3">
                            <Text className="text-red-300 font-bold text-sm">
                                ({formatCurrency(aitInterestTotal)})
                            </Text>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-0">
                        <div className="p-3">
                            <Text className="text-white text-sm">APPIT Total</Text>
                        </div>
                        <div className="p-3">
                            <Text className="text-red-300 font-bold text-sm">
                                ({formatCurrency(appitTotal)})
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calculation Summary */}
            <div className="bg-gray-600/20 rounded-xl p-6 border border-gray-500/20 mb-6">
                <Text className="text-white text-lg font-semibold">Tax Calculation Summary</Text>
                <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                        <Text className="text-white">Gross Income Tax</Text>
                        <Text className="text-white font-semibold">
                            {formatCurrency(grossIncomeTaxTotal)}
                        </Text>
                    </div>
                    {totalDeductions > 0 && (
                        <div className="flex justify-between items-center text-red-300">
                            <Text>Less: Total Deductions</Text>
                            <Text className="font-semibold">- {formatCurrency(totalDeductions)}</Text>
                        </div>
                    )}
                    <div className="border-t border-white/20 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <Text className="text-white text-lg font-semibold">Total Payable Tax</Text>
                            <Text className="text-blue-300 text-2xl font-bold">
                                {formatCurrency(totalPayableTax)}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Total Payable Tax */}
            <div className="bg-blue-400/10 rounded-xl p-6 border border-blue-400/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <MdCalculate className="text-blue-300 text-2xl" />
                        <Text className="text-white text-xl font-semibold">Final Total Payable Tax</Text>
                    </div>
                    <Text className="text-3xl font-bold text-blue-300">
                        {formatCurrency(totalPayableTax)}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default TotalPayableTax;