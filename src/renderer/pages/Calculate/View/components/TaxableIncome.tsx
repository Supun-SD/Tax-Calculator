import { Calculation } from "../../../../../types/calculation";
import { Text, Grid } from "@radix-ui/themes";
import { MdCalculate, MdRemoveCircle, MdAttachMoney } from "react-icons/md";

interface TaxableIncomeProps {
  calculation: Calculation;
}

const TaxableIncome = ({ calculation }: TaxableIncomeProps) => {
  const formatCurrency = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined) return "Rs. 0.00";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return `Rs. ${num.toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const { sourceOfIncome, deductionsFromAssessableIncome, totalTaxableIncome } =
    calculation.calculationData;

  const { totalAssessableIncome } = sourceOfIncome;

  const { personalRelief, rentRelief } =
    calculation.calculationData.settings.reliefsAndAit;
  const {
    solarRelief,
    rentRelief: rentReliefDeduction,
    donations = 0,
  } = deductionsFromAssessableIncome;

  const rentalIncomeTotal =
    calculation.calculationData.sourceOfIncome.rentalIncome?.total || 0;

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center space-x-3">
        <MdCalculate className="text-2xl text-green-300" />
        <Text className="text-2xl font-bold text-white">
          Taxable Income Calculation
        </Text>
      </div>

      {/* Deductions Section */}
      <div className="mb-6">
        <div className="mb-4 flex items-center space-x-3">
          <MdRemoveCircle className="text-xl text-red-300" />
          <Text className="text-xl font-semibold text-white">Deductions</Text>
        </div>

        <Grid columns="4" gap="6">
          {/* Personal Relief */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-400/20">
                <MdAttachMoney className="text-lg text-red-300" />
              </div>
              <Text className="font-semibold text-white">Personal Relief</Text>
            </div>
            <div className="flex flex-col">
              <Text className="text-2xl font-bold text-red-300">
                {formatCurrency(personalRelief)}
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                Standard personal relief
              </Text>
            </div>
          </div>

          {/* Rent Relief */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-400/20">
                <MdAttachMoney className="text-lg text-orange-300" />
              </div>
              <Text className="font-semibold text-white">Rent Relief</Text>
            </div>
            <div className="flex flex-col">
              <Text className="text-2xl font-bold text-orange-300">
                {formatCurrency(rentReliefDeduction)}
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                {rentRelief}% of {formatCurrency(rentalIncomeTotal)}
              </Text>
            </div>
          </div>

          {/* Solar Relief */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/20">
                <MdAttachMoney className="text-lg text-yellow-300" />
              </div>
              <Text className="font-semibold text-white">Solar Relief</Text>
            </div>
            <Text className="text-2xl font-bold text-yellow-300">
              {formatCurrency(solarRelief)}
            </Text>
          </div>

          {/* Donations */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-400/20">
                <MdAttachMoney className="text-lg text-purple-300" />
              </div>
              <Text className="font-semibold text-white">Donations</Text>
            </div>
            <Text className="text-2xl font-bold text-purple-300">
              {formatCurrency(donations)}
            </Text>
          </div>
        </Grid>
      </div>

      {/* Calculation Breakdown */}
      <div className="mb-6 rounded-xl border border-gray-500/20 bg-gray-600/20 p-6">
        <Text className="text-lg font-semibold text-white">
          Calculation Breakdown
        </Text>
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <Text className="text-white">Total Assessable Income</Text>
            <Text className="font-semibold text-white">
              {formatCurrency(totalAssessableIncome)}
            </Text>
          </div>
          <div className="flex items-center justify-between text-red-300">
            <Text>Less: Personal Relief</Text>
            <Text className="font-semibold">
              - {formatCurrency(personalRelief)}
            </Text>
          </div>
          {rentReliefDeduction > 0 && (
            <div className="flex items-center justify-between text-orange-300">
              <Text>Less: Rent Relief</Text>
              <Text className="font-semibold">
                - {formatCurrency(rentReliefDeduction)}
              </Text>
            </div>
          )}
          {solarRelief > 0 && (
            <div className="flex items-center justify-between text-yellow-300">
              <Text>Less: Solar Relief</Text>
              <Text className="font-semibold">
                - {formatCurrency(solarRelief)}
              </Text>
            </div>
          )}
          {donations > 0 && (
            <div className="flex items-center justify-between text-purple-300">
              <Text>Less: Donations</Text>
              <Text className="font-semibold">
                - {formatCurrency(donations)}
              </Text>
            </div>
          )}
          <div className="mt-3 border-t border-white/20 pt-3">
            <div className="flex items-center justify-between">
              <Text className="text-lg font-semibold text-white">
                Total Taxable Income
              </Text>
              <Text className="text-2xl font-bold text-green-300">
                {formatCurrency(totalTaxableIncome)}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Final Taxable Income */}
      <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MdCalculate className="text-2xl text-green-300" />
            <Text className="text-xl font-semibold text-white">
              Final Taxable Income
            </Text>
          </div>
          <Text className="text-3xl font-bold text-green-300">
            {formatCurrency(totalTaxableIncome)}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default TaxableIncome;
