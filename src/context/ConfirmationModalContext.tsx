import React, { useState, createContext, useContext, useCallback, PropsWithChildren } from 'react';
import { ConfirmationModal } from '../components/ui/modals/ConfirmationModal';

interface ModalOptions {
    title: string;
    message: string;
    onConfirm: () => void;
}

interface ConfirmationModalContextType {
    showConfirmation: (title: string, message: string, onConfirm: () => void) => void;
}

const ConfirmationModalContext = createContext<ConfirmationModalContextType | undefined>(undefined);

export const useConfirmationModal = () => {
    const context = useContext(ConfirmationModalContext);
    if (!context) {
        throw new Error('useConfirmationModal must be used within a ConfirmationModalProvider');
    }
    return context;
};

export const ConfirmationModalProvider = ({ children }: PropsWithChildren) => {
    const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);

    const showConfirmation = useCallback((title: string, message: string, onConfirm: () => void) => {
        setModalOptions({ title, message, onConfirm });
    }, []);

    const handleConfirm = () => {
        if (modalOptions) {
            modalOptions.onConfirm();
            setModalOptions(null);
        }
    };

    const handleCancel = () => {
        setModalOptions(null);
    };

    return (
        <ConfirmationModalContext.Provider value={{ showConfirmation }}>
            {children}
            <ConfirmationModal
                isOpen={!!modalOptions}
                title={modalOptions?.title || ''}
                message={modalOptions?.message || ''}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </ConfirmationModalContext.Provider>
    );
};