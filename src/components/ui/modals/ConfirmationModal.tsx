import React, { useEffect, useRef } from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }: ConfirmationModalProps) => {
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            const handleEsc = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    onCancel();
                }
            };
            document.addEventListener('keydown', handleEsc);
            confirmButtonRef.current?.focus(); 
            return () => {
                document.removeEventListener('keydown', handleEsc);
            };
        }
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-brown-gray bg-opacity-70 z-[110] flex items-center justify-center p-4 fade-in" 
            role="dialog" 
            aria-modal="true"
            aria-labelledby="confirmation-title"
        >
            <div className="fixed inset-0" onClick={onCancel} aria-hidden="true"></div>
            <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl m-4 animate-slide-in-up" role="document">
                <div className="p-6">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="confirmation-title">
                                {title}
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                    <button
                        ref={confirmButtonRef}
                        type="button"
                        className="btn btn-danger w-full sm:ml-3 sm:w-auto"
                        onClick={onConfirm}
                    >
                        Удалить
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary !border-gray-300 w-full mt-3 sm:mt-0 sm:w-auto"
                        onClick={onCancel}
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};