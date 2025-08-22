import { Text, Separator, Flex, IconButton, Tooltip } from '@radix-ui/themes';
import { useState } from 'react';
import { IoIosInformationCircleOutline } from "react-icons/io";

const TaxableIncomeCalculation = () => {
    const [solarRelief, setSolarRelief] = useState("");

    const handleInputChange = (value: string) => {
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
                                <td className="py-3 px-4 text-right">45000.00</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Rent income</td>
                                <td className="py-3 px-4 text-right">12000.00</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Interest income</td>
                                <td className="py-3 px-4 text-right">5000.00</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Dividend income (35%)</td>
                                <td className="py-3 px-4 text-right">8000.00</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Business income</td>
                                <td className="py-3 px-4 text-right">25000.00</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Other income</td>
                                <td className="py-3 px-4 text-right">3000.00</td>
                            </tr>
                            <tr className="border-b border-gray-700 bg-surface-2">
                                <td className="py-3 px-4 font-semibold">Assessable income</td>
                                <td className="py-3 px-4 text-right font-semibold">300000.00</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Personal relief</td>
                                <td className="py-3 px-4 text-right">(1200000.00)</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">
                                    <Flex align="center" gap="2">
                                        <Text>Rent relief</Text>
                                        <Tooltip content="Rent relief is a tax deduction available for rental property expenses" className='bg-surface-2'>
                                            <IconButton variant="ghost" size="1" className="text-gray-400 hover:text-white">
                                                <IoIosInformationCircleOutline />
                                            </IconButton>
                                        </Tooltip>
                                    </Flex>
                                </td>
                                <td className="py-3 px-4 text-right">(3000.00)</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 px-4">Solar relief</td>
                                <td className="py-3 px-4 text-right flex justify-end">
                                    <div className="bg-surface-2 rounded-lg px-4 py-2 w-[200px]">
                                        <input
                                            type="text"
                                            value={solarRelief}
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
                            Rs.5,000,000
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaxableIncomeCalculation;
