import React from 'react';
import { Flex, Text, Separator } from '@radix-ui/themes';
import { LuUser } from 'react-icons/lu';
import { Account } from '../../../../types/account';
import Button from '../../../components/Button';
import { Status } from '../../../../types/enums/status';
import { RiDraftLine } from 'react-icons/ri';

interface HeaderProps {
  selectedAccount: Account | null;
  assessmentPeriod: { start: string; end: string } | null;
  onSelectAccount: () => void;
  isEditing: boolean;
  status: Status;
}

const Header: React.FC<HeaderProps> = ({
  selectedAccount,
  assessmentPeriod,
  onSelectAccount,
  isEditing,
  status,
}) => {
  return (
    <Flex align="center" justify="between" className="w-full rounded-2xl bg-surface-2 p-6 mb-8">
      {selectedAccount ? (
        <Flex gap="4">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-500 bg-gray-600">
              <LuUser size={24} className="text-gray-400" />
            </div>
          </div>
          <Flex direction="column" className="ml-4 flex-1">
            <Text size="6" weight="bold" className="text-white">
              {selectedAccount.name}
            </Text>
            <Text size="2" className="text-gray-300">
              {selectedAccount.tinNumber}
            </Text>
          </Flex>

          <Separator
            orientation="vertical"
            className="mx-6 h-12 bg-popup-title-bg"
          />

          <Flex direction="column" align="start">
            <Text size="2" className="mb-1 text-gray-400">
              Years of assessment
            </Text>
            <Text size="3" weight="medium" className="text-white">
              {assessmentPeriod
                ? `${assessmentPeriod.start}/${assessmentPeriod.end}`
                : '2024/2025'}
            </Text>
          </Flex>
        </Flex>
      ) : (
        <div className="text-popup-bg">
          Select an account and assessment years
        </div>
      )}

      {status === Status.DRAFT && isEditing && (
        <Flex align="center" gap="2" className="px-4 py-2 bg-gray-600 rounded-full border border-gray-500">
          <RiDraftLine size={16} className="text-gray-400" />
          <Text size="3" weight="medium" className="text-gray-300">
            {status.toUpperCase()}
          </Text>
        </Flex>
      )}

      {/* Select Account Button */}
      {!isEditing && (
        <Button
          icon={LuUser}
          size="sm"
          className="ml-6 px-6"
          onClick={onSelectAccount}
        >
          Select account
        </Button>
      )}
    </Flex>
  );
};

export default Header;
