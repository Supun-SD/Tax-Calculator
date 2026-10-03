import { Calculation } from "../../../../../types/calculation";
import { Text } from "@radix-ui/themes";
import { MdCalculate, MdSchedule } from "react-icons/md";

interface BalancePayableTaxProps {
  calculation: Calculation;
}

const BalancePayableTax = ({ calculation }: BalancePayableTaxProps) => {
  const formatCurrency = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined) return "Rs. 0.00";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return `Rs. ${num.toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const { balancePayableTax } = calculation.calculationData;
  const { total, quarterly } = balancePayableTax;

  const totalQuarterlyPayments = Object.values(quarterly).reduce(
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
            <Text className="text-lg font-bold text-blue-300">
              {formatCurrency(quarterly.one)}
            </Text>
          </div>

          {/* 2nd QRT */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-400/20">
                <Text className="text-sm font-bold text-green-300">2</Text>
              </div>
              <Text className="font-semibold text-white">2nd Quarter</Text>
            </div>
            <Text className="text-lg font-bold text-green-300">
              {formatCurrency(quarterly.two)}
            </Text>
          </div>

          {/* 3rd QRT */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400/20">
                <Text className="text-sm font-bold text-yellow-300">3</Text>
              </div>
              <Text className="font-semibold text-white">3rd Quarter</Text>
            </div>
            <Text className="text-lg font-bold text-yellow-300">
              {formatCurrency(quarterly.three)}
            </Text>
          </div>

          {/* 4th QRT */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/20">
                <Text className="text-sm font-bold text-red-300">4</Text>
              </div>
              <Text className="font-semibold text-white">4th Quarter</Text>
            </div>
            <Text className="text-lg font-bold text-red-300">
              {formatCurrency(quarterly.four)}
            </Text>
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
              {formatCurrency(calculation.calculationData.totalPayableTax)}
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
                className={`text-2xl font-bold ${total < 0 ? "text-red-300" : "text-orange-300"}`}
              >
                {total < 0
                  ? `(${formatCurrency(Math.abs(total))})`
                  : formatCurrency(total)}
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
            className={`text-3xl font-bold ${total < 0 ? "text-red-300" : "text-orange-300"}`}
          >
            {total < 0
              ? `(${formatCurrency(Math.abs(total))})`
              : formatCurrency(total)}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default BalancePayableTax;
