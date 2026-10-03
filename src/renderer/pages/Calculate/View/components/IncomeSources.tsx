import { Calculation } from "../../../../../types/calculation";
import {
  MdPerson,
  MdAttachMoney,
  MdReceipt,
  MdAccountBalance,
  MdBusiness,
  MdTrendingUp,
} from "react-icons/md";
import { Grid, Text } from "@radix-ui/themes";
import { useState } from "react";
import Modal from "../../../../components/Modal";
import IncomeBreakdownModal from "./IncomeBreakdownModal";

interface IncomeSourcesProps {
  calculation: Calculation;
}

const IncomeSources = ({ calculation }: IncomeSourcesProps) => {
  const [selectedIncomeType, setSelectedIncomeType] = useState<
    | "employment"
    | "rental"
    | "interest"
    | "dividend"
    | "business"
    | "other"
    | null
  >(null);
  const [selectedIncomeData, setSelectedIncomeData] = useState<any>(null);

  const formatCurrency = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined) return "Rs. 0.00";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return `Rs. ${num.toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleIncomeClick = (
    incomeType:
      | "employment"
      | "rental"
      | "interest"
      | "dividend"
      | "business"
      | "other",
    incomeData: any
  ) => {
    setSelectedIncomeType(incomeType);
    setSelectedIncomeData(incomeData);
  };

  const handleCloseModal = () => {
    setSelectedIncomeType(null);
    setSelectedIncomeData(null);
  };

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center space-x-3">
        <MdTrendingUp className="text-2xl text-blue-300" />
        <Text className="text-2xl font-bold text-white">Income Sources</Text>
      </div>

      <Grid columns="3" gap="6">
        {/* Employment Income */}
        {calculation.calculationData.sourceOfIncome?.employmentIncome && (
          <div
            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/10"
            onClick={() =>
              handleIncomeClick(
                "employment",
                calculation.calculationData.sourceOfIncome?.employmentIncome
              )
            }
          >
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400/20">
                <MdPerson className="text-lg text-blue-300" />
              </div>
              <Text className="font-semibold text-white">Employment</Text>
            </div>
            <div className="flex flex-col">
              <Text className="text-2xl font-bold text-blue-300">
                {formatCurrency(
                  calculation.calculationData.sourceOfIncome?.employmentIncome
                    ?.total
                )}
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                APIT:{" "}
                {formatCurrency(
                  calculation.calculationData.sourceOfIncome?.employmentIncome
                    ?.apitTotal
                )}
              </Text>
            </div>
          </div>
        )}

        {/* Rental Income */}
        {calculation.calculationData.sourceOfIncome?.rentalIncome && (
          <div
            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/10"
            onClick={() =>
              handleIncomeClick(
                "rental",
                calculation.calculationData.sourceOfIncome?.rentalIncome
              )
            }
          >
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-400/20">
                <MdReceipt className="text-lg text-green-300" />
              </div>
              <Text className="font-semibold text-white">Rental</Text>
            </div>
            <div className="flex flex-col">
              <Text className="text-2xl font-bold text-green-300">
                {formatCurrency(
                  calculation.calculationData.sourceOfIncome?.rentalIncome
                    ?.total
                )}
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                AIT:{" "}
                {formatCurrency(
                  calculation.calculationData.sourceOfIncome?.rentalIncome
                    ?.totalAit
                )}
              </Text>
            </div>
          </div>
        )}

        {/* Interest Income */}
        {calculation.calculationData.sourceOfIncome?.interestIncome && (
          <div
            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/10"
            onClick={() =>
              handleIncomeClick(
                "interest",
                calculation.calculationData.sourceOfIncome?.interestIncome
              )
            }
          >
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-400/20">
                <MdAccountBalance className="text-lg text-purple-300" />
              </div>
              <Text className="font-semibold text-white">Interest</Text>
            </div>
            <div className="flex flex-col">
              <Text className="text-2xl font-bold text-purple-300">
                {formatCurrency(
                  calculation.calculationData.sourceOfIncome?.interestIncome
                    ?.totalGrossInterest
                )}
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                AIT:{" "}
                {formatCurrency(
                  calculation.calculationData.sourceOfIncome?.interestIncome
                    ?.totalAit
                )}
              </Text>
            </div>
          </div>
        )}

        {/* Dividend Income */}
        {calculation.calculationData.sourceOfIncome?.dividendIncome && (
          <div
            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/10"
            onClick={() =>
              handleIncomeClick(
                "dividend",
                calculation.calculationData.sourceOfIncome?.dividendIncome
              )
            }
          >
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/20">
                <MdAttachMoney className="text-lg text-yellow-300" />
              </div>
              <Text className="font-semibold text-white">Dividend</Text>
            </div>
            <div className="flex flex-col">
              <Text className="text-2xl font-bold text-yellow-300">
                {formatCurrency(
                  calculation.calculationData.sourceOfIncome?.dividendIncome
                    ?.totalGrossDividend
                )}
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                AIT:{" "}
                {formatCurrency(
                  calculation.calculationData.sourceOfIncome?.dividendIncome
                    ?.totalAit
                )}
              </Text>
            </div>
          </div>
        )}

        {/* Business Income */}
        {calculation.calculationData.sourceOfIncome?.businessIncome && (
          <div
            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/10"
            onClick={() =>
              handleIncomeClick(
                "business",
                calculation.calculationData.sourceOfIncome?.businessIncome
              )
            }
          >
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-400/20">
                <MdBusiness className="text-lg text-red-300" />
              </div>
              <Text className="font-semibold text-white">Business</Text>
            </div>
            <Text className="text-2xl font-bold text-red-300">
              {formatCurrency(
                calculation.calculationData.sourceOfIncome?.businessIncome
                  ?.amountForAssessableIncome
              )}
            </Text>
            <br />
            <Text className="mt-1 text-sm text-gray-400">
              Total Income:{" "}
              {formatCurrency(
                calculation.calculationData.sourceOfIncome?.businessIncome
                  ?.total
              )}
            </Text>
          </div>
        )}

        {/* Other Income */}
        {calculation.calculationData.sourceOfIncome?.otherIncome && (
          <div
            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/10"
            onClick={() =>
              handleIncomeClick(
                "other",
                calculation.calculationData.sourceOfIncome?.otherIncome
              )
            }
          >
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-400/20">
                <MdTrendingUp className="text-lg text-indigo-300" />
              </div>
              <Text className="font-semibold text-white">Other</Text>
            </div>
            <Text className="text-2xl font-bold text-indigo-300">
              {formatCurrency(
                calculation.calculationData.sourceOfIncome?.otherIncome?.total
              )}
            </Text>
          </div>
        )}
      </Grid>

      {/* Total Assessable Income */}
      <div className="mt-6 rounded-xl border border-blue-400/20 bg-blue-400/10 p-6">
        <div className="flex items-center justify-between">
          <Text className="text-xl font-semibold text-white">
            Total Assessable Income
          </Text>
          <Text className="text-3xl font-bold text-blue-300">
            {formatCurrency(
              calculation.calculationData.sourceOfIncome?.totalAssessableIncome
            )}
          </Text>
        </div>
      </div>

      {/* Income Breakdown Modal */}
      <Modal
        isOpen={selectedIncomeType !== null}
        onClose={handleCloseModal}
        title=""
        maxWidth="1000px"
        closeOnOverlayClick={true}
        isDark={true}
      >
        {selectedIncomeType && selectedIncomeData && (
          <IncomeBreakdownModal
            incomeType={selectedIncomeType}
            incomeData={selectedIncomeData}
            calculation={calculation}
          />
        )}
      </Modal>
    </div>
  );
};

export default IncomeSources;
