import React, { useState } from 'react';
import { Dialog, Flex } from '@radix-ui/themes';
import { IoIosClose } from "react-icons/io";
import Button from './Button';

interface ModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    title: string | React.ReactNode;
    children: React.ReactNode;
    actions?: {
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary' | 'outline';
        disabled?: boolean;
        className?: string;
    }[];
    maxWidth?: string;
    trigger?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    isOpen: controlledIsOpen,
    onClose: controlledOnClose,
    title,
    children,
    actions = [],
    maxWidth = "450px",
    trigger,
}) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

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

            <Dialog.Content maxWidth={maxWidth} className='bg-popup-bg p-10 rounded-3xl relative'>
                <Dialog.Close className="absolute top-4 right-4 p-2 cursor-pointer ">
                    <div><IoIosClose size={24} /></div>
                </Dialog.Close>
                <Dialog.Title>{title}</Dialog.Title>

                <div className="my-8">
                    {children}
                </div>

                {(actions.length > 0) && (
                    <Flex gap="3" justify="end">
                        {actions.map((action, index) => (
                            <Button
                                key={index}
                                variant={action.variant || 'primary'}
                                onClick={action.onClick}
                                disabled={action.disabled}
                                className={action.className}
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
