import React, { useState } from 'react';
import { Dialog, Flex } from '@radix-ui/themes';
import Button from './Button';

interface ModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    title: string;
    children: React.ReactNode;
    actions?: {
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary' | 'outline';
        disabled?: boolean;
    }[];
    maxWidth?: string;
    showCloseButton?: boolean;
    trigger?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    isOpen: controlledIsOpen,
    onClose: controlledOnClose,
    title,
    children,
    actions = [],
    maxWidth = "450px",
    showCloseButton = true,
    trigger,
}) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    // Use controlled state if provided, otherwise use internal state
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsOpen = controlledOnClose || (() => setInternalIsOpen(false));

    const handleOpenChange = (open: boolean) => {
        if (controlledOnClose) {
            controlledOnClose();
        } else {
            setInternalIsOpen(open);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
            {trigger && (
                <Dialog.Trigger>
                    {trigger}
                </Dialog.Trigger>
            )}

            <Dialog.Content maxWidth={maxWidth} className='bg-popup-bg p-10 rounded-3xl'>
                <Dialog.Title>{title}</Dialog.Title>

                <div className="my-8">
                    {children}
                </div>

                {(actions.length > 0 || showCloseButton) && (
                    <Flex gap="3" justify="end">
                        {showCloseButton && (
                            <Dialog.Close>
                                <Button variant="outline" onClick={() => setIsOpen()}>
                                    Cancel
                                </Button>
                            </Dialog.Close>
                        )}
                        {actions.map((action, index) => (
                            <Button
                                key={index}
                                variant={action.variant || 'primary'}
                                onClick={action.onClick}
                                disabled={action.disabled}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </Flex>
                )}
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default Modal;
