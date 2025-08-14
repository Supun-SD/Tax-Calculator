import React from 'react';
import { Flex, Text, Separator } from '@radix-ui/themes';
import { LuUser } from 'react-icons/lu';
import { Account } from '../../../../types/account';

interface HeaderProps {
  selectedAccount: Account | null;
  assessmentPeriod: { start: string; end: string } | null;
}

const Header: React.FC<HeaderProps> = ({
  selectedAccount,
  assessmentPeriod,
}) => {
  return (
    <>
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
    </>
  );
};

export default Header;
