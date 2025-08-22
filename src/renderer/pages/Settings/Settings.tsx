import Navigation from '../../components/Navigation';
import Input from '../../components/Input';
import { TbFileImport, TbFileExport } from 'react-icons/tb';
import { FiSave } from 'react-icons/fi';
import Button from '../../components/Button';
import { useState, useMemo, useEffect } from 'react';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { Settings } from '../../../types/settings';
import { ClipLoader } from 'react-spinners';
import { CalculationService } from '../../services/calculationService';

const SettingsPage = () => {
  const {
    settings,
    loading,
    error,
    isUpdating,
    updateSettings
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

  // Update local state when settings are loaded
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

  // Check if any changes have been made
  const hasChanges = useMemo(() => {
    if (!settings) return false;

    const reliefsChanged =
      reliefsAndAit.personalRelief !==
      settings.reliefsAndAit.personalRelief ||
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
    // Convert all reliefs and AIT fields to numbers
    const numericValue = value.replace(/[^\d.]/g, '');
    const number = CalculationService.parseAndRound(numericValue);

    // Allow empty values (0) for clearing inputs
    if (numericValue === '' || number === 0) {
      setReliefsAndAit((prev) => ({
        ...prev,
        [field]: 0,
      }));
      return;
    }

    // Validate percentage fields (fields with % suffix) to be between 0 and 100
    const percentageFields = [
      'aitInterest',
      'rentRelief',
      'aitDividend',
      'whtRent',
      'aitBusinessIncome',
      'foreignIncomeRate',
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
    // Convert all tax rate fields to numbers
    const numericValue = value.replace(/[^\d.]/g, '');
    const number = CalculationService.parseAndRound(numericValue);

    // Allow empty values (0) for clearing inputs
    if (numericValue === '' || number === 0) {
      setTaxRates((prev) => ({
        ...prev,
        [field]: 0,
      }));
      return;
    }

    // Validate all tax rate fields to be between 1 and 100 (they are all percentages)
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
        <div className="mt-4 flex items-center justify-center h-60">
          <div className="text-white"><ClipLoader color="#fff" size={32} /></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Navigation title="Settings" />
        <div className="mt-4 flex items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
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
      <div className="mt-4 grid w-full grid-cols-2 gap-4">
        <div className="col-span-1 rounded-[30px] bg-surface p-12">
          <h3 className="mb-6 text-lg font-semibold text-white">
            Reliefs and AIT
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Input
                label="Personal relief"
                type="text"
                value={reliefsAndAit.personalRelief.toString()}
                onChange={(e) =>
                  handleReliefsAndAitChange('personalRelief', e.target.value)
                }
                prefix="Rs"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="AIT on interest"
                type="text"
                value={reliefsAndAit.aitInterest.toString()}
                onChange={(e) =>
                  handleReliefsAndAitChange('aitInterest', e.target.value)
                }
                suffix="%"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Rent relief"
                type="text"
                value={reliefsAndAit.rentRelief.toString()}
                onChange={(e) =>
                  handleReliefsAndAitChange('rentRelief', e.target.value)
                }
                suffix="%"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="AIT on dividend"
                type="text"
                value={reliefsAndAit.aitDividend.toString()}
                onChange={(e) =>
                  handleReliefsAndAitChange('aitDividend', e.target.value)
                }
                suffix="%"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="WHT on rent"
                type="text"
                value={reliefsAndAit.whtRent.toString()}
                onChange={(e) =>
                  handleReliefsAndAitChange('whtRent', e.target.value)
                }
                suffix="%"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Foreign income tax rate"
                type="text"
                value={reliefsAndAit.foreignIncomeRate.toString()}
                onChange={(e) =>
                  handleReliefsAndAitChange('foreignIncomeRate', e.target.value)
                }
                suffix="%"
              />
            </div>
          </div>
        </div>
        <div className="col-span-1 rounded-[30px] bg-surface p-12">
          <h3 className="mb-6 text-lg font-semibold text-white">Tax Rates</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Input
                label="Tax for 1st Rs 500,000"
                type="text"
                value={taxRates.first.toString()}
                onChange={(e) => handleTaxRatesChange('first', e.target.value)}
                suffix="%"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Tax for 2nd Rs 500,000"
                type="text"
                value={taxRates.second.toString()}
                onChange={(e) => handleTaxRatesChange('second', e.target.value)}
                suffix="%"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Tax for 3rd Rs 500,000"
                type="text"
                value={taxRates.third.toString()}
                onChange={(e) => handleTaxRatesChange('third', e.target.value)}
                suffix="%"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Tax for 4th Rs 500,000"
                type="text"
                value={taxRates.fourth.toString()}
                onChange={(e) => handleTaxRatesChange('fourth', e.target.value)}
                suffix="%"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Tax for 5th Rs 500,000"
                type="text"
                value={taxRates.fifth.toString()}
                onChange={(e) => handleTaxRatesChange('fifth', e.target.value)}
                suffix="%"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Tax for > Rs 2,500,000"
                type="text"
                value={taxRates.other.toString()}
                onChange={(e) => handleTaxRatesChange('other', e.target.value)}
                suffix="%"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-3">
        <Button
          type="button"
          variant="primary"
          icon={FiSave}
          disabled={!hasChanges || isUpdating}
          onClick={() => handleSaveSettings()}
        >
          {isUpdating ? 'Saving...' : 'Save'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          icon={TbFileExport}
          onClick={handleSaveSettings}
          disabled
        >
          Export Data
        </Button>
        <Button
          type="button"
          variant="secondary"
          icon={TbFileImport}
          onClick={() => handleSaveSettings()}
          disabled
        >
          Import Data
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
