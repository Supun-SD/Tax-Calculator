import React, { useState } from 'react';
import Navigation from '../../components/Navigation';
import { Flex, Grid, Separator, Text } from '@radix-ui/themes';
import { accounts } from '../../../../mockdata/accounts';
import { Account } from '../../../types/account';
import SelectAccountModal from './components/SelectAccountModal';
import Header from './components/Header';
import TaxableIncomeCalculation from './components/TaxableIncomeCalculation';
import GrossIncomeTax from './components/GrossIncomeTax';
import QRT from './components/QRT';
import BalancePayableTax from './components/BalancePayableTax';
import Button from '../../components/Button';
import { MdOutlineOpenInNew } from "react-icons/md";
import Employment from './components/Employment';
import Rent from './components/Rent';
import Interest from './components/Interest';
import Dividend from './components/Dividend';
import Business from './components/Business';
import Other from './components/Other';

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
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [assessmentPeriod, setAssessmentPeriod] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [openModal, setOpenModal] = useState<ModalType | null>(null);
  const [isSelectAccountModalOpen, setIsSelectAccountModalOpen] = useState(false);

  const handleSelectAccount = (
    account: Account,
    startDate: string,
    endDate: string
  ) => {
    setSelectedAccount(account);
    setAssessmentPeriod({ start: startDate, end: endDate });
    setIsSelectAccountModalOpen(false);
  };

  return (
    <div className="p-8">
      <Navigation title="Calculate" />

      <Header
        selectedAccount={selectedAccount}
        assessmentPeriod={assessmentPeriod}
        onSelectAccount={() => setIsSelectAccountModalOpen(true)}
      />

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
        <QRT />
        <BalancePayableTax />
      </Grid>

      <Flex gap="3" mt="6" justify="end">
        <Button variant='secondary'>Save Draft</Button>
        <Button className='!px-12'>Submit</Button>
      </Flex>

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
        accounts={accounts}
      />
    </div>
  );
};

export default Calculate;