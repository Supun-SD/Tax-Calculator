import { Calculation } from "../../../../../types/calculation";
import { Text } from '@radix-ui/themes';
import { MdReceipt, MdRemove } from 'react-icons/md';

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

    const { grossIncomeTax, totalPayableTax, sourceOfIncome } = calculation.calculationData;
    const { total: grossIncomeTaxTotal } = grossIncomeTax;
    const { rentalIncome, interestIncome, employmentIncome } = sourceOfIncome;
    const { whtRent } = calculation.calculationData.settings.reliefsAndAit;

    const aitRent = rentalIncome ? (rentalIncome.total * whtRent) / 100 : 0.00;
    const aitInterestTotal = interestIncome.totalAit;
    const appitTotal = employmentIncome.appitTotal;

    const totalDeductions = aitRent + aitInterestTotal + appitTotal;

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
                <MdReceipt className="text-blue-400 text-2xl" />
                <Text className="text-white text-2xl font-bold">Total Payable Tax</Text>
            </div>

            {/* Gross Income Tax */}
            <div className="bg-white/10 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                    <Text className="text-white font-semibold">Gross Income Tax</Text>
                    <Text className="text-blue-400 font-bold text-lg">
                        {formatCurrency(grossIncomeTaxTotal)}
                    </Text>
                </div>
            </div>

            {/* Deductions Section */}
            <div className="mb-6">
                <Text className="text-white font-semibold mb-3 block">Deductions</Text>
                <div className="space-y-3">
                    {aitRent > 0 && (
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <MdRemove className="text-red-400" />
                                <Text className="text-white">AIT - Rent ({whtRent}%)</Text>
                            </div>
                            <Text className="text-red-400 font-semibold">
                                -{formatCurrency(aitRent)}
                            </Text>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <MdRemove className="text-red-400" />
                            <Text className="text-white">AIT - Interest</Text>
                        </div>
                        <Text className="text-red-400 font-semibold">
                            -{formatCurrency(aitInterestTotal)}
                        </Text>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <MdRemove className="text-red-400" />
                            <Text className="text-white">APPIT Total</Text>
                        </div>
                        <Text className="text-red-400 font-semibold">
                            -{formatCurrency(appitTotal)}
                        </Text>
                    </div>
                </div>
            </div>

            {/* Total Deductions */}
            <div className="bg-white/10 rounded-lg p-4 mb-6 border border-white/20">
                <div className="flex justify-between items-center">
                    <Text className="text-white font-semibold">Total Deductions</Text>
                    <Text className="text-red-400 font-bold text-lg">
                        -{formatCurrency(totalDeductions)}
                    </Text>
                </div>
            </div>

            {/* Final Total Payable Tax */}
            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl p-5 border border-blue-500/30">
                <div className="flex justify-between items-center">
                    <Text className="text-white text-xl font-bold">Total Payable Tax</Text>
                    <Text className="text-blue-400 text-2xl font-bold">
                        {formatCurrency(totalPayableTax)}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default TotalPayableTax;