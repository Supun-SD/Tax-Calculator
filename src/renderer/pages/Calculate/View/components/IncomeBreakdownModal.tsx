import { Text, Table } from "@radix-ui/themes";
import {
  MdPerson,
  MdAttachMoney,
  MdReceipt,
  MdAccountBalance,
  MdBusiness,
  MdTrendingUp,
  MdAccountBalanceWallet,
  MdSecurity,
  MdCreditCard,
  MdCalculate,
} from "react-icons/md";
import {
  Calculation,
  EmploymentIncome,
  EmploymentIncomeRecord,
  RentalIncome,
  RentalIncomeRecord,
  InterestIncome,
  FdIncomeRecord,
  DividendIncome,
  DividendIncomeRecord,
  BusinessIncome,
  BusinessIncomeRecord,
  OtherIncome,
  OtherIncomeRecord,
} from "../../../../../types/calculation";
import { useState } from "react";

interface IncomeBreakdownModalProps {
  incomeType:
    | "employment"
    | "rental"
    | "interest"
    | "dividend"
    | "business"
    | "other";
  incomeData: any;
  calculation: Calculation;
}

const IncomeBreakdownModal = ({
  incomeType,
  incomeData,
  calculation,
}: IncomeBreakdownModalProps) => {
  const formatCurrency = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined) return "Rs. 0.00";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return `Rs. ${num.toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getIncomeTypeInfo = () => {
    switch (incomeType) {
      case "employment":
        return {
          title: "Employment Income Breakdown",
          icon: <MdPerson className="text-2xl text-blue-400" />,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
        };
      case "rental":
        return {
          title: "Rental Income Breakdown",
          icon: <MdReceipt className="text-2xl text-green-400" />,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
        };
      case "interest":
        return {
          title: "Interest Income Breakdown",
          icon: <MdAccountBalance className="text-2xl text-purple-400" />,
          color: "text-purple-400",
          bgColor: "bg-purple-500/20",
        };
      case "dividend":
        return {
          title: "Dividend Income Breakdown",
          icon: <MdAttachMoney className="text-2xl text-yellow-400" />,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
        };
      case "business":
        return {
          title: "Business Income Breakdown",
          icon: <MdBusiness className="text-2xl text-red-400" />,
          color: "text-red-400",
          bgColor: "bg-red-500/20",
        };
      case "other":
        return {
          title: "Other Income Breakdown",
          icon: <MdTrendingUp className="text-2xl text-indigo-400" />,
          color: "text-indigo-400",
          bgColor: "bg-indigo-500/20",
        };
    }
  };

  const renderEmploymentBreakdown = () => {
    const data = incomeData as EmploymentIncome;
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4">
          <div className="flex items-center justify-between">
            <Text className="font-semibold text-white">
              Total Employment Income
            </Text>
            <Text className="text-2xl font-bold text-blue-400">
              {formatCurrency(data.total)}
            </Text>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Text className="text-gray-400">Total APIT</Text>
            <Text className="text-lg font-semibold text-blue-300">
              {formatCurrency(data.apitTotal)}
            </Text>
          </div>
        </div>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Income Name
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Value
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Multiplier
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Total
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                APIT
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.incomes.map(
              (income: EmploymentIncomeRecord, index: number) => (
                <Table.Row key={index}>
                  <Table.Cell className="border-b border-white/10 text-white">
                    {income.name}
                  </Table.Cell>
                  <Table.Cell className="border-b border-white/10 text-white">
                    {formatCurrency(income.value)}
                  </Table.Cell>
                  <Table.Cell className="border-b border-white/10 text-white">
                    {income.multiplier}
                  </Table.Cell>
                  <Table.Cell className="border-b border-white/10 font-semibold text-white">
                    {formatCurrency(income.total)}
                  </Table.Cell>
                  <Table.Cell className="border-b border-white/10 text-white">
                    {formatCurrency(income.apit)}
                  </Table.Cell>
                </Table.Row>
              )
            )}
          </Table.Body>
        </Table.Root>
      </div>
    );
  };

  const renderRentalBreakdown = () => {
    const data = incomeData as RentalIncome;
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/20 to-green-600/20 p-4">
          <div className="flex items-center justify-between">
            <Text className="font-semibold text-white">
              Total Rental Income
            </Text>
            <Text className="text-2xl font-bold text-green-400">
              {formatCurrency(data.total)}
            </Text>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Text className="text-gray-400">
              Total AIT (
              {calculation.calculationData.settings.reliefsAndAit.whtRent}%)
            </Text>
            <Text className="text-lg font-semibold text-green-300">
              {formatCurrency(data.totalAit)}
            </Text>
          </div>
        </div>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Property Name
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Value
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Multiplier
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Total
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                AIT Deducted
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                AIT
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.incomes.map((income: RentalIncomeRecord, index: number) => (
              <Table.Row key={index}>
                <Table.Cell className="border-b border-white/10 text-white">
                  {income.name}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {formatCurrency(income.value)}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {income.multiplier}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 font-semibold text-white">
                  {formatCurrency(income.total)}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {income.aitDeducted ? "Yes" : "No"}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {income.aitDeducted ? formatCurrency(income.ait) : "-"}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    );
  };

  const renderInterestBreakdown = () => {
    const data = incomeData as InterestIncome;
    const [activeTab, setActiveTab] = useState<
      "fd" | "repo" | "unitTrust" | "treasuryBill" | "tBond" | "debenture"
    >("fd");

    const getTabInfo = (tab: string) => {
      switch (tab) {
        case "fd":
          return {
            title: "Fixed Deposit",
            icon: <MdAccountBalanceWallet className="text-lg" />,
            color: "text-orange-300",
            bgColor: "bg-orange-400/20",
            borderColor: "border-orange-400/30",
            data: data.fdIncome,
          };
        case "repo":
          return {
            title: "Repo",
            icon: <MdBusiness className="text-lg" />,
            color: "text-blue-300",
            bgColor: "bg-blue-400/20",
            borderColor: "border-blue-400/30",
            data: data.repoIncome,
          };
        case "unitTrust":
          return {
            title: "Unit Trust",
            icon: <MdTrendingUp className="text-lg" />,
            color: "text-green-300",
            bgColor: "bg-green-400/20",
            borderColor: "border-green-400/30",
            data: data.unitTrustIncome,
          };
        case "treasuryBill":
          return {
            title: "Treasury Bill",
            icon: <MdSecurity className="text-lg" />,
            color: "text-yellow-300",
            bgColor: "bg-yellow-400/20",
            borderColor: "border-yellow-400/30",
            data: data.treasuryBillIncome,
          };
        case "tBond":
          return {
            title: "T-Bond",
            icon: <MdCreditCard className="text-lg" />,
            color: "text-indigo-300",
            bgColor: "bg-indigo-400/20",
            borderColor: "border-indigo-400/30",
            data: data.tBondIncome,
          };
        case "debenture":
          return {
            title: "Debenture",
            icon: <MdReceipt className="text-lg" />,
            color: "text-red-300",
            bgColor: "bg-red-400/20",
            borderColor: "border-red-400/30",
            data: data.debentureIncome,
          };
        default:
          return null;
      }
    };

    const renderFdTable = () => {
      const fdData = data.fdIncome;
      if (!fdData || !fdData.incomes || fdData.incomes.length === 0) {
        return (
          <div className="py-8 text-center text-gray-400">
            <Text>No Fixed Deposit income data available</Text>
          </div>
        );
      }

      return (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Bank
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Account/Certificate
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Joint
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Gross Interest
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Contribution
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                AIT
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {fdData.incomes.map((income: FdIncomeRecord, index: number) => (
              <Table.Row key={index}>
                <Table.Cell className="border-b border-white/10 text-white">
                  <div>
                    <div className="font-semibold">{income.bank.name}</div>
                    <div className="text-sm text-gray-400">
                      TIN: {income.bank.tinNumber}
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {income.certificateNumber || income.accountNumber}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {income.isJoint ? "Yes" : "No"}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 font-semibold text-white">
                  {formatCurrency(income.grossInterest)}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {formatCurrency(income.contribution)}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {formatCurrency(income.ait)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Body>
            <Table.Row className="bg-white/10">
              <Table.Cell
                colSpan={4}
                className="rounded-bl-xl border-t-2 border-white/20 font-bold text-white"
              >
                <div className="flex items-center space-x-2 py-2">
                  <MdCalculate className="text-orange-300" />
                  <span>Total</span>
                </div>
              </Table.Cell>
              <Table.Cell className="border-t-2 border-white/20 align-middle font-bold text-orange-300">
                {formatCurrency(fdData.total)}
              </Table.Cell>
              <Table.Cell className="rounded-br-xl border-t-2 border-white/20 align-middle font-bold text-orange-300">
                {formatCurrency(fdData.ait)}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      );
    };

    const renderOtherTable = (
      type: "repo" | "unitTrust" | "treasuryBill" | "tBond" | "debenture"
    ) => {
      const tabInfo = getTabInfo(type);
      const otherData = tabInfo?.data;

      if (!otherData || !otherData.incomes || otherData.incomes.length === 0) {
        return (
          <div className="py-8 text-center text-gray-400">
            <Text>No {tabInfo?.title} income data available</Text>
          </div>
        );
      }

      return (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Company Name
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Certificate Number
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Value
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                AIT
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {otherData.incomes.map((income: any, index: number) => (
              <Table.Row key={index}>
                <Table.Cell className="border-b border-white/10 font-semibold text-white">
                  {income.companyName}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {income.certificateNumber}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 font-semibold text-white">
                  {formatCurrency(income.value)}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {formatCurrency(income.ait)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Body>
            <Table.Row className="bg-white/10">
              <Table.Cell
                colSpan={2}
                className="rounded-bl-xl border-t-2 border-white/20 font-bold text-white"
              >
                <div className="flex items-center space-x-2 py-2">
                  <MdCalculate className={tabInfo?.color} />
                  <span>Total</span>
                </div>
              </Table.Cell>
              <Table.Cell
                className={`${tabInfo?.color} border-t-2 border-white/20 align-middle font-bold`}
              >
                {formatCurrency(otherData.total)}
              </Table.Cell>
              <Table.Cell
                className={`${tabInfo?.color} rounded-br-xl border-t-2 border-white/20 align-middle font-bold`}
              >
                {formatCurrency(otherData.ait)}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      );
    };

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-purple-600/20 p-4">
          <div className="flex items-center justify-between">
            <Text className="font-semibold text-white">
              Total Gross Interest
            </Text>
            <Text className="text-2xl font-bold text-purple-400">
              {formatCurrency(
                data.totalGrossInterest +
                  ((data.applyManagementFee ? data.managementFee : 0) ?? 0)
              )}
            </Text>
          </div>
          {data.applyManagementFee && (data.managementFee ?? 0) > 0 && (
            <div className="mt-2 flex items-center justify-between">
              <Text className="text-gray-400">Management Fee</Text>
              <Text className="text-lg font-semibold text-red-300">
                - {formatCurrency(data.managementFee ?? 0)}
              </Text>
            </div>
          )}
          {data.applyManagementFee && (data.managementFee ?? 0) > 0 && (
            <div className="mt-2 flex items-center justify-between">
              <Text className="font-semibold text-white">Net Interest</Text>
              <Text className="text-lg font-semibold text-purple-300">
                {formatCurrency(data.totalGrossInterest)}
              </Text>
            </div>
          )}
          <div className="mt-2 flex items-center justify-between">
            <Text className="text-gray-400">
              Total AIT (
              {calculation.calculationData.settings.reliefsAndAit.aitInterest}%)
            </Text>
            <Text className="text-lg font-semibold text-purple-300">
              {formatCurrency(data.totalAit)}
            </Text>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex space-x-1">
            {[
              "fd",
              "repo",
              "unitTrust",
              "treasuryBill",
              "tBond",
              "debenture",
            ].map((tab) => {
              const tabInfo = getTabInfo(tab);
              if (!tabInfo || !tabInfo.data) return null;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-all duration-200 ${
                    activeTab === tab
                      ? `${tabInfo.bgColor} ${tabInfo.color} border ${tabInfo.borderColor}`
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {tabInfo.icon}
                  <span>{tabInfo.title}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="rounded-xl border border-white/10 bg-white/5">
            {activeTab === "fd" && renderFdTable()}
            {activeTab === "repo" && renderOtherTable("repo")}
            {activeTab === "unitTrust" && renderOtherTable("unitTrust")}
            {activeTab === "treasuryBill" && renderOtherTable("treasuryBill")}
            {activeTab === "tBond" && renderOtherTable("tBond")}
            {activeTab === "debenture" && renderOtherTable("debenture")}
          </div>
        </div>
      </div>
    );
  };

  const renderDividendBreakdown = () => {
    const data = incomeData as DividendIncome;
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 p-4">
          <div className="flex items-center justify-between">
            <Text className="font-semibold text-white">
              Total Gross Dividend
            </Text>
            <Text className="text-2xl font-bold text-yellow-400">
              {formatCurrency(data.totalGrossDividend)}
            </Text>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Text className="text-gray-400">Total AIT</Text>
            <Text className="text-lg font-semibold text-yellow-300">
              {formatCurrency(data.totalAit)}
            </Text>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Text className="text-gray-400">Total Exempted</Text>
            <Text className="text-lg font-semibold text-yellow-300">
              {formatCurrency(data.totalExempted)}
            </Text>
          </div>
        </div>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Company
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Gross Dividend
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Rate (%)
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                AIT
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Exempted
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.incomes.map((income: DividendIncomeRecord, index: number) => (
              <Table.Row key={index}>
                <Table.Cell className="border-b border-white/10 font-semibold text-white">
                  {income.companyName}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 font-semibold text-white">
                  {formatCurrency(income.grossDividend)}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {income.rate}%
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {formatCurrency(income.ait)}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {formatCurrency(income.exempted)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    );
  };

  const renderBusinessBreakdown = () => {
    const data = incomeData as BusinessIncome;
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-red-500/30 bg-gradient-to-r from-red-500/20 to-red-600/20 p-4">
          <div className="flex items-center justify-between">
            <Text className="font-semibold text-white">
              Total Business Income
            </Text>
            <Text className="text-2xl font-bold text-red-400">
              {formatCurrency(data.total)}
            </Text>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Text className="text-gray-400">WHT on Professional Fee</Text>
            <Text className="text-lg font-semibold text-red-300">
              {formatCurrency(data.whtTotal)}
            </Text>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Text className="text-gray-400">
              Expenses Amount ({100 - data.assessableIncomePercentage}%)
            </Text>
            <Text className="text-lg font-semibold text-red-300">
              {formatCurrency(data.total - data.amountForAssessableIncome)}
            </Text>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Text className="text-gray-400">
              Amount for Assessable Income ({data.assessableIncomePercentage}%)
            </Text>
            <Text className="text-lg font-semibold text-red-300">
              {formatCurrency(data.amountForAssessableIncome)}
            </Text>
          </div>
        </div>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Hospital Name
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Value
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                WHT on Professional Fee
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.incomes.map((income: BusinessIncomeRecord, index: number) => (
              <Table.Row key={index}>
                <Table.Cell className="border-b border-white/10 font-semibold text-white">
                  {income.hospitalName}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {formatCurrency(income.value)}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 text-white">
                  {formatCurrency(income.wht)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    );
  };

  const renderOtherBreakdown = () => {
    const data = incomeData as OtherIncome;
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 p-4">
          <div className="flex items-center justify-between">
            <Text className="font-semibold text-white">Total Other Income</Text>
            <Text className="text-2xl font-bold text-indigo-400">
              {formatCurrency(data.total)}
            </Text>
          </div>
        </div>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Income Type
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border-b border-white/20 text-white">
                Value
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.incomes.map((income: OtherIncomeRecord, index: number) => (
              <Table.Row key={index}>
                <Table.Cell className="border-b border-white/10 font-semibold text-white">
                  {income.incomeType}
                </Table.Cell>
                <Table.Cell className="border-b border-white/10 font-semibold text-white">
                  {formatCurrency(income.value)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    );
  };

  const renderBreakdown = () => {
    switch (incomeType) {
      case "employment":
        return renderEmploymentBreakdown();
      case "rental":
        return renderRentalBreakdown();
      case "interest":
        return renderInterestBreakdown();
      case "dividend":
        return renderDividendBreakdown();
      case "business":
        return renderBusinessBreakdown();
      case "other":
        return renderOtherBreakdown();
      default:
        return <Text className="text-white">No data available</Text>;
    }
  };

  const typeInfo = getIncomeTypeInfo();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div
          className={`h-12 w-12 ${typeInfo.bgColor} flex items-center justify-center rounded-lg`}
        >
          {typeInfo.icon}
        </div>
        <Text className="text-xl font-bold text-white">{typeInfo.title}</Text>
      </div>

      {renderBreakdown()}
    </div>
  );
};

export default IncomeBreakdownModal;
