import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from '../../../components/Navigation';
import { Flex, Grid, Separator, Text, AlertDialog } from '@radix-ui/themes';
import { Account } from '../../../../types/account';
import SelectAccountModal from './components/SelectAccountModal';
import Header from './components/Header';
import TaxableIncomeCalculation from './components/TaxableIncomeCalculation';
import GrossIncomeTax from './components/GrossIncomeTax';
import BalancelPayableTax from './components/BalancelPayableTax';
import TotalPayableTax from './components/TotalPayableTax';
import Button from '../../../components/Button';
import { MdOutlineOpenInNew } from "react-icons/md";
import Employment from './components/Employment';
import Rent from './components/Rent';
import Interest from './components/Interest';
import Dividend from './components/Dividend';
import Business from './components/Business';
import Other from './components/Other';
import { ClipLoader } from 'react-spinners';
import { useCalculationContext } from '../../../contexts/CalculationContext';
import { useToast } from '../../../hooks/useToast';
import { useCalculations } from '../../../hooks/useCalculations';
import { Status } from '../../../../types/enums/status';
import { Calculation } from '../../../../types/calculation';

const MODAL_COMPONENTS = {
  employment: Employment,
  rent: Rent,
  interest: Interest,
  dividend: Dividend,
  business: Business,
  other: Other,
} as const;

type ModalType = keyof typeof MODAL_COMPONENTS;

const INCOME_SOURCE_BUTTONS: Array<{ key: ModalType; label: string }> = [
  { key: 'employment', label: 'Employment' },
  { key: 'rent', label: 'Rent' },
  { key: 'interest', label: 'Interest' },
  { key: 'dividend', label: 'Dividend' },
  { key: 'business', label: 'Business' },
  { key: 'other', label: 'Other' },
];

const Calculate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routerState = location.state as { isEditing?: boolean, calculationId?: number };

  const [openModal, setOpenModal] = useState<ModalType | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [assessmentPeriod, setAssessmentPeriod] = useState<{ start: string, end: string } | null>(null);
  const [isSelectAccountModalOpen, setIsSelectAccountModalOpen] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(routerState?.isEditing ?? false);
  const [calculationId, setCalculationId] = useState<number | undefined>(routerState?.calculationId);

  const { showError } = useToast();
  const { createNewCalculation, currentCalculation, isLoading, updateCalculationAccount } = useCalculationContext();
  const { isDraftSaving, isSubmitting, createCalculation, updateCalculation } = useCalculations();

  useEffect(() => {
    createNewCalculation(isEditing, calculationId);
  }, []);

  useEffect(() => {
    if (!currentCalculation) return;

    if ("account" in currentCalculation) {
      setSelectedAccount(currentCalculation.account);
    }

    if (currentCalculation.year) {
      const [start, end] = currentCalculation.year.split('/');
      setAssessmentPeriod({ start, end });
    }
  }, [currentCalculation]);

  const handleSelectAccount = (account: Account, startDate: string, endDate: string) => {
    setSelectedAccount(account);
    setAssessmentPeriod({ start: startDate, end: endDate });
    const year = `${startDate}/${endDate}`;
    updateCalculationAccount(account.id, year);
    setIsSelectAccountModalOpen(false);
  };

  const handleSaveDraft = async () => {
    if (!selectedAccount || !assessmentPeriod) {
      showError('Please select an account and assessment period');
      return;
    }
    if (currentCalculation) {
      const cleanCalculationData = { ...currentCalculation.calculationData };
      delete (cleanCalculationData as any).id;
      delete (cleanCalculationData as any).createdAt;
      delete (cleanCalculationData as any).updatedAt;
      delete (cleanCalculationData as any).calculationId;

      const calculationReq = {
        year: currentCalculation.year,
        status: Status.DRAFT,
        accountId: currentCalculation.accountId,
        calculationData: cleanCalculationData
      };
      if (isEditing) {
        await updateCalculation(calculationId, calculationReq);
      } else {
        const calculation: Calculation = await createCalculation(calculationReq);
        setCalculationId(calculation.id);
        setIsEditing(true);
      }
    }
  };

  const handleSubmitClick = () => {
    if (!selectedAccount || !assessmentPeriod) {
      showError('Please select an account and assessment period');
      return;
    }
    if (currentCalculation?.calculationData.totalTaxableIncome == 0) {
      showError('Please calculate the total taxable income');
      return;
    }
    setShowSubmitConfirmation(true);
  };

  const handleSubmit = async () => {
    if (currentCalculation) {
      const cleanCalculationData = { ...currentCalculation.calculationData };
      delete (cleanCalculationData as any).id;
      delete (cleanCalculationData as any).createdAt;
      delete (cleanCalculationData as any).updatedAt;
      delete (cleanCalculationData as any).calculationId;

      const calculationReq = {
        year: currentCalculation.year,
        status: Status.SUBMITTED,
        accountId: currentCalculation.accountId,
        calculationData: cleanCalculationData
      };

      if (isEditing) {
        const calculation = await updateCalculation(calculationId, calculationReq);
        if (calculation) {
          navigate('/history');
        }
      } else {
        const calculation = await createCalculation(calculationReq);
        if (calculation) {
          navigate('/history');
        }
      }
    }
    setShowSubmitConfirmation(false);
  };

  const handleCancelSubmit = () => {
    setShowSubmitConfirmation(false);
  };

  return (
    <div className="p-8">
      <Navigation title="Calculate" />

      {isLoading ? <div className="flex justify-center mt-32">
        <ClipLoader color="gray" size={28} />
      </div> :
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Header
            selectedAccount={selectedAccount}
            assessmentPeriod={assessmentPeriod}
            onSelectAccount={() => setIsSelectAccountModalOpen(true)}
            isEditing={isEditing}
            status={currentCalculation?.status}
          />

          <div className="mt-8">
            <Text className='text-white' size="6" weight="bold">Source of income</Text>
            <Separator className="w-full mt-3 bg-surface-2" />

            <Flex className='mt-5 gap-4'>
              {INCOME_SOURCE_BUTTONS.map(({ key, label }) => (
                <Button
                  key={key}
                  onClick={() => setOpenModal(key)}
                  icon={MdOutlineOpenInNew}
                  iconPosition='right'
                  variant='secondary'
                >
                  {label}
                </Button>
              ))}
            </Flex>

            <div className="mt-10 space-y-8">
              <TaxableIncomeCalculation />
              <GrossIncomeTax />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TotalPayableTax />
                <BalancelPayableTax />
              </div>
            </div>

            <Flex gap="3" mt="6" justify="end" align="center">
              {
                isDraftSaving ? <Flex align="center" gap="4" mx="4"><ClipLoader color="#4A90E2" size={24} /> <Text className='text-white'>Saving draft...</Text></Flex> : (

                  <Button
                    variant='secondary'
                    className='px-8'
                    onClick={handleSaveDraft}
                  >
                    Save Draft
                  </Button>
                )
              }
              <Button
                className='!px-12'
                onClick={handleSubmitClick}
              >
                {isEditing && currentCalculation?.status === Status.SUBMITTED ? 'Update' : 'Submit'}
              </Button>
            </Flex>
          </div>
        </div>
      }

      {/* Render modals dynamically */}
      {openModal && MODAL_COMPONENTS[openModal] && React.createElement(MODAL_COMPONENTS[openModal], {
        isOpen: true,
        onClose: () => setOpenModal(null)
      })}

      {/* Select Account Modal */}
      <SelectAccountModal
        isOpen={isSelectAccountModalOpen}
        onClose={() => setIsSelectAccountModalOpen(false)}
        onSelect={handleSelectAccount}
      />

      {/* Submit Confirmation Dialog */}
      <AlertDialog.Root open={showSubmitConfirmation}>
        <AlertDialog.Content className="bg-popup-bg">
          <AlertDialog.Title>Submit Calculation</AlertDialog.Title>
          <AlertDialog.Description size="3">
            Are you sure you want to submit this calculation for "{selectedAccount?.name}" ({assessmentPeriod?.start}/{assessmentPeriod?.end})?
          </AlertDialog.Description>

          <Flex gap="3" mt="6" justify="end" align="center">
            <AlertDialog.Cancel>
              <Button variant="secondary" onClick={handleCancelSubmit}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            {
              isSubmitting ? <Flex align="center" gap="4" mx="3"><ClipLoader color="#4A90E2" size={24} /> <Text>Submitting calculation...</Text></Flex> : (
                <AlertDialog.Action>
                  <Button
                    className="!px-12"
                    onClick={handleSubmit}
                  >
                    {isEditing && currentCalculation?.status === Status.SUBMITTED ? 'Update Calculation' : 'Submit Calculation'}
                  </Button>
                </AlertDialog.Action>
              )
            }
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
};

export default Calculate;