import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CookieConsentBanner } from '../components/CookieConsentBanner';

interface CookieConsentContextType {
    cookieConsent: boolean | null;
    handleConsent: (consent: boolean) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const useCookieConsent = () => {
    const context = useContext(CookieConsentContext);
    if (!context) {
        throw new Error('useCookieConsent must be used within a CookieConsentProvider');
    }
    return context;
};

export const CookieConsentProvider = ({ children }: { children: React.ReactNode }) => {
    const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);

    useEffect(() => {
        try {
            const consent = localStorage.getItem('mabon_cookie_consent');
            setCookieConsent(consent ? JSON.parse(consent) : null);
        } catch (error) {
            console.error("Failed to parse cookie consent from localStorage", error);
            setCookieConsent(null);
        }
    }, []);

    const handleConsent = useCallback((consent: boolean) => {
        try {
            setCookieConsent(consent);
            localStorage.setItem('mabon_cookie_consent', JSON.stringify(consent));
        } catch (error) {
            console.error("Failed to save cookie consent to localStorage", error);
        }
    }, []);

    return (
        <CookieConsentContext.Provider value={{ cookieConsent, handleConsent }}>
            {children}
            {cookieConsent === null && <CookieConsentBanner onConsent={handleConsent} />}
        </CookieConsentContext.Provider>
    );
};
