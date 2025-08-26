import React from 'react';
import { Flex, Text, Separator } from '@radix-ui/themes';
import { LuUser } from 'react-icons/lu';
import { Account } from '../../../../../types/account';
import Button from '../../../../components/Button';
import { Status } from '../../../../../types/enums/status';
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
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
      <div className="flex items-center justify-between">
        {selectedAccount ? (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400/60 to-purple-500/60 rounded-full flex items-center justify-center">
                <LuUser className="text-white text-2xl" />
              </div>
              <div className="flex flex-col">
                <Text className="text-white text-2xl font-bold">
                  {selectedAccount.name}
                </Text>
                <Text className="text-gray-400 text-lg">
                  TIN: {selectedAccount.tinNumber}
                </Text>
              </div>
            </div>
            <Separator
              orientation="vertical"
              className="mx-6 h-12 bg-popup-title-bg"
            />
            <div className="flex items-center space-x-4 text-gray-400">
              <Text className="text-white text-xl font-medium">
                {assessmentPeriod
                  ? `${assessmentPeriod.start}/${assessmentPeriod.end}`
                  : '2024/2025'}
              </Text>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-lg">
            Select an account and assessment years
          </div>
        )}

        <div className="flex items-center space-x-6">
          {status === Status.DRAFT && isEditing && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-600/30 rounded-full border border-gray-500/30">
              <RiDraftLine size={16} className="text-gray-400" />
              <Text size="3" weight="medium" className="text-gray-300">
                {status.toUpperCase()}
              </Text>
            </div>
          )}

          {/* Select Account Button */}
          {!isEditing && (
            <Button
              icon={LuUser}
              size="sm"
              className="px-6"
              onClick={onSelectAccount}
            >
              Select account
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
