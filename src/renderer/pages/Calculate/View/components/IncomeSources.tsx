import { Calculation } from "../../../../../types/calculation";
import { MdPerson, MdAttachMoney, MdReceipt, MdAccountBalance, MdBusiness, MdTrendingUp } from 'react-icons/md';
import { Grid, Text } from '@radix-ui/themes';
import { useState } from 'react';
import Modal from '../../../../components/Modal';
import IncomeBreakdownModal from './IncomeBreakdownModal';

interface IncomeSourcesProps {
    calculation: Calculation;
}

const IncomeSources = ({ calculation }: IncomeSourcesProps) => {
    const [selectedIncomeType, setSelectedIncomeType] = useState<'employment' | 'rental' | 'interest' | 'dividend' | 'business' | 'other' | null>(null);
    const [selectedIncomeData, setSelectedIncomeData] = useState<any>(null);

    const formatCurrency = (amount: number | string | null | undefined) => {
        if (amount === null || amount === undefined) return 'Rs. 0.00';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `Rs. ${num.toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const handleIncomeClick = (incomeType: 'employment' | 'rental' | 'interest' | 'dividend' | 'business' | 'other', incomeData: any) => {
        setSelectedIncomeType(incomeType);
        setSelectedIncomeData(incomeData);
    };

    const handleCloseModal = () => {
        setSelectedIncomeType(null);
        setSelectedIncomeData(null);
    };

    return (
        <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
                <MdTrendingUp className="text-blue-300 text-2xl" />
                <Text className="text-white text-2xl font-bold">Income Sources</Text>
            </div>

            <Grid columns="3" gap="6">
                {/* Employment Income */}
                {
                    calculation.calculationData.sourceOfIncome?.employmentIncome && (

                        <div
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200 hover:scale-105"
                            onClick={() => handleIncomeClick('employment', calculation.calculationData.sourceOfIncome?.employmentIncome)}
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
                                    <MdPerson className="text-blue-300 text-lg" />
                                </div>
                                <Text className="text-white font-semibold">Employment</Text>
                            </div>
                            <div className="flex flex-col">
                                <Text className="text-2xl font-bold text-blue-300">
                                    {formatCurrency(calculation.calculationData.sourceOfIncome?.employmentIncome?.total)}
                                </Text>
                                <Text className="text-gray-400 text-sm mt-1">
                                    APIT: {formatCurrency(calculation.calculationData.sourceOfIncome?.employmentIncome?.apitTotal)}
                                </Text>
                            </div>
                        </div>
                    )
                }

                {/* Rental Income */}
                {
                    calculation.calculationData.sourceOfIncome?.rentalIncome && (

                        <div
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200 hover:scale-105"
                            onClick={() => handleIncomeClick('rental', calculation.calculationData.sourceOfIncome?.rentalIncome)}
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                                    <MdReceipt className="text-green-300 text-lg" />
                                </div>
                                <Text className="text-white font-semibold">Rental</Text>
                            </div>
                            <Text className="text-2xl font-bold text-green-300">
                                {formatCurrency(calculation.calculationData.sourceOfIncome?.rentalIncome?.total)}
                            </Text>
                        </div>
                    )
                }

                {/* Interest Income */}
                {
                    calculation.calculationData.sourceOfIncome?.interestIncome && (

                        <div
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200 hover:scale-105"
                            onClick={() => handleIncomeClick('interest', calculation.calculationData.sourceOfIncome?.interestIncome)}
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-purple-400/20 rounded-lg flex items-center justify-center">
                                    <MdAccountBalance className="text-purple-300 text-lg" />
                                </div>
                                <Text className="text-white font-semibold">Interest</Text>
                            </div>
                            <div className="flex flex-col">
                                <Text className="text-2xl font-bold text-purple-300">
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

                        <div
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200 hover:scale-105"
                            onClick={() => handleIncomeClick('dividend', calculation.calculationData.sourceOfIncome?.dividendIncome)}
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                                    <MdAttachMoney className="text-yellow-300 text-lg" />
                                </div>
                                <Text className="text-white font-semibold">Dividend</Text>
                            </div>
                            <div className="flex flex-col">
                                <Text className="text-2xl font-bold text-yellow-300">
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

                        <div
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200 hover:scale-105"
                            onClick={() => handleIncomeClick('business', calculation.calculationData.sourceOfIncome?.businessIncome)}
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-red-400/20 rounded-lg flex items-center justify-center">
                                    <MdBusiness className="text-red-300 text-lg" />
                                </div>
                                <Text className="text-white font-semibold">Business</Text>
                            </div>
                            <Text className="text-2xl font-bold text-red-300">
                                {formatCurrency(calculation.calculationData.sourceOfIncome?.businessIncome?.total)}
                            </Text>
                        </div>
                    )
                }

                {/* Other Income */}
                {
                    calculation.calculationData.sourceOfIncome?.otherIncome && (

                        <div
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200 hover:scale-105"
                            onClick={() => handleIncomeClick('other', calculation.calculationData.sourceOfIncome?.otherIncome)}
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-indigo-400/20 rounded-lg flex items-center justify-center">
                                    <MdTrendingUp className="text-indigo-300 text-lg" />
                                </div>
                                <Text className="text-white font-semibold">Other</Text>
                            </div>
                            <Text className="text-2xl font-bold text-indigo-300">
                                {formatCurrency(calculation.calculationData.sourceOfIncome?.otherIncome?.total)}
                            </Text>
                        </div>
                    )
                }
            </Grid>

            {/* Total Assessable Income */}
            <div className="mt-6 bg-blue-400/10 rounded-xl p-6 border border-blue-400/20">
                <div className="flex items-center justify-between">
                    <Text className="text-white text-xl font-semibold">Total Assessable Income</Text>
                    <Text className="text-3xl font-bold text-blue-300">
                        {formatCurrency(calculation.calculationData.sourceOfIncome?.totalAssessableIncome)}
                    </Text>
                </div>
            </div>

            {/* Income Breakdown Modal */}
            <Modal
                isOpen={selectedIncomeType !== null}
                onClose={handleCloseModal}
                title=""
                maxWidth="1000px"
                closeOnOverlayClick={true}
                isDark={true}
            >
                {selectedIncomeType && selectedIncomeData && (
                    <IncomeBreakdownModal
                        incomeType={selectedIncomeType}
                        incomeData={selectedIncomeData}
                        calculation={calculation}
                    />
                )}
            </Modal>
        </div>
    )
}

export default IncomeSources;