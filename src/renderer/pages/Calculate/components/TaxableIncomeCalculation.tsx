import { Text, Separator, Flex, IconButton, Tooltip } from '@radix-ui/themes';
import { useState, useEffect } from 'react';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useCalculationContext } from '../../../contexts/CalculationContext';
import { CalculationService } from '../../../services/calculationService';
import { useSettingsContext } from '../../../contexts/SettingsContext';

const TaxableIncomeCalculation = () => {
    const {
        employmentIncome,
        rentalIncome,
        interestIncome,
        dividendIncome,
        businessIncome,
        otherIncome,
        solarRelief,
        setSolarRelief: setSolarReliefContext,
        calculationResult
    } = useCalculationContext();

    const [solarReliefInput, setSolarReliefInput] = useState(solarRelief === 0 ? "" : solarRelief.toString());
    const { settings } = useSettingsContext();

    // Sync input with context value
    useEffect(() => {
        setSolarReliefInput(solarRelief === 0 ? "" : solarRelief.toString());
    }, [solarRelief]);

    const handleInputChange = (value: string) => {
        if (value.match(/^\d*\.?\d{0,2}$/)) {
            setSolarReliefInput(value);
            const numericValue = parseFloat(value) || 0;
            setSolarReliefContext(Math.round(numericValue * 100) / 100);
        }
    };

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
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(employmentIncome?.total || 0)}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Rent income</td>
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(rentalIncome?.total || 0)}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Interest income</td>
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(interestIncome?.totalGrossInterest || 0)}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Dividend income</td>
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(dividendIncome?.totalGrossDividend || 0)}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">
                                    Business income ({Math.round(businessIncome?.taxableIncomePercentage || 0)}%)
                                </td>
                                <td className="py-3 px-4 text-right">
                                    {businessIncome ?
                                        CalculationService.formatCurrency((businessIncome.total * businessIncome.taxableIncomePercentage) / 100) :
                                        '0.00'
                                    }
                                </td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Other income</td>
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(otherIncome?.total || 0)}</td>
                            </tr>
                            <tr className="border-b border-gray-700 bg-surface-2">
                                <td className="py-3 px-4 font-semibold">Assessable income</td>
                                <td className="py-3 px-4 text-right font-semibold">
                                    {CalculationService.formatCurrency(calculationResult?.assessableIncome || 0)}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Personal relief</td>
                                <td className="py-3 px-4 text-right">
                                    ({CalculationService.formatCurrency(calculationResult?.breakdown.personalRelief || 0)})
                                </td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">
                                    <Flex align="center" gap="2">
                                        <Text>Rent relief</Text>
                                        <Tooltip content={`Rent relief is ${Math.round(settings?.reliefsAndAit.rentRelief || 0)}% of the rent income`} className='bg-surface-2'>
                                            <IconButton variant="ghost" size="1" className="text-gray-400 hover:text-white">
                                                <IoIosInformationCircleOutline />
                                            </IconButton>
                                        </Tooltip>
                                    </Flex>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    ({CalculationService.formatCurrency(calculationResult?.breakdown.rentRelief || 0)})
                                </td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Solar relief</td>
                                <td className="py-3 px-4 text-right flex justify-end">
                                    <div className="bg-surface-2 rounded-lg px-4 py-2 w-[200px]">
                                        <input
                                            type="text"
                                            value={solarReliefInput}
                                            onChange={(e) => handleInputChange(e.target.value)}
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
                            Rs.{CalculationService.formatCurrency(calculationResult?.totalTaxableIncome || 0)}
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaxableIncomeCalculation;
