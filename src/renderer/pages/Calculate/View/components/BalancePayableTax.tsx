import { Calculation } from "../../../../../types/calculation";
import { Text } from '@radix-ui/themes';
import { MdAccountBalance, MdCalendarMonth } from 'react-icons/md';

interface BalancePayableTaxProps {
    calculation: Calculation;
}

const BalancePayableTax = ({ calculation }: BalancePayableTaxProps) => {
    const formatCurrency = (amount: number | string | null | undefined) => {
        if (amount === null || amount === undefined) return 'Rs. 0.00';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `Rs. ${num.toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const { balancePayableTax } = calculation.calculationData;
    const { total, quarterly } = balancePayableTax;

    const quarterlyPayments = [
        { quarter: '1st Quarter', amount: quarterly.one },
        { quarter: '2nd Quarter', amount: quarterly.two },
        { quarter: '3rd Quarter', amount: quarterly.three },
        { quarter: '4th Quarter', amount: quarterly.four }
    ];

    const totalQuarterlyPayments = quarterlyPayments.reduce((sum, q) => sum + q.amount, 0);

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
                <MdAccountBalance className="text-blue-400 text-2xl" />
                <Text className="text-white text-2xl font-bold">Balance Payable Tax</Text>
            </div>

            {/* Quarterly Payments Section */}
            <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                    <MdCalendarMonth className="text-blue-400 text-lg" />
                    <Text className="text-white font-semibold">Quarterly Payments</Text>
                </div>

                <div className="space-y-3">
                    {quarterlyPayments.map((quarter, index) => (
                        <div key={index} className="bg-white/10 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <Text className="text-white font-medium">{quarter.quarter}</Text>
                                <Text className="text-blue-400 font-semibold">
                                    {formatCurrency(quarter.amount)}
                                </Text>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total Quarterly Payments */}
            <div className="bg-white/10 rounded-lg p-4 mb-6 border border-white/20">
                <div className="flex justify-between items-center">
                    <Text className="text-white font-semibold">Total Quarterly Payments</Text>
                    <Text className="text-blue-400 font-bold text-lg">
                        {formatCurrency(totalQuarterlyPayments)}
                    </Text>
                </div>
            </div>

            {/* Final Balance Payable Tax */}
            <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-500/30">
                <div className="flex justify-between items-center">
                    <Text className="text-white text-2xl font-bold">Balance Payable Tax</Text>
                    <Text className={`text-3xl font-bold ${total < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {total < 0 ? `(${formatCurrency(Math.abs(total))})` : formatCurrency(total)}
                    </Text>
                </div>
                {total < 0 && (
                    <Text className="text-red-300 text-sm mt-2">
                        Refund amount
                    </Text>
                )}
                <Text className="text-green-300 text-sm mt-2">
                    Final amount to pay
                </Text>
            </div>
        </div>
    );
};

export default BalancePayableTax;