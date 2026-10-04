import React from "react";
import { Text, Separator } from "@radix-ui/themes";
import { LuUser } from "react-icons/lu";
import { Account } from "../../../../../types/account";
import Button from "../../../../components/Button";
import { Status } from "../../../../../types/enums/status";
import { RiDraftLine } from "react-icons/ri";

interface HeaderProps {
  selectedAccount: Account | null;
  assessmentPeriod: { start: string; end: string } | null;
  onSelectAccount: () => void;
  isEditing: boolean;
  status?: Status;
}

const Header: React.FC<HeaderProps> = ({
  selectedAccount,
  assessmentPeriod,
  onSelectAccount,
  isEditing,
  status,
}) => {
  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        {selectedAccount ? (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/60 to-purple-500/60">
                <LuUser className="text-2xl text-white" />
              </div>
              <div className="flex flex-col">
                <Text className="text-2xl font-bold text-white">
                  {selectedAccount.name}
                </Text>
                <Text className="text-lg text-gray-400">
                  TIN: {selectedAccount.tinNumber}
                </Text>
              </div>
            </div>
            <Separator
              orientation="vertical"
              className="mx-6 h-12 bg-popup-title-bg"
            />
            <div className="flex items-center space-x-4 text-gray-400">
              <Text className="text-xl font-medium text-white">
                {assessmentPeriod
                  ? `${assessmentPeriod.start}/${assessmentPeriod.end}`
                  : "2024/2025"}
              </Text>
            </div>
          </div>
        ) : (
          <div className="text-lg text-gray-400">
            Select an account and assessment years
          </div>
        )}

        <div className="flex items-center space-x-6">
          {status === Status.DRAFT && isEditing && (
            <div className="flex items-center gap-2 rounded-full border border-gray-500/30 bg-gray-600/30 px-4 py-2">
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
