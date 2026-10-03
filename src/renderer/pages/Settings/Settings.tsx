import Navigation from "../../components/Navigation";
import Input from "../../components/Input";
import { TbFileImport, TbFileExport, TbReload } from "react-icons/tb";
import { FiSave } from "react-icons/fi";
import {
  MdAttachMoney,
  MdPercent,
  MdTrendingUp,
  MdCalculate,
  MdReceipt,
} from "react-icons/md";
import Button from "../../components/Button";
import { useState, useMemo, useEffect } from "react";
import { useSettingsContext } from "../../contexts/SettingsContext";
import { Settings } from "../../../types/settings";
import { ClipLoader } from "react-spinners";
import { CalculationService } from "../../services/calculationService";

const SettingsPage = () => {
  const {
    settings,
    loading,
    error,
    isUpdating,
    updateSettings,
    refreshSettings,
  } = useSettingsContext();

  const [reliefsAndAit, setReliefsAndAit] = useState({
    personalRelief: 0,
    aitInterest: 0,
    rentRelief: 0,
    aitDividend: 0,
    whtRent: 0,
    foreignIncomeRate: 0,
  });

  const [taxRates, setTaxRates] = useState({
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
    fifth: 0,
    other: 0,
  });

  useEffect(() => {
    if (settings) {
      setReliefsAndAit({
        personalRelief: settings.reliefsAndAit.personalRelief,
        aitInterest: settings.reliefsAndAit.aitInterest,
        rentRelief: settings.reliefsAndAit.rentRelief,
        aitDividend: settings.reliefsAndAit.aitDividend,
        whtRent: settings.reliefsAndAit.whtRent,
        foreignIncomeRate: settings.reliefsAndAit.foreignIncomeTaxRate,
      });

      setTaxRates({
        first: settings.taxRates.first,
        second: settings.taxRates.second,
        third: settings.taxRates.third,
        fourth: settings.taxRates.fourth,
        fifth: settings.taxRates.fifth,
        other: settings.taxRates.other,
      });
    }
  }, [settings]);

  const hasChanges = useMemo(() => {
    if (!settings) return false;

    const reliefsChanged =
      reliefsAndAit.personalRelief !== settings.reliefsAndAit.personalRelief ||
      reliefsAndAit.aitInterest !== settings.reliefsAndAit.aitInterest ||
      reliefsAndAit.rentRelief !== settings.reliefsAndAit.rentRelief ||
      reliefsAndAit.aitDividend !== settings.reliefsAndAit.aitDividend ||
      reliefsAndAit.whtRent !== settings.reliefsAndAit.whtRent ||
      reliefsAndAit.foreignIncomeRate !==
        settings.reliefsAndAit.foreignIncomeTaxRate;

    const taxRatesChanged =
      taxRates.first !== settings.taxRates.first ||
      taxRates.second !== settings.taxRates.second ||
      taxRates.third !== settings.taxRates.third ||
      taxRates.fourth !== settings.taxRates.fourth ||
      taxRates.fifth !== settings.taxRates.fifth ||
      taxRates.other !== settings.taxRates.other;

    return reliefsChanged || taxRatesChanged;
  }, [reliefsAndAit, taxRates, settings]);

  const handleReliefsAndAitChange = (field: string, value: string) => {
    const numericValue = value.replace(/[^\d.]/g, "");
    const number = CalculationService.parseAndRound(numericValue);

    if (numericValue === "" || number === 0) {
      setReliefsAndAit((prev) => ({
        ...prev,
        [field]: 0,
      }));
      return;
    }

    const percentageFields = [
      "aitInterest",
      "rentRelief",
      "aitDividend",
      "whtRent",
      "aitBusinessIncome",
      "foreignIncomeRate",
    ];
    if (percentageFields.includes(field)) {
      if (number < 0) {
        setReliefsAndAit((prev) => ({
          ...prev,
          [field]: 0,
        }));
        return;
      }
      if (number > 100) {
        setReliefsAndAit((prev) => ({
          ...prev,
          [field]: 100,
        }));
        return;
      }
    }

    setReliefsAndAit((prev) => ({
      ...prev,
      [field]: CalculationService.parseAndRoundWhole(number),
    }));
  };

  const handleTaxRatesChange = (field: string, value: string) => {
    const numericValue = value.replace(/[^\d.]/g, "");
    const number = CalculationService.parseAndRound(numericValue);

    if (numericValue === "" || number === 0) {
      setTaxRates((prev) => ({
        ...prev,
        [field]: 0,
      }));
      return;
    }

    if (number < 1) {
      setTaxRates((prev) => ({
        ...prev,
        [field]: 1,
      }));
      return;
    }
    if (number > 100) {
      setTaxRates((prev) => ({
        ...prev,
        [field]: 100,
      }));
      return;
    }

    setTaxRates((prev) => ({
      ...prev,
      [field]: CalculationService.parseAndRoundWhole(number),
    }));
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    const updatedSettings: Settings = {
      ...settings,
      reliefsAndAit: {
        ...settings.reliefsAndAit,
        personalRelief: reliefsAndAit.personalRelief,
        aitInterest: reliefsAndAit.aitInterest,
        rentRelief: reliefsAndAit.rentRelief,
        aitDividend: reliefsAndAit.aitDividend,
        whtRent: reliefsAndAit.whtRent,
        foreignIncomeTaxRate: reliefsAndAit.foreignIncomeRate,
      },
      taxRates: {
        ...settings.taxRates,
        first: taxRates.first,
        second: taxRates.second,
        third: taxRates.third,
        fourth: taxRates.fourth,
        fifth: taxRates.fifth,
        other: taxRates.other,
      },
    };

    await updateSettings(updatedSettings);
  };

  if (loading) {
    return (
      <div className="p-8">
        <Navigation title="Settings" />
        <div className="mt-4 flex h-60 items-center justify-center">
          <div className="text-white">
            <ClipLoader color="#fff" size={32} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Navigation title="Settings" />
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
          <div className="text-center text-red-500">Error: {error}</div>
          <Button
            type="button"
            variant="secondary"
            icon={TbReload}
            onClick={() => refreshSettings()}
            disabled={loading}
          >
            {loading ? "Reloading..." : "Reload Settings"}
          </Button>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-8">
        <Navigation title="Settings" />
        <div className="mt-4 flex items-center justify-center">
          <div className="text-white">No settings found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Navigation title="Settings" />

      <div className="mt-16 grid w-full grid-cols-1 gap-8 px-16 lg:grid-cols-2">
        {/* Reliefs and AIT Section */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-400/20">
              <MdAttachMoney className="text-lg text-green-300" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Reliefs and AIT
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MdReceipt className="text-sm text-green-300" />
                <label className="text-sm font-medium text-gray-300">
                  Personal relief
                </label>
              </div>
              <Input
                label=""
                type="text"
                value={reliefsAndAit.personalRelief.toString()}
                onChange={(e) =>
                  handleReliefsAndAitChange("personalRelief", e.target.value)
                }
                prefix="Rs"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MdPercent className="text-sm text-blue-300" />
                <label className="text-sm font-medium text-gray-300">
                  AIT on interest
                </label>
              </div>
              <Input
                label=""
                type="text"
                value={reliefsAndAit.aitInterest.toString()}
                onChange={(e) =>
                  handleReliefsAndAitChange("aitInterest", e.target.value)
                }
                suffix="%"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MdPercent className="text-sm text-green-300" />
                <label className="text-sm font-medium text-gray-300">
                  Rent relief
                </label>
              </div>
              <Input
                label=""
                type="text"
                value={reliefsAndAit.rentRelief.toString()}
                onChange={(e) =>
                  handleReliefsAndAitChange("rentRelief", e.target.value)
                }
                suffix="%"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MdPercent className="text-sm text-yellow-300" />
                <label className="text-sm font-medium text-gray-300">
                  AIT on dividend
                </label>
              </div>
              <Input
                label=""
                type="text"
                value={reliefsAndAit.aitDividend.toString()}
                onChange={(e) =>
                  handleReliefsAndAitChange("aitDividend", e.target.value)
                }
                suffix="%"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MdPercent className="text-sm text-purple-300" />
                <label className="text-sm font-medium text-gray-300">
                  WHT on rent
                </label>
              </div>
              <Input
                label=""
                type="text"
                value={reliefsAndAit.whtRent.toString()}
                onChange={(e) =>
                  handleReliefsAndAitChange("whtRent", e.target.value)
                }
                suffix="%"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MdPercent className="text-sm text-red-300" />
                <label className="text-sm font-medium text-gray-300">
                  Foreign income tax rate
                </label>
              </div>
              <Input
                label=""
                type="text"
                value={reliefsAndAit.foreignIncomeRate.toString()}
                onChange={(e) =>
                  handleReliefsAndAitChange("foreignIncomeRate", e.target.value)
                }
                suffix="%"
              />
            </div>
          </div>
        </div>

        {/* Tax Rates Section */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400/20">
              <MdCalculate className="text-lg text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold text-white">Tax Rates</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MdTrendingUp className="text-sm text-blue-300" />
                <label className="text-sm font-medium text-gray-300">
                  1st Rs 500,000
                </label>
              </div>
              <Input
                label=""
                type="text"
                value={taxRates.first.toString()}
                onChange={(e) => handleTaxRatesChange("first", e.target.value)}
                suffix="%"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MdTrendingUp className="text-sm text-green-300" />
                <label className="text-sm font-medium text-gray-300">
                  2nd Rs 500,000
                </label>
              </div>
              <Input
                label=""
                type="text"
                value={taxRates.second.toString()}
                onChange={(e) => handleTaxRatesChange("second", e.target.value)}
                suffix="%"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MdTrendingUp className="text-sm text-yellow-300" />
                <label className="text-sm font-medium text-gray-300">
                  3rd Rs 500,000
                </label>
              </div>
              <Input
                label=""
                type="text"
                value={taxRates.third.toString()}
                onChange={(e) => handleTaxRatesChange("third", e.target.value)}
                suffix="%"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MdTrendingUp className="text-sm text-purple-300" />
                <label className="text-sm font-medium text-gray-300">
                  4th Rs 500,000
                </label>
              </div>
              <Input
                label=""
                type="text"
                value={taxRates.fourth.toString()}
                onChange={(e) => handleTaxRatesChange("fourth", e.target.value)}
                suffix="%"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MdTrendingUp className="text-sm text-red-300" />
                <label className="text-sm font-medium text-gray-300">
                  5th Rs 500,000
                </label>
              </div>
              <Input
                label=""
                type="text"
                value={taxRates.fifth.toString()}
                onChange={(e) => handleTaxRatesChange("fifth", e.target.value)}
                suffix="%"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MdTrendingUp className="text-sm text-indigo-300" />
                <label className="text-sm font-medium text-gray-300">
                  &gt; Rs 2,500,000
                </label>
              </div>
              <Input
                label=""
                type="text"
                value={taxRates.other.toString()}
                onChange={(e) => handleTaxRatesChange("other", e.target.value)}
                suffix="%"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex justify-center gap-4">
        <Button
          type="button"
          variant="primary"
          icon={FiSave}
          disabled={!hasChanges || isUpdating}
          onClick={() => handleSaveSettings()}
          className="bg-green-500 text-white hover:bg-green-600"
        >
          {isUpdating ? "Saving..." : "Save Settings"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          icon={TbFileExport}
          onClick={handleSaveSettings}
          disabled
          className="border border-blue-500/30 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
        >
          Export Data
        </Button>

        <Button
          type="button"
          variant="secondary"
          icon={TbFileImport}
          onClick={() => handleSaveSettings()}
          disabled
          className="border border-purple-500/30 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
        >
          Import Data
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
