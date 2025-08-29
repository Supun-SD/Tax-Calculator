import { useState, useEffect } from 'react';
import { Text } from '@radix-ui/themes';
import { MdCalculate, MdSchedule } from 'react-icons/md';
import { CalculationService } from '../../../../services/calculationService';
import { useCalculationContext } from '../../../../contexts/CalculationContext';

const BalancelPayableTax = () => {
    const { currentCalculation, updateQuarterlyPayment } = useCalculationContext();

    const balancePayableTax = currentCalculation?.calculationData?.balancePayableTax?.total ?? 0;
    const quarterlyPayments = currentCalculation?.calculationData?.balancePayableTax?.quarterly ?? {
        one: 0,
        two: 0,
        three: 0,
        four: 0
    };

    const [quarterlyOne, setQuarterlyOne] = useState<string>(quarterlyPayments.one === 0 ? '' : quarterlyPayments.one.toString());
    const [quarterlyTwo, setQuarterlyTwo] = useState<string>('');
    const [quarterlyThree, setQuarterlyThree] = useState<string>('');
    const [quarterlyFour, setQuarterlyFour] = useState<string>('');

    const handleQuarterlyOneChange = (value: string) => {
        if (value.match(/^\d*\.?\d{0,2}$/)) {
            setQuarterlyOne(value);
            const numericValue = parseFloat(value) || 0;
            updateQuarterlyPayment('one', numericValue);
        }
    };

    const handleQuarterlyTwoChange = (value: string) => {
        if (value.match(/^\d*\.?\d{0,2}$/)) {
            setQuarterlyTwo(value);
            const numericValue = parseFloat(value) || 0;
            updateQuarterlyPayment('two', numericValue);
        }
    };

    const handleQuarterlyThreeChange = (value: string) => {
        if (value.match(/^\d*\.?\d{0,2}$/)) {
            setQuarterlyThree(value);
            const numericValue = parseFloat(value) || 0;
            updateQuarterlyPayment('three', numericValue);
        }
    };

    const handleQuarterlyFourChange = (value: string) => {
        if (value.match(/^\d*\.?\d{0,2}$/)) {
            setQuarterlyFour(value);
            const numericValue = parseFloat(value) || 0;
            updateQuarterlyPayment('four', numericValue);
        }
    };

    const formatCurrency = (amount: number) => {
        return CalculationService.formatCurrency(amount);
    };

    const totalQuarterlyPayments = Object.values(quarterlyPayments).reduce((sum, payment) => sum + payment, 0);

    return (
        <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
                <MdCalculate className="text-orange-300 text-2xl" />
                <Text className="text-white text-2xl font-bold">Balance Payable Tax</Text>
            </div>

            {/* Quarterly Payments Section */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                    <MdSchedule className="text-green-300 text-xl" />
                    <Text className="text-white text-xl font-semibold">Quarterly Payments</Text>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* 1st QRT */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center">
                                <Text className="text-blue-300 font-bold text-sm">1</Text>
                            </div>
                            <Text className="text-white font-semibold">1st Quarter</Text>
                        </div>
                        <div className="bg-white/10 rounded-lg px-4 py-2">
                            <input
                                type="text"
                                value={quarterlyOne}
                                onChange={(e) => handleQuarterlyOneChange(e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-white text-right w-full outline-none"
                            />
                        </div>
                    </div>
                    {/* 2nd QRT */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center">
                                <Text className="text-green-300 font-bold text-sm">2</Text>
                            </div>
                            <Text className="text-white font-semibold">2nd Quarter</Text>
                        </div>
                        <div className="bg-white/10 rounded-lg px-4 py-2">
                            <input
                                type="text"
                                value={quarterlyTwo}
                                onChange={(e) => handleQuarterlyTwoChange(e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-white text-right w-full outline-none"
                            />
                        </div>
                    </div>

                    {/* 3rd QRT */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                                <Text className="text-yellow-300 font-bold text-sm">3</Text>
                            </div>
                            <Text className="text-white font-semibold">3rd Quarter</Text>
                        </div>
                        <div className="bg-white/10 rounded-lg px-4 py-2">
                            <input
                                type="text"
                                value={quarterlyThree}
                                onChange={(e) => handleQuarterlyThreeChange(e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-white text-right w-full outline-none"
                            />
                        </div>
                    </div>

                    {/* 4th QRT */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-red-400/20 rounded-lg flex items-center justify-center">
                                <Text className="text-red-300 font-bold text-sm">4</Text>
                            </div>
                            <Text className="text-white font-semibold">4th Quarter</Text>
                        </div>
                        <div className="bg-white/10 rounded-lg px-4 py-2">
                            <input
                                type="text"
                                value={quarterlyFour}
                                onChange={(e) => handleQuarterlyFourChange(e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-white text-right w-full outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Calculation Summary */}
            <div className="bg-gray-600/20 rounded-xl p-6 border border-gray-500/20 mb-6">
                <Text className="text-white text-lg font-semibold">Balance Calculation</Text>
                <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                        <Text className="text-white">Total Payable Tax</Text>
                        <Text className="text-white font-semibold">
                            {formatCurrency(currentCalculation?.calculationData?.totalPayableTax ?? 0)}
                        </Text>
                    </div>
                    <div className="flex justify-between items-center text-green-300">
                        <Text>Less: Total Quarterly Payments</Text>
                        <Text className="font-semibold">- {formatCurrency(totalQuarterlyPayments)}</Text>
                    </div>
                    <div className="border-t border-white/20 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <Text className="text-white text-lg font-semibold">Balance Payable Tax</Text>
                            <Text className={`text-2xl font-bold ${balancePayableTax < 0 ? 'text-red-300' : 'text-orange-300'}`}>
                                {balancePayableTax < 0 ? `(${formatCurrency(Math.abs(balancePayableTax))})` : formatCurrency(balancePayableTax)}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Balance Payable Tax */}
            <div className="bg-orange-400/10 rounded-xl p-6 border border-orange-400/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <MdCalculate className="text-orange-300 text-2xl" />
                        <Text className="text-white text-xl font-semibold">Final Balance Payable Tax</Text>
                    </div>
                    <Text className={`text-3xl font-bold ${balancePayableTax < 0 ? 'text-red-300' : 'text-orange-300'}`}>
                        {balancePayableTax < 0 ? `(${formatCurrency(Math.abs(balancePayableTax))})` : formatCurrency(balancePayableTax)}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default BalancelPayableTax;
