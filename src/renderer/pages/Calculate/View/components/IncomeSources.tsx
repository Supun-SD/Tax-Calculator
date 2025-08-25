import { Calculation } from "../../../../../types/calculation";
import { MdPerson, MdAttachMoney, MdReceipt, MdAccountBalance, MdBusiness, MdTrendingUp } from 'react-icons/md';
import { Grid, Text } from '@radix-ui/themes';

interface IncomeSourcesProps {
    calculation: Calculation;
}

const IncomeSources = ({ calculation }: IncomeSourcesProps) => {
    const formatCurrency = (amount: number | string | null | undefined) => {
        if (amount === null || amount === undefined) return 'Rs. 0';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `Rs. ${num.toLocaleString()}`;
    };

    return (
        <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
                <MdTrendingUp className="text-blue-400 text-2xl" />
                <Text className="text-white text-2xl font-bold">Income Sources</Text>
            </div>

            <Grid columns="3" gap="6">
                {/* Employment Income */}
                {
                    calculation.calculationData.sourceOfIncome?.employmentIncome && (

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <MdPerson className="text-blue-400 text-lg" />
                                </div>
                                <Text className="text-white font-semibold">Employment</Text>
                            </div>
                            <div className="flex flex-col">
                                <Text className="text-2xl font-bold text-blue-400">
                                    {formatCurrency(calculation.calculationData.sourceOfIncome?.employmentIncome?.total)}
                                </Text>
                                <Text className="text-gray-400 text-sm mt-1">
                                    APPIT: {formatCurrency(calculation.calculationData.sourceOfIncome?.employmentIncome?.appitTotal)}
                                </Text>
                            </div>
                        </div>
                    )
                }

                {/* Rental Income */}
                {
                    calculation.calculationData.sourceOfIncome?.rentalIncome && (

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <MdReceipt className="text-green-400 text-lg" />
                                </div>
                                <Text className="text-white font-semibold">Rental</Text>
                            </div>
                            <Text className="text-2xl font-bold text-green-400">
                                {formatCurrency(calculation.calculationData.sourceOfIncome?.rentalIncome?.total)}
                            </Text>
                        </div>
                    )
                }

                {/* Interest Income */}
                {
                    calculation.calculationData.sourceOfIncome?.interestIncome && (

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <MdAccountBalance className="text-purple-400 text-lg" />
                                </div>
                                <Text className="text-white font-semibold">Interest</Text>
                            </div>
                            <div className="flex flex-col">
                                <Text className="text-2xl font-bold text-purple-400">
                                    {formatCurrency(calculation.calculationData.sourceOfIncome?.interestIncome?.totalGrossInterest)}
                                </Text>
                                <Text className="text-gray-400 text-sm mt-1">
                                    AIT: {formatCurrency(calculation.calculationData.sourceOfIncome?.interestIncome?.totalAit)}
                                </Text>
                            </div>
                        </div>
                    )
                }

                {/* Dividend Income */}
                {
                    calculation.calculationData.sourceOfIncome?.dividendIncome && (

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                    <MdAttachMoney className="text-yellow-400 text-lg" />
                                </div>
                                <Text className="text-white font-semibold">Dividend</Text>
                            </div>
                            <div className="flex flex-col">
                                <Text className="text-2xl font-bold text-yellow-400">
                                    {formatCurrency(calculation.calculationData.sourceOfIncome?.dividendIncome?.totalGrossDividend)}
                                </Text>
                                <Text className="text-gray-400 text-sm mt-1">
                                    AIT: {formatCurrency(calculation.calculationData.sourceOfIncome?.dividendIncome?.totalAit)}
                                </Text>
                            </div>
                        </div>
                    )
                }

                {/* Business Income */}
                {
                    calculation.calculationData.sourceOfIncome?.businessIncome && (

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                    <MdBusiness className="text-red-400 text-lg" />
                                </div>
                                <Text className="text-white font-semibold">Business</Text>
                            </div>
                            <Text className="text-2xl font-bold text-red-400">
                                {formatCurrency(calculation.calculationData.sourceOfIncome?.businessIncome?.total)}
                            </Text>
                        </div>
                    )
                }

                {/* Other Income */}
                {
                    calculation.calculationData.sourceOfIncome?.otherIncome && (

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                    <MdTrendingUp className="text-indigo-400 text-lg" />
                                </div>
                                <Text className="text-white font-semibold">Other</Text>
                            </div>
                            <Text className="text-2xl font-bold text-indigo-400">
                                {formatCurrency(calculation.calculationData.sourceOfIncome?.otherIncome?.total)}
                            </Text>
                        </div>
                    )
                }
            </Grid>

            {/* Total Assessable Income */}
            <div className="mt-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-between">
                    <Text className="text-white text-xl font-semibold">Total Assessable Income</Text>
                    <Text className="text-3xl font-bold text-blue-400">
                        {formatCurrency(calculation.calculationData.sourceOfIncome?.totalAssessableIncome)}
                    </Text>
                </div>
            </div>
        </div>
    )
}

export default IncomeSources;