import { Calculation } from "../../../../../types/calculation";
import { Text, Grid } from '@radix-ui/themes';
import { MdCalculate, MdRemoveCircle, MdAttachMoney } from 'react-icons/md';

interface TaxableIncomeProps {
    calculation: Calculation;
}

const TaxableIncome = ({ calculation }: TaxableIncomeProps) => {
    const formatCurrency = (amount: number | string | null | undefined) => {
        if (amount === null || amount === undefined) return 'Rs. 0.00';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `Rs. ${num.toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const {
        sourceOfIncome,
        deductionsFromAssessableIncome,
        totalTaxableIncome
    } = calculation.calculationData;

    const { totalAssessableIncome } = sourceOfIncome;

    const { personalRelief, rentRelief } = calculation.calculationData.settings.reliefsAndAit;
    const { solarRelief, rentRelief: rentReliefDeduction } = deductionsFromAssessableIncome;

    const rentalIncomeTotal = calculation.calculationData.sourceOfIncome.rentalIncome?.total || 0;


    return (
        <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
                <MdCalculate className="text-green-300 text-2xl" />
                <Text className="text-white text-2xl font-bold">Taxable Income Calculation</Text>
            </div>

            {/* Deductions Section */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                    <MdRemoveCircle className="text-red-300 text-xl" />
                    <Text className="text-white text-xl font-semibold">Deductions</Text>
                </div>

                <Grid columns="3" gap="6">
                    {/* Personal Relief */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-red-400/20 rounded-lg flex items-center justify-center">
                                <MdAttachMoney className="text-red-300 text-lg" />
                            </div>
                            <Text className="text-white font-semibold">Personal Relief</Text>
                        </div>
                        <div className="flex flex-col">
                            <Text className="text-2xl font-bold text-red-300">
                                {formatCurrency(personalRelief)}
                            </Text>
                            <Text className="text-gray-400 text-sm mt-1">
                                Standard personal relief
                            </Text>
                        </div>
                    </div>

                    {/* Rent Relief */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-orange-400/20 rounded-lg flex items-center justify-center">
                                <MdAttachMoney className="text-orange-300 text-lg" />
                            </div>
                            <Text className="text-white font-semibold">Rent Relief</Text>
                        </div>
                        <div className="flex flex-col">
                            <Text className="text-2xl font-bold text-orange-300">
                                {formatCurrency(rentReliefDeduction)}
                            </Text>
                            <Text className="text-gray-400 text-sm mt-1">
                                {rentRelief}% of {formatCurrency(rentalIncomeTotal)}
                            </Text>
                        </div>
                    </div>

                    {/* Solar Relief */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                                <MdAttachMoney className="text-yellow-300 text-lg" />
                            </div>
                            <Text className="text-white font-semibold">Solar Relief</Text>
                        </div>
                        <Text className="text-2xl font-bold text-yellow-300">
                            {formatCurrency(solarRelief)}
                        </Text>
                    </div>
                </Grid>
            </div>

            {/* Calculation Breakdown */}
            <div className="bg-gray-600/20 rounded-xl p-6 border border-gray-500/20 mb-6">
                <Text className="text-white text-lg font-semibold">Calculation Breakdown</Text>
                <div className="space-y-3 mt-5">
                    <div className="flex justify-between items-center">
                        <Text className="text-white">Total Assessable Income</Text>
                        <Text className="text-white font-semibold">{formatCurrency(totalAssessableIncome)}</Text>
                    </div>
                    <div className="flex justify-between items-center text-red-300">
                        <Text>Less: Personal Relief</Text>
                        <Text className="font-semibold">- {formatCurrency(personalRelief)}</Text>
                    </div>
                    {rentReliefDeduction > 0 && (
                        <div className="flex justify-between items-center text-orange-300">
                            <Text>Less: Rent Relief</Text>
                            <Text className="font-semibold">- {formatCurrency(rentReliefDeduction)}</Text>
                        </div>
                    )}
                    {solarRelief > 0 && (
                        <div className="flex justify-between items-center text-yellow-300">
                            <Text>Less: Solar Relief</Text>
                            <Text className="font-semibold">- {formatCurrency(solarRelief)}</Text>
                        </div>
                    )}
                    <div className="border-t border-white/20 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <Text className="text-white text-lg font-semibold">Total Taxable Income</Text>
                            <Text className="text-green-300 text-2xl font-bold">
                                {formatCurrency(totalTaxableIncome)}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Taxable Income */}
            <div className="bg-green-400/10 rounded-xl p-6 border border-green-400/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <MdCalculate className="text-green-300 text-2xl" />
                        <Text className="text-white text-xl font-semibold">Final Taxable Income</Text>
                    </div>
                    <Text className="text-3xl font-bold text-green-300">
                        {formatCurrency(totalTaxableIncome)}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default TaxableIncome;