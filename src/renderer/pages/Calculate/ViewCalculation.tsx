import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { Flex, Grid, Separator, Text } from '@radix-ui/themes';
import { Account } from '../../../types/account';
import Button from '../../components/Button';
import { ClipLoader } from 'react-spinners';
import { useCalculations } from '../../hooks/useCalculations';
import { Calculation } from '../../../types/calculation';
import { Status } from '../../../types/enums/status';
import { MdArrowBack, MdPerson, MdCalendarToday, MdAttachMoney, MdReceipt, MdAccountBalance, MdBusiness, MdTrendingUp, MdEdit, MdPrint } from 'react-icons/md';

const ViewCalculation = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const calculationId = id ? parseInt(id) : null;

    const [calculation, setCalculation] = useState<Calculation | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [assessmentPeriod, setAssessmentPeriod] = useState<{ start: string, end: string } | null>(null);

    const { getCalculationById, loading } = useCalculations();

    useEffect(() => {
        const fetchCalculation = async () => {
            if (!calculationId) {
                navigate('/history');
                return;
            }

            const fetchedCalculation = await getCalculationById(calculationId);
            if (fetchedCalculation) {
                setCalculation(fetchedCalculation);
                setSelectedAccount(fetchedCalculation.account);

                if (fetchedCalculation.year) {
                    const [start, end] = fetchedCalculation.year.split('/');
                    setAssessmentPeriod({ start, end });
                }
            } else {
                navigate('/history');
            }
        };

        fetchCalculation();
    }, [calculationId, getCalculationById, navigate]);

    const handleBack = () => {
        navigate('/history');
    };

    const handleEdit = () => {
        navigate('/calculate', {
            state: {
                isEditing: true,
                calculationId: calculationId
            }
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const getStatusColor = (status: Status) => {
        switch (status) {
            case Status.DRAFT:
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case Status.SUBMITTED:
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const formatCurrency = (amount: number | string | null | undefined) => {
        if (amount === null || amount === undefined) return 'Rs. 0';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `Rs. ${num.toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="p-8">
                <Navigation title="View Calculation" />
                <div className="flex justify-center items-center h-96">
                    <ClipLoader color="#4A90E2" size={40} />
                </div>
            </div>
        );
    }

    if (!calculation) {
        return (
            <div className="p-8">
                <Navigation title="View Calculation" />
                <div className="flex justify-center items-center h-96">
                    <Text className="text-white text-xl">Calculation not found</Text>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <Navigation title="View Calculation" />
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Account Information Card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <MdPerson className="text-white text-2xl" />
                                </div>
                                <div className="flex flex-col">
                                    <Text className="text-white text-2xl font-bold">
                                        {selectedAccount?.title} {selectedAccount?.name}
                                    </Text>
                                    <Text className="text-gray-400 text-lg">
                                        TIN: {selectedAccount?.tinNumber}
                                    </Text>
                                </div>
                            </div>
                            <Separator
                                orientation="vertical"
                                className="mx-6 h-12 bg-popup-title-bg"
                            />
                            <div className="flex items-center space-x-4 text-gray-400">
                                <MdCalendarToday className="text-2xl" />
                                <Text className="text-white text-xl font-medium">
                                    {assessmentPeriod ? `${assessmentPeriod.start}/${assessmentPeriod.end}` : '2024/2025'}
                                </Text>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    icon={MdEdit}
                                    onClick={handleEdit}
                                >
                                    Edit Calculation
                                </Button>
                                <Button
                                    variant="secondary"
                                    icon={MdPrint}
                                    onClick={handlePrint}
                                >
                                    Print
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Income Sources Section */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <MdTrendingUp className="text-blue-400 text-2xl" />
                        <Text className="text-white text-2xl font-bold">Income Sources</Text>
                    </div>

                    <Grid columns="3" gap="6">
                        {/* Employment Income */}
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

                        {/* Rental Income */}
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

                        {/* Interest Income */}
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

                        {/* Dividend Income */}
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
                        {/* Business Income */}
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

                        {/* Other Income */}
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

                {/* Metadata */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <Text className="text-gray-400 text-sm mb-1">Created</Text>
                            <Text className="text-white">
                                {new Date(calculation.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Text>
                        </div>
                        <div>
                            <Text className="text-gray-400 text-sm mb-1">Last Updated</Text>
                            <Text className="text-white">
                                {new Date(calculation.updatedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCalculation;
