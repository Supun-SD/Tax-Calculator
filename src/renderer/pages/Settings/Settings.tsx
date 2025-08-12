import Navigation from '../../components/Navigation';
import Input from '../../components/Input';
import { TbFileImport, TbFileExport } from 'react-icons/tb';
import { FiSave } from 'react-icons/fi';
import Button from '../../components/Button';
import { settings as mockSettings } from '../../../../mockdata/settings';
import { useState, useMemo } from 'react';
import { Bounce, toast } from 'react-toastify';

const Settings = () => {
    const initialSettings = mockSettings;

    const notify = () =>
        toast.success('Settings saved', {
            position: 'bottom-right',
            pauseOnHover: false,
            autoClose: 4000,
            theme: 'colored',
            transition: Bounce,
        });

    const [reliefsAndAit, setReliefsAndAit] = useState({
        personalRelief: initialSettings.reliefsAndAit.personalRelief,
        aitInterest: initialSettings.reliefsAndAit.aitInterest,
        rentRelief: initialSettings.reliefsAndAit.rentRelief,
        aitDividend: initialSettings.reliefsAndAit.aitDividend,
        whtRent: initialSettings.reliefsAndAit.whtRent,
        aitBusinessIncome: initialSettings.reliefsAndAit.aitBusinessIncome,
    });

    const [taxRates, setTaxRates] = useState({
        first: initialSettings.taxRates.first,
        second: initialSettings.taxRates.second,
        third: initialSettings.taxRates.third,
        fourth: initialSettings.taxRates.fourth,
        fifth: initialSettings.taxRates.fifth,
        other: initialSettings.taxRates.other,
    });

    // Check if any changes have been made
    const hasChanges = useMemo(() => {
        const reliefsChanged =
            reliefsAndAit.personalRelief !==
            initialSettings.reliefsAndAit.personalRelief ||
            reliefsAndAit.aitInterest !== initialSettings.reliefsAndAit.aitInterest ||
            reliefsAndAit.rentRelief !== initialSettings.reliefsAndAit.rentRelief ||
            reliefsAndAit.aitDividend !== initialSettings.reliefsAndAit.aitDividend ||
            reliefsAndAit.whtRent !== initialSettings.reliefsAndAit.whtRent ||
            reliefsAndAit.aitBusinessIncome !==
            initialSettings.reliefsAndAit.aitBusinessIncome;

        const taxRatesChanged =
            taxRates.first !== initialSettings.taxRates.first ||
            taxRates.second !== initialSettings.taxRates.second ||
            taxRates.third !== initialSettings.taxRates.third ||
            taxRates.fourth !== initialSettings.taxRates.fourth ||
            taxRates.fifth !== initialSettings.taxRates.fifth ||
            taxRates.other !== initialSettings.taxRates.other;

        return reliefsChanged || taxRatesChanged;
    }, [reliefsAndAit, taxRates, initialSettings]);

    const handleReliefsAndAitChange = (field: string, value: string) => {
        // Convert all reliefs and AIT fields to numbers
        const numericValue = value.replace(/[^\d.]/g, '');
        const number = parseFloat(numericValue) || 0;

        // Validate percentage fields (fields with % suffix) to be between 1 and 100
        const percentageFields = [
            'aitInterest',
            'rentRelief',
            'aitDividend',
            'whtRent',
            'aitBusinessIncome',
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
            [field]: number,
        }));
    };

    const handleTaxRatesChange = (field: string, value: string) => {
        // Convert all tax rate fields to numbers
        const numericValue = value.replace(/[^\d.]/g, '');
        const number = parseFloat(numericValue) || 0;

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
            [field]: number,
        }));
    };

    const getCurrentValues = () => {
        return {
            reliefsAndAit,
            taxRates,
        };
    };

    const handleSaveSettings = () => {
        try {
            const currentValues = getCurrentValues();
            // TODO: Implement actual save functionality
            notify();
        } catch (error) {
            toast.error('Failed to save settings', {
                position: 'bottom-right',
                pauseOnHover: false,
                autoClose: 4000,
                theme: 'colored',
                transition: Bounce,
            });
        }
    };

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
                                label="AIT on business income"
                                type="text"
                                value={reliefsAndAit.aitBusinessIncome.toString()}
                                onChange={(e) =>
                                    handleReliefsAndAitChange('aitBusinessIncome', e.target.value)
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
                    disabled={!hasChanges}
                    onClick={notify}
                >
                    Save
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    icon={TbFileExport}
                    onClick={handleSaveSettings}
                >
                    Export Data
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    icon={TbFileImport}
                    onClick={() => handleSaveSettings()}
                >
                    Import Data
                </Button>
            </div>
        </div>
    );
};

export default Settings;
