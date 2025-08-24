import { useState } from 'react';
import { Text, Separator, Flex, IconButton, Tooltip } from '@radix-ui/themes';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { CalculationService } from '../../../services/calculationService';

const TaxableIncomeCalculation = () => {
    // Dummy state values
    const [solarRelief, setSolarRelief] = useState<string>('50000');

    // Dummy income data
    const dummyIncomeData = {
        employmentIncome: 800000,
        rentalIncome: 600000,
        interestIncome: 150000,
        dividendIncome: 200000,
        businessIncome: 400000,
        otherIncome: 100000
    };

    // Dummy relief data
    const dummyReliefData = {
        personalRelief: 1200000,
        rentRelief: 90000, // 15% of rental income
        solarRelief: 50000
    };

    // Dummy calculations
    const assessableIncome = Object.values(dummyIncomeData).reduce((sum, income) => sum + income, 0);
    const totalDeductions = dummyReliefData.personalRelief + dummyReliefData.rentRelief + dummyReliefData.solarRelief;
    const totalTaxableIncome = assessableIncome - totalDeductions;

    const handleSolarReliefChange = (value: string) => {
        if (value.match(/^\d*\.?\d{0,2}$/)) {
            setSolarRelief(value);
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
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(dummyIncomeData.employmentIncome)}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Rent income</td>
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(dummyIncomeData.rentalIncome)}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Interest income</td>
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(dummyIncomeData.interestIncome)}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Dividend income</td>
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(dummyIncomeData.dividendIncome)}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">
                                    Business income (25%)
                                </td>
                                <td className="py-3 px-4 text-right">
                                    {CalculationService.formatCurrency((dummyIncomeData.businessIncome * 25) / 100)}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Other income</td>
                                <td className="py-3 px-4 text-right">{CalculationService.formatCurrency(dummyIncomeData.otherIncome)}</td>
                            </tr>
                            <tr className="border-b border-gray-700 bg-surface-2">
                                <td className="py-3 px-4 font-semibold">Assessable income</td>
                                <td className="py-3 px-4 text-right font-semibold">
                                    {CalculationService.formatCurrency(assessableIncome)}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Personal relief</td>
                                <td className="py-3 px-4 text-right">
                                    ({CalculationService.formatCurrency(dummyReliefData.personalRelief)})
                                </td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">
                                    <Flex align="center" gap="2">
                                        <Text>Rent relief</Text>
                                        <Tooltip content="Rent relief is 15% of the rent income" className='bg-surface-2'>
                                            <IconButton variant="ghost" size="1" className="text-gray-400 hover:text-white">
                                                <IoIosInformationCircleOutline />
                                            </IconButton>
                                        </Tooltip>
                                    </Flex>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    ({CalculationService.formatCurrency(dummyReliefData.rentRelief)})
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
