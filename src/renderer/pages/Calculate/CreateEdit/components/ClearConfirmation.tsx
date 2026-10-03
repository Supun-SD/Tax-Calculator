import React from "react";
import { AlertDialog, Flex } from "@radix-ui/themes";
import Button from "../../../../components/Button";

interface ClearConfirmationProps {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ClearConfirmation: React.FC<ClearConfirmationProps> = ({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  confirmLabel = "Clear",
  cancelLabel = "Cancel",
}) => {
  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Content className="rounded-xl border border-white/20 bg-surface-2">
        <AlertDialog.Title className="text-white">{title}</AlertDialog.Title>
        <AlertDialog.Description size="3" className="text-gray-300">
          {description}
        </AlertDialog.Description>

        <Flex gap="3" mt="6" justify="end" align="center">
          <AlertDialog.Cancel>
            <Button variant="secondary" onClick={onCancel}>
              {cancelLabel}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              className="bg-red-500 !px-10 text-white hover:bg-red-600"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default ClearConfirmation;
