import { useState, useEffect } from "react";
import { Text, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import { IoRefresh } from "react-icons/io5";
import { BsInfoCircleFill } from "react-icons/bs";
import { MdCalculate, MdRemoveCircle, MdAttachMoney } from "react-icons/md";
import { CalculationService } from "../../../../services/calculationService";
import { useCalculationContext } from "../../../../contexts/CalculationContext";

const TaxableIncomeCalculation = () => {
  const {
    currentCalculation,
    recalculateTotalAssessableIncome,
    updateSolarRelief,
    updateDonations,
  } = useCalculationContext();

  const [solarRelief, setSolarRelief] = useState<string>("");
  const [donations, setDonations] = useState<string>("");

  useEffect(() => {
    const currentSolarRelief =
      currentCalculation?.calculationData?.deductionsFromAssessableIncome
        ?.solarRelief ?? "";
    if (currentSolarRelief === 0) {
      setSolarRelief("");
    } else {
      setSolarRelief(currentSolarRelief.toString());
    }
  }, [
    currentCalculation?.calculationData?.deductionsFromAssessableIncome
      ?.solarRelief,
  ]);

  useEffect(() => {
    const currentDonations =
      currentCalculation?.calculationData?.deductionsFromAssessableIncome
        ?.donations ?? "";
    if (currentDonations === 0) {
      setDonations("");
    } else {
      setDonations(currentDonations.toString());
    }
  }, [
    currentCalculation?.calculationData?.deductionsFromAssessableIncome
      ?.donations,
  ]);

  const handleSolarReliefChange = (value: string) => {
    if (value.match(/^\d*\.?\d{0,2}$/)) {
      setSolarRelief(value);
      const numericValue = parseFloat(value) || 0;
      updateSolarRelief(numericValue);
    }
  };

  const handleDonationsChange = (value: string) => {
    if (value.match(/^\d*\.?\d{0,2}$/)) {
      setDonations(value);
      const numericValue = parseFloat(value) || 0;
      updateDonations(numericValue);
    }
  };

  const employmentIncome: number =
    currentCalculation?.calculationData?.sourceOfIncome?.employmentIncome
      ?.total ?? 0;
  const rentalIncome: number =
    currentCalculation?.calculationData?.sourceOfIncome?.rentalIncome?.total ??
    0;
  const interestIncome: number =
    currentCalculation?.calculationData?.sourceOfIncome?.interestIncome
      ?.totalGrossInterest ?? 0;
  const dividendIncome: number =
    currentCalculation?.calculationData?.sourceOfIncome?.dividendIncome
      ?.totalGrossDividend ?? 0;
  const businessIncome: number =
    currentCalculation?.calculationData?.sourceOfIncome?.businessIncome
      ?.amountForAssessableIncome ?? 0;
  const businessIncomePercentage: number =
    currentCalculation?.calculationData?.sourceOfIncome?.businessIncome
      ?.assessableIncomePercentage ?? 0;
  const otherIncome: number =
    currentCalculation?.calculationData?.sourceOfIncome?.otherIncome?.total ??
    0;
  const totalAssessableIncome: number =
    currentCalculation?.calculationData?.sourceOfIncome
      ?.totalAssessableIncome ?? 0;
  const personalRelief: number =
    currentCalculation?.calculationData?.settings?.reliefsAndAit
      ?.personalRelief ?? 0;
  const rentRelief: number =
    currentCalculation?.calculationData?.deductionsFromAssessableIncome
      ?.rentRelief ?? 0;
  const totalTaxableIncome: number =
    currentCalculation?.calculationData?.totalTaxableIncome ?? 0;

  const fdIncome: number =
    currentCalculation?.calculationData?.sourceOfIncome?.interestIncome
      ?.fdIncome?.total ?? 0;
  const repoIncome: number =
    currentCalculation?.calculationData?.sourceOfIncome?.interestIncome
      ?.repoIncome?.total ?? 0;
  const unitTrustIncome: number =
    currentCalculation?.calculationData?.sourceOfIncome?.interestIncome
      ?.unitTrustIncome?.total ?? 0;
  const treasuryBillIncome: number =
    currentCalculation?.calculationData?.sourceOfIncome?.interestIncome
      ?.treasuryBillIncome?.total ?? 0;
  const tBondIncome: number =
    currentCalculation?.calculationData?.sourceOfIncome?.interestIncome
      ?.tBondIncome?.total ?? 0;
  const debentureIncome: number =
    currentCalculation?.calculationData?.sourceOfIncome?.interestIncome
      ?.debentureIncome?.total ?? 0;
  const applyManagementFee =
    currentCalculation?.calculationData?.sourceOfIncome?.interestIncome
      ?.applyManagementFee ?? false;
  const managementFee: number = applyManagementFee
    ? (currentCalculation?.calculationData?.sourceOfIncome?.interestIncome
        ?.managementFee ?? 0)
    : 0;

  const getInterestBreakdownContent = () => {
    if (interestIncome === 0 && managementFee === 0) return null;

    const breakdownItems = [];
    if (fdIncome > 0)
      breakdownItems.push({ label: "Fixed Deposit", value: fdIncome });
    if (repoIncome > 0)
      breakdownItems.push({ label: "Repo", value: repoIncome });
    if (unitTrustIncome > 0)
      breakdownItems.push({ label: "Unit Trust", value: unitTrustIncome });
    if (treasuryBillIncome > 0)
      breakdownItems.push({
        label: "Treasury Bill",
        value: treasuryBillIncome,
      });
    if (tBondIncome > 0)
      breakdownItems.push({ label: "T-Bond", value: tBondIncome });
    if (debentureIncome > 0)
      breakdownItems.push({ label: "Debenture", value: debentureIncome });

    return (
      <div className="rounded-xl border border-gray-600 bg-gray-800 p-3 shadow-2xl">
        <div className="mb-3 flex items-center space-x-2 border-b border-gray-600 pb-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
          <div className="text-sm font-bold text-white">
            Interest Income Breakdown
          </div>
        </div>
        <div className="space-y-2">
          {breakdownItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-gray-600 bg-gray-700 p-2 transition-all duration-200 hover:bg-gray-600"
            >
              <span className="text-xs font-medium text-gray-200">
                {item.label}
              </span>
              <span className="text-xs font-bold text-white">
                {CalculationService.formatCurrency(item.value)}
              </span>
            </div>
          ))}
          {managementFee > 0 && (
            <div className="flex items-center justify-between rounded-lg border border-gray-600 bg-gray-700 p-2">
              <span className="text-xs font-medium text-gray-200">
                Management Fee
              </span>
              <span className="text-xs font-bold text-red-300">
                - {CalculationService.formatCurrency(managementFee)}
              </span>
            </div>
          )}
        </div>
        <div className="mt-3 border-t border-gray-600 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-300">Total</span>
            <span className="text-sm font-bold text-blue-400">
              {CalculationService.formatCurrency(interestIncome)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center space-x-3">
        <MdCalculate className="text-xl text-green-300" />
        <Text className="text-xl font-bold text-white">
          Taxable Income Calculation
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Income Breakdown Section */}
        <div>
          <div className="mb-3 flex items-center space-x-2">
            <MdAttachMoney className="text-lg text-blue-300" />
            <Text className="text-lg font-semibold text-white">
              Income Breakdown
            </Text>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-0">
              <div className="bg-white/10 p-3 px-6">
                <Text className="text-sm font-semibold text-white">
                  Income Type
                </Text>
              </div>
              <div className="bg-white/10 p-3">
                <Text className="text-sm font-semibold text-white">Amount</Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0 border-b border-white/10">
              <div className="p-2.5 px-6">
                <Text className="text-sm text-white">Employment income</Text>
              </div>
              <div className="p-2">
                <Text className="text-sm text-white">
                  {CalculationService.formatCurrency(employmentIncome)}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0 border-b border-white/10">
              <div className="p-2.5 px-6">
                <Text className="text-sm text-white">Rent income</Text>
              </div>
              <div className="p-2">
                <Text className="text-sm text-white">
                  {CalculationService.formatCurrency(rentalIncome)}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0 border-b border-white/10">
              <div className="p-2.5 px-6">
                {interestIncome > 0 ? (
                  <Tooltip
                    content={getInterestBreakdownContent()}
                    className="bg-transparent"
                  >
                    <div className="flex items-center space-x-2">
                      <Text className="cursor-help text-sm text-white transition-colors duration-200 hover:text-blue-300">
                        Interest income
                      </Text>
                      <BsInfoCircleFill
                        className="text-xs text-blue-300/80"
                        size={16}
                      />
                    </div>
                  </Tooltip>
                ) : (
                  <Text className="text-sm text-white">Interest income</Text>
                )}
              </div>
              <div className="p-2">
                <Text className="text-sm text-white">
                  {CalculationService.formatCurrency(interestIncome)}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0 border-b border-white/10">
              <div className="p-2.5 px-6">
                <Text className="text-sm text-white">Dividend income</Text>
              </div>
              <div className="p-2">
                <Text className="text-sm text-white">
                  {CalculationService.formatCurrency(dividendIncome)}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0 border-b border-white/10">
              <div className="p-2.5 px-6">
                <Text className="text-sm text-white">
                  Business income ({businessIncomePercentage}%)
                </Text>
              </div>
              <div className="p-2">
                <Text className="text-sm text-white">
                  {CalculationService.formatCurrency(businessIncome)}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0 border-b border-white/10">
              <div className="p-2.5 px-6">
                <Text className="text-sm text-white">Other income</Text>
              </div>
              <div className="p-2">
                <Text className="text-sm text-white">
                  {CalculationService.formatCurrency(otherIncome)}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0 bg-white/10">
              <div className="p-2.5 px-6">
                <Flex align="center" gap="2">
                  <Text className="text-sm font-semibold text-white">
                    Assessable income
                  </Text>
                  <Tooltip
                    content="Click to manually recalculate total assessable income"
                    className="bg-surface-2"
                  >
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
                <Text className="text-sm font-semibold text-white">
                  {CalculationService.formatCurrency(totalAssessableIncome)}
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Assessable Income Summary */}
          <div className="mb-6">
            <div className="mb-3 flex items-center space-x-2">
              <MdAttachMoney className="text-lg text-blue-300" />
              <Text className="text-lg font-semibold text-white">
                Assessable Income
              </Text>
            </div>
            <div className="rounded-lg border border-blue-400/20 bg-blue-400/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400/20">
                    <MdAttachMoney className="text-lg text-blue-300" />
                  </div>
                  <div>
                    <Text className="font-semibold text-white">
                      Total Assessable Income
                    </Text>
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
            <div className="mb-3 flex items-center space-x-2">
              <MdRemoveCircle className="text-lg text-red-300" />
              <Text className="text-lg font-semibold text-white">
                Deductions
              </Text>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Personal Relief */}
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/20">
                    <MdAttachMoney className="text-sm text-red-300" />
                  </div>
                  <Text className="text-sm font-semibold text-white">
                    Personal Relief
                  </Text>
                </div>
                <Text className="text-lg font-bold text-red-300">
                  ({CalculationService.formatCurrency(personalRelief)})
                </Text>
              </div>

              {/* Rent Relief */}
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center space-x-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-400/20">
                    <MdAttachMoney className="text-sm text-orange-300" />
                  </div>
                  <div>
                    <Text className="text-sm font-semibold text-white">
                      Rent Relief
                    </Text>
                    <Text className="ml-2 text-xs text-gray-400">
                      {
                        currentCalculation?.calculationData?.settings
                          ?.reliefsAndAit?.rentRelief
                      }
                      % of {CalculationService.formatCurrency(rentalIncome)}
                    </Text>
                  </div>
                </div>
                <Text className="text-lg font-bold text-orange-300">
                  ({CalculationService.formatCurrency(rentRelief)})
                </Text>
              </div>

              {/* Solar Relief */}
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400/20">
                    <MdAttachMoney className="text-sm text-yellow-300" />
                  </div>
                  <Text className="text-sm font-semibold text-white">
                    Solar Relief
                  </Text>
                </div>
                <input
                  type="text"
                  value={solarRelief}
                  onChange={(e) => handleSolarReliefChange(e.target.value)}
                  className="w-full rounded bg-white/10 px-3 py-1 text-right text-sm text-white outline-none [appearance:textfield] focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="0.00"
                />
              </div>

              {/* Donations */}
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-400/20">
                    <MdAttachMoney className="text-sm text-purple-300" />
                  </div>
                  <Text className="text-sm font-semibold text-white">
                    Donations
                  </Text>
                </div>
                <input
                  type="text"
                  value={donations}
                  onChange={(e) => handleDonationsChange(e.target.value)}
                  className="w-full rounded bg-white/10 px-3 py-1 text-right text-sm text-white outline-none [appearance:textfield] focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Summary */}
      <div className="mt-4 rounded-lg border border-gray-500/20 bg-gray-600/20 p-4">
        <Text className="text-base font-semibold text-white">
          Calculation Breakdown
        </Text>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <Text className="text-sm text-white">Total Assessable Income</Text>
            <Text className="font-semibold text-white">
              {CalculationService.formatCurrency(totalAssessableIncome)}
            </Text>
          </div>
          <div className="flex items-center justify-between text-red-300">
            <Text className="text-sm">Less: Personal Relief</Text>
            <Text className="text-sm font-semibold">
              - {CalculationService.formatCurrency(personalRelief)}
            </Text>
          </div>
          {rentRelief > 0 && (
            <div className="flex items-center justify-between text-orange-300">
              <Text className="text-sm">Less: Rent Relief</Text>
              <Text className="text-sm font-semibold">
                - {CalculationService.formatCurrency(rentRelief)}
              </Text>
            </div>
          )}
          {parseFloat(solarRelief) > 0 && (
            <div className="flex items-center justify-between text-yellow-300">
              <Text className="text-sm">Less: Solar Relief</Text>
              <Text className="text-sm font-semibold">
                -{" "}
                {CalculationService.formatCurrency(
                  parseFloat(solarRelief) || 0
                )}
              </Text>
            </div>
          )}
          {parseFloat(donations) > 0 && (
            <div className="flex items-center justify-between text-purple-300">
              <Text className="text-sm">Less: Donations</Text>
              <Text className="text-sm font-semibold">
                -{" "}
                {CalculationService.formatCurrency(parseFloat(donations) || 0)}
              </Text>
            </div>
          )}
          <div className="mt-2 border-t border-white/20 pt-2">
            <div className="flex items-center justify-between">
              <Text className="font-semibold text-white">
                Total Taxable Income
              </Text>
              <Text className="text-xl font-bold text-green-300">
                {CalculationService.formatCurrency(totalTaxableIncome)}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Final Taxable Income */}
      <div className="mt-3 rounded-lg border border-green-400/20 bg-green-400/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MdCalculate className="text-lg text-green-300" />
            <Text className="font-semibold text-white">
              Final Taxable Income
            </Text>
          </div>
          <Text className="text-2xl font-bold text-green-300">
            {CalculationService.formatCurrency(totalTaxableIncome)}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default TaxableIncomeCalculation;
