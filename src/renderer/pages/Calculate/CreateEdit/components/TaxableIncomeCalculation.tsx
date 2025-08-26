import { useState, useEffect } from 'react';
import { Text, Separator, Flex, IconButton, Tooltip, Button } from '@radix-ui/themes';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoRefresh } from "react-icons/io5";
import { MdCalculate, MdRemoveCircle, MdAttachMoney } from 'react-icons/md';
import { CalculationService } from '../../../../services/calculationService';
import { useCalculationContext } from '../../../../contexts/CalculationContext';

const TaxableIncomeCalculation = () => {

    const { currentCalculation, recalculateTotalAssessableIncome, updateSolarRelief } = useCalculationContext();

    const [solarRelief, setSolarRelief] = useState<string>('');

    useEffect(() => {
        const currentSolarRelief = currentCalculation?.calculationData?.deductionsFromAssessableIncome?.solarRelief ?? '';
        if (currentSolarRelief === 0) {
            setSolarRelief('');
        } else {
            setSolarRelief(currentSolarRelief.toString());
        }
    }, [currentCalculation?.calculationData?.deductionsFromAssessableIncome?.solarRelief]);

    const handleSolarReliefChange = (value: string) => {
        if (value.match(/^\d*\.?\d{0,2}$/)) {
            setSolarRelief(value);
            const numericValue = parseFloat(value) || 0;
            updateSolarRelief(numericValue);
        }
    };

    const employmentIncome: number = currentCalculation?.calculationData?.sourceOfIncome?.employmentIncome?.total ?? 0;
    const rentalIncome: number = currentCalculation?.calculationData?.sourceOfIncome?.rentalIncome?.total ?? 0;
    const interestIncome: number = currentCalculation?.calculationData?.sourceOfIncome?.interestIncome?.totalGrossInterest ?? 0;
    const dividendIncome: number = currentCalculation?.calculationData?.sourceOfIncome?.dividendIncome?.totalGrossDividend ?? 0;
    const businessIncome: number = currentCalculation?.calculationData?.sourceOfIncome?.businessIncome?.amountForAssessableIncome ?? 0;
    const businessIncomePercentage: number = currentCalculation?.calculationData?.sourceOfIncome?.businessIncome?.assessableIncomePercentage ?? 0;
    const otherIncome: number = currentCalculation?.calculationData?.sourceOfIncome?.otherIncome?.total ?? 0;
    const totalAssessableIncome: number = currentCalculation?.calculationData?.sourceOfIncome?.totalAssessableIncome ?? 0;
    const personalRelief: number = currentCalculation?.calculationData?.settings?.reliefsAndAit?.personalRelief ?? 0;
    const rentRelief: number = currentCalculation?.calculationData?.deductionsFromAssessableIncome?.rentRelief ?? 0;
    const totalTaxableIncome: number = currentCalculation?.calculationData?.totalTaxableIncome ?? 0;

    return (
        <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
                <MdCalculate className="text-green-300 text-xl" />
                <Text className="text-white text-xl font-bold">Taxable Income Calculation</Text>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income Breakdown Section */}
                <div>
                    <div className="flex items-center space-x-2 mb-3">
                        <MdAttachMoney className="text-blue-300 text-lg" />
                        <Text className="text-white text-lg font-semibold">Income Breakdown</Text>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                        <div className="grid grid-cols-2 gap-0">
                            <div className="bg-white/10 p-3 px-6">
                                <Text className="text-white font-semibold text-sm">Income Type</Text>
                            </div>
                            <div className="bg-white/10 p-3">
                                <Text className="text-white font-semibold text-sm">Amount</Text>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-0 border-b border-white/10">
                            <div className="p-2.5 px-6">
                                <Text className="text-white text-sm">Employment income</Text>
                            </div>
                            <div className="p-2">
                                <Text className="text-white text-sm">{CalculationService.formatCurrency(employmentIncome)}</Text>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-0 border-b border-white/10">
                            <div className="p-2.5 px-6">
                                <Text className="text-white text-sm">Rent income</Text>
                            </div>
                            <div className="p-2">
                                <Text className="text-white text-sm">{CalculationService.formatCurrency(rentalIncome)}</Text>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-0 border-b border-white/10">
                            <div className="p-2.5 px-6">
                                <Text className="text-white text-sm">Interest income</Text>
                            </div>
                            <div className="p-2">
                                <Text className="text-white text-sm">{CalculationService.formatCurrency(interestIncome)}</Text>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-0 border-b border-white/10">
                            <div className="p-2.5 px-6">
                                <Text className="text-white text-sm">Dividend income</Text>
                            </div>
                            <div className="p-2">
                                <Text className="text-white text-sm">{CalculationService.formatCurrency(dividendIncome)}</Text>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-0 border-b border-white/10">
                            <div className="p-2.5 px-6">
                                <Text className="text-white text-sm">Business income ({businessIncomePercentage}%)</Text>
                            </div>
                            <div className="p-2">
                                <Text className="text-white text-sm">{CalculationService.formatCurrency(businessIncome)}</Text>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-0 border-b border-white/10">
                            <div className="p-2.5 px-6">
                                <Text className="text-white text-sm">Other income</Text>
                            </div>
                            <div className="p-2">
                                <Text className="text-white text-sm">{CalculationService.formatCurrency(otherIncome)}</Text>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-0 bg-white/10">
                            <div className="p-2.5 px-6">
                                <Flex align="center" gap="2">
                                    <Text className="text-white font-semibold text-sm">Assessable income</Text>
                                    <Tooltip content="Click to manually recalculate total assessable income" className='bg-surface-2'>
                                        <IconButton
                                            variant="ghost"
                                            size="1"
                                            className="text-gray-400 hover:text-white"
                                            onClick={recalculateTotalAssessableIncome}
                                        >
                                            <IoRefresh />
                                        </IconButton>
                                    </Tooltip>
                                </Flex>
                            </div>
                            <div className="p-2">
                                <Text className="text-white font-semibold text-sm">{CalculationService.formatCurrency(totalAssessableIncome)}</Text>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    {/* Assessable Income Summary */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-3">
                            <MdAttachMoney className="text-blue-300 text-lg" />
                            <Text className="text-white text-lg font-semibold">Assessable Income</Text>
                        </div>
                        <div className="bg-blue-400/10 rounded-lg p-4 border border-blue-400/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
                                        <MdAttachMoney className="text-blue-300 text-lg" />
                                    </div>
                                    <div>
                                        <Text className="text-white font-semibold">Total Assessable Income</Text>
                                        <Text className="text-gray-400 text-xs">Before deductions</Text>
                                    </div>
                                </div>
                                <Text className="text-2xl font-bold text-blue-300">
                                    {CalculationService.formatCurrency(totalAssessableIncome)}
                                </Text>
                            </div>
                        </div>
                    </div>

                    {/* Deductions Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <MdRemoveCircle className="text-red-300 text-lg" />
                            <Text className="text-white text-lg font-semibold">Deductions</Text>
                        </div>

                        <div className="space-y-3">
                            {/* Personal Relief */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-red-400/20 rounded-lg flex items-center justify-center">
                                            <MdAttachMoney className="text-red-300 text-sm" />
                                        </div>
                                        <div>
                                            <Text className="text-white font-semibold text-sm">Personal Relief</Text>
                                            <Text className="text-gray-400 text-xs">Standard personal relief</Text>
                                        </div>
                                    </div>
                                    <Text className="text-lg font-bold text-red-300">
                                        ({CalculationService.formatCurrency(personalRelief)})
                                    </Text>
                                </div>
                            </div>

                            {/* Rent Relief */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-orange-400/20 rounded-lg flex items-center justify-center">
                                            <MdAttachMoney className="text-orange-300 text-sm" />
                                        </div>
                                        <div>
                                            <Text className="text-white font-semibold text-sm">Rent Relief</Text>
                                            <Text className="text-gray-400 text-xs">
                                                {currentCalculation?.calculationData?.settings?.reliefsAndAit?.rentRelief}% of {CalculationService.formatCurrency(rentalIncome)}
                                            </Text>
                                        </div>
                                    </div>
                                    <Text className="text-lg font-bold text-orange-300">
                                        ({CalculationService.formatCurrency(rentRelief)})
                                    </Text>
                                </div>
                            </div>

                            {/* Solar Relief */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                                            <MdAttachMoney className="text-yellow-300 text-sm" />
                                        </div>
                                        <Text className="text-white font-semibold text-sm">Solar Relief</Text>
                                    </div>

                                    <input
                                        type="text"
                                        value={solarRelief}
                                        onChange={(e) => handleSolarReliefChange(e.target.value)}
                                        className="bg-white/10 rounded px-3 py-1 w-36 text-white text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 focus:border-blue-400"
                                        placeholder='0.00'
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calculation Summary */}
            <div className="mt-4 bg-gray-600/20 rounded-lg p-4 border border-gray-500/20">
                <Text className="text-white text-base font-semibold">Calculation Breakdown</Text>
                <div className="space-y-2 mt-3">
                    <div className="flex justify-between items-center">
                        <Text className="text-white text-sm">Total Assessable Income</Text>
                        <Text className="text-white font-semibold">{CalculationService.formatCurrency(totalAssessableIncome)}</Text>
                    </div>
                    <div className="flex justify-between items-center text-red-300">
                        <Text className="text-sm">Less: Personal Relief</Text>
                        <Text className="font-semibold text-sm">- {CalculationService.formatCurrency(personalRelief)}</Text>
                    </div>
                    {rentRelief > 0 && (
                        <div className="flex justify-between items-center text-orange-300">
                            <Text className="text-sm">Less: Rent Relief</Text>
                            <Text className="font-semibold text-sm">- {CalculationService.formatCurrency(rentRelief)}</Text>
                        </div>
                    )}
                    {parseFloat(solarRelief) > 0 && (
                        <div className="flex justify-between items-center text-yellow-300">
                            <Text className="text-sm">Less: Solar Relief</Text>
                            <Text className="font-semibold text-sm">- {CalculationService.formatCurrency(parseFloat(solarRelief) || 0)}</Text>
                        </div>
                    )}
                    <div className="border-t border-white/20 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                            <Text className="text-white font-semibold">Total Taxable Income</Text>
                            <Text className="text-green-300 text-xl font-bold">
                                {CalculationService.formatCurrency(totalTaxableIncome)}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Taxable Income */}
            <div className="mt-3 bg-green-400/10 rounded-lg p-4 border border-green-400/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <MdCalculate className="text-green-300 text-lg" />
                        <Text className="text-white font-semibold">Final Taxable Income</Text>
                    </div>
                    <Text className="text-2xl font-bold text-green-300">
                        {CalculationService.formatCurrency(totalTaxableIncome)}
                    </Text>
                </div>
            </div>
        </div>
    )
}

export default TaxableIncomeCalculation;
