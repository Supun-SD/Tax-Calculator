import { useState, useEffect } from 'react';
import { Text, Separator, Flex, IconButton, Tooltip, Button } from '@radix-ui/themes';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoRefresh } from "react-icons/io5";
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
        <div className="h-full flex flex-col">
            <Text className='text-white pl-3' size="4" weight="bold">Taxable income calculation</Text>
            <Separator className="w-full mt-3 bg-surface-2" />
            <div className='text-white bg-surface mt-4 p-8 rounded-2xl flex-1 flex flex-col'>
                {/* Income Breakdown Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-600">
                                <th className="text-left py-3 px-4 font-semibold text-gray-300">Income Type</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-300">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Employment income</td>
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(employmentIncome)}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Rent income</td>
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(rentalIncome)}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Interest income</td>
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(interestIncome)}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Dividend income</td>
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(dividendIncome)}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">
                                    Business income ({businessIncomePercentage}%)
                                </td>
                                <td className="py-3 px-4 text-right">
                                    {CalculationService.formatCurrency(businessIncome)}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Other income</td>
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(otherIncome)}</td>
                            </tr>
                            <tr className="border-b border-gray-700 bg-surface-2">
                                <td className="py-3 px-4 font-semibold">
                                    <Flex align="center" gap="2">
                                        <Text>Assessable income</Text>
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
                                </td>
                                <td className="py-3 px-4 text-right font-semibold">
                                    {CalculationService.formatCurrency(totalAssessableIncome)}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Personal relief</td>
                                <td className="py-3 px-4 text-right">
                                    ({CalculationService.formatCurrency(personalRelief)})
                                </td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">
                                    <Flex align="center" gap="2">
                                        <Text>Rent relief</Text>
                                        <Tooltip content={`Rent relief is ${currentCalculation?.calculationData?.settings?.reliefsAndAit?.rentRelief}% of the rent income`} className='bg-surface-2'>
                                            <IconButton variant="ghost" size="1" className="text-gray-400 hover:text-white">
                                                <IoIosInformationCircleOutline />
                                            </IconButton>
                                        </Tooltip>
                                    </Flex>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    ({CalculationService.formatCurrency(rentRelief)})
                                </td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Solar relief</td>
                                <td className="py-3 px-4 text-right flex justify-end">
                                    <div className="bg-surface-2 rounded-lg px-4 py-2 w-[200px]">
                                        <input
                                            type="text"
                                            value={solarRelief}
                                            onChange={(e) => handleSolarReliefChange(e.target.value)}
                                            className="bg-transparent text-white text-right outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            placeholder='0.00'
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Total Payable Amount */}
                <div className="mt-6 bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <Text className="text-white font-semibold">Taxable income</Text>
                        <Text className="text-white font-bold text-lg">
                            Rs.{CalculationService.formatCurrency(totalTaxableIncome)}
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaxableIncomeCalculation;
