import { useState } from "react";
import { Text } from "@radix-ui/themes";
import { MdCalculate, MdSchedule } from "react-icons/md";
import { CalculationService } from "../../../../services/calculationService";
import { useCalculationContext } from "../../../../contexts/CalculationContext";

const BalancelPayableTax = () => {
  const { currentCalculation, updateQuarterlyPayment } =
    useCalculationContext();

  const balancePayableTax =
    currentCalculation?.calculationData?.balancePayableTax?.total ?? 0;
  const quarterlyPayments = currentCalculation?.calculationData
    ?.balancePayableTax?.quarterly ?? {
    one: 0,
    two: 0,
    three: 0,
    four: 0,
  };

  const [quarterlyOne, setQuarterlyOne] = useState<string>(
    quarterlyPayments.one === 0 ? "" : quarterlyPayments.one.toString()
  );
  const [quarterlyTwo, setQuarterlyTwo] = useState<string>(
    quarterlyPayments.two === 0 ? "" : quarterlyPayments.two.toString()
  );
  const [quarterlyThree, setQuarterlyThree] = useState<string>(
    quarterlyPayments.three === 0 ? "" : quarterlyPayments.three.toString()
  );
  const [quarterlyFour, setQuarterlyFour] = useState<string>(
    quarterlyPayments.four === 0 ? "" : quarterlyPayments.four.toString()
  );

  const handleQuarterlyOneChange = (value: string) => {
    if (value.match(/^\d*\.?\d{0,2}$/)) {
      setQuarterlyOne(value);
      const numericValue = parseFloat(value) || 0;
      updateQuarterlyPayment("one", numericValue);
    }
  };

  const handleQuarterlyTwoChange = (value: string) => {
    if (value.match(/^\d*\.?\d{0,2}$/)) {
      setQuarterlyTwo(value);
      const numericValue = parseFloat(value) || 0;
      updateQuarterlyPayment("two", numericValue);
    }
  };

  const handleQuarterlyThreeChange = (value: string) => {
    if (value.match(/^\d*\.?\d{0,2}$/)) {
      setQuarterlyThree(value);
      const numericValue = parseFloat(value) || 0;
      updateQuarterlyPayment("three", numericValue);
    }
  };

  const handleQuarterlyFourChange = (value: string) => {
    if (value.match(/^\d*\.?\d{0,2}$/)) {
      setQuarterlyFour(value);
      const numericValue = parseFloat(value) || 0;
      updateQuarterlyPayment("four", numericValue);
    }
  };

  const formatCurrency = (amount: number) => {
    return CalculationService.formatCurrency(amount);
  };

  const totalQuarterlyPayments = Object.values(quarterlyPayments).reduce(
    (sum, payment) => sum + payment,
    0
  );

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center space-x-3">
        <MdCalculate className="text-2xl text-orange-300" />
        <Text className="text-2xl font-bold text-white">
          Balance Payable Tax
        </Text>
      </div>

      {/* Quarterly Payments Section */}
      <div className="mb-6">
        <div className="mb-4 flex items-center space-x-3">
          <MdSchedule className="text-xl text-green-300" />
          <Text className="text-xl font-semibold text-white">
            Quarterly Payments
          </Text>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 1st QRT */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/20">
                <Text className="text-sm font-bold text-blue-300">1</Text>
              </div>
              <Text className="font-semibold text-white">1st Quarter</Text>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-2">
              <input
                type="text"
                value={quarterlyOne}
                onChange={(e) => handleQuarterlyOneChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-right text-white outline-none"
              />
            </div>
          </div>
          {/* 2nd QRT */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-400/20">
                <Text className="text-sm font-bold text-green-300">2</Text>
              </div>
              <Text className="font-semibold text-white">2nd Quarter</Text>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-2">
              <input
                type="text"
                value={quarterlyTwo}
                onChange={(e) => handleQuarterlyTwoChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-right text-white outline-none"
              />
            </div>
          </div>

          {/* 3rd QRT */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400/20">
                <Text className="text-sm font-bold text-yellow-300">3</Text>
              </div>
              <Text className="font-semibold text-white">3rd Quarter</Text>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-2">
              <input
                type="text"
                value={quarterlyThree}
                onChange={(e) => handleQuarterlyThreeChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-right text-white outline-none"
              />
            </div>
          </div>

          {/* 4th QRT */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/20">
                <Text className="text-sm font-bold text-red-300">4</Text>
              </div>
              <Text className="font-semibold text-white">4th Quarter</Text>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-2">
              <input
                type="text"
                value={quarterlyFour}
                onChange={(e) => handleQuarterlyFourChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-right text-white outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Summary */}
      <div className="mb-6 rounded-xl border border-gray-500/20 bg-gray-600/20 p-6">
        <Text className="text-lg font-semibold text-white">
          Balance Calculation
        </Text>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Text className="text-white">Total Payable Tax</Text>
            <Text className="font-semibold text-white">
              {formatCurrency(
                currentCalculation?.calculationData?.totalPayableTax ?? 0
              )}
            </Text>
          </div>
          <div className="flex items-center justify-between text-green-300">
            <Text>Less: Total Quarterly Payments</Text>
            <Text className="font-semibold">
              - {formatCurrency(totalQuarterlyPayments)}
            </Text>
          </div>
          <div className="mt-3 border-t border-white/20 pt-3">
            <div className="flex items-center justify-between">
              <Text className="text-lg font-semibold text-white">
                Balance Payable Tax
              </Text>
              <Text
                className={`text-2xl font-bold ${balancePayableTax < 0 ? "text-red-300" : "text-orange-300"}`}
              >
                {balancePayableTax < 0
                  ? `(${formatCurrency(Math.abs(balancePayableTax))})`
                  : formatCurrency(balancePayableTax)}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Final Balance Payable Tax */}
      <div className="rounded-xl border border-orange-400/20 bg-orange-400/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MdCalculate className="text-2xl text-orange-300" />
            <Text className="text-xl font-semibold text-white">
              Final Balance Payable Tax
            </Text>
          </div>
          <Text
            className={`text-3xl font-bold ${balancePayableTax < 0 ? "text-red-300" : "text-orange-300"}`}
          >
            {balancePayableTax < 0
              ? `(${formatCurrency(Math.abs(balancePayableTax))})`
              : formatCurrency(balancePayableTax)}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default BalancelPayableTax;
