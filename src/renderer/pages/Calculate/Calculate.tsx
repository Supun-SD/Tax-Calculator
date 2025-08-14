import React, { useState } from 'react';
import Navigation from '../../components/Navigation';
import { Flex } from '@radix-ui/themes';
import Button from '../../components/Button';
import { LuUser } from 'react-icons/lu';
import { accounts } from '../../../../mockdata/accounts';
import { Account } from '../../../types/account';
import SelectAccountModal from './components/SelectAccountModal';
import Header from './components/Header';

const Calculate = () => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [assessmentPeriod, setAssessmentPeriod] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectAccount = (
    account: Account,
    startDate: string,
    endDate: string
  ) => {
    setSelectedAccount(account);
    setAssessmentPeriod({ start: startDate, end: endDate });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <Navigation title="Calculate" />
      <Flex
        align="center"
        justify="between"
        className="w-full rounded-2xl bg-surface-2 p-6"
      >
        <Header
          selectedAccount={selectedAccount}
          assessmentPeriod={assessmentPeriod}
        />

        {/* Select Account Button */}
        <Button
          icon={LuUser}
          size="sm"
          className="ml-6 px-6"
          onClick={handleOpenModal}
        >
          Select account
        </Button>
      </Flex>

      {/* Select Account Modal */}
      <SelectAccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelect={handleSelectAccount}
        accounts={accounts}
      />
    </div>
  );
};

export default Calculate;
