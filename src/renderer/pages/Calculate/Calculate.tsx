import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { Flex, Grid, Separator, Text, AlertDialog } from '@radix-ui/themes';
import { Account } from '../../../types/account';
import SelectAccountModal from './components/SelectAccountModal';
import Header from './components/Header';
import TaxableIncomeCalculation from './components/TaxableIncomeCalculation';
import GrossIncomeTax from './components/GrossIncomeTax';
import BalancelPayableTax from './components/BalancelPayableTax';
import TotalPayableTax from './components/TotalPayableTax';
import Button from '../../components/Button';
import { MdOutlineOpenInNew } from "react-icons/md";
import Employment from './components/Employment';
import Rent from './components/Rent';
import Interest from './components/Interest';
import Dividend from './components/Dividend';
import Business from './components/Business';
import Other from './components/Other';
import { ClipLoader } from 'react-spinners';
import { useCalculationContext } from '../../contexts/CalculationContext';

// Modal registry for better scalability
const MODAL_COMPONENTS = {
  employment: Employment,
  rent: Rent,
  interest: Interest,
  dividend: Dividend,
  business: Business,
  other: Other,
} as const;

type ModalType = keyof typeof MODAL_COMPONENTS;

// Button configuration for income sources
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
  const [openModal, setOpenModal] = useState<ModalType | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [assessmentPeriod, setAssessmentPeriod] = useState<{ start: string, end: string } | null>(null);
  const [isSelectAccountModalOpen, setIsSelectAccountModalOpen] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

  const { createNewCalculation, currentCalculation, isLoading } = useCalculationContext();

  const location = useLocation();
  const state = location.state as { isEditing?: boolean, calculationId?: number };

  useEffect(() => {
    const fetchCalculation = async () => {
      await createNewCalculation(state?.isEditing ?? false, state?.calculationId);
    };
    fetchCalculation();
  }, []);

  const handleSelectAccount = (
    account: Account,
    startDate: string,
    endDate: string
  ) => {
    setSelectedAccount(account);
    setAssessmentPeriod({
      start: startDate,
      end: endDate
    });
    setIsSelectAccountModalOpen(false);
  };

  const handleSaveDraft = async () => {
    // Dummy implementation
    console.log('Saving draft...');
  };

  const handleSubmitClick = () => {
    console.log(currentCalculation);
    //setShowSubmitConfirmation(true);
  };

  const handleSubmit = async () => {
    // Dummy implementation
    console.log('Submitting calculation...');
    navigate('/history');
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
        <div className="mt-8">
          <Header
            selectedAccount={selectedAccount}
            assessmentPeriod={assessmentPeriod}
            onSelectAccount={() => setIsSelectAccountModalOpen(true)}
            isEditing={false}
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

            <Grid columns="2" gap="5" width="auto" className='mt-10'>
              <div className="h-full">
                <TaxableIncomeCalculation />
              </div>
              <div className="h-full">
                <GrossIncomeTax />
              </div>
              <TotalPayableTax />
              <BalancelPayableTax />
            </Grid>

            <Flex gap="3" mt="6" justify="end">
              <Button
                variant='secondary'
                className='px-8'
                onClick={handleSaveDraft}
              >
                Save Draft
              </Button>
              <Button
                className='!px-12'
                onClick={handleSubmitClick}
              >
                Submit
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
            <AlertDialog.Action>
              <Button
                className="!px-12"
                onClick={handleSubmit}
              >
                Submit Calculation
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
};

export default Calculate;