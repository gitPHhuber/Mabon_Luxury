import React, { useState, createContext, useContext, useCallback, ReactNode, PropsWithChildren } from 'react';

export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'operator';
    timestamp: string;
}

interface ChatContextType {
    isChatOpen: boolean;
    toggleChat: () => void;
    messages: Message[];
    addMessage: (text: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

const initialMessage: Message = {
    id: 1,
    text: 'Здравствуйте! Чем мы можем вам помочь?',
    sender: 'operator',
    timestamp: new Date().toISOString()
};

export const ChatProvider = ({ children }: PropsWithChildren) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([initialMessage]);
    
    const toggleChat = () => {
        setIsChatOpen(prev => !prev);
    };

    const addMessage = useCallback((text: string) => {
        const userMessage: Message = {
            id: Date.now(),
            text,
            sender: 'user',
            timestamp: new Date().toISOString(),
        };
        
        setMessages(prevMessages => [...prevMessages, userMessage]);
    }, []);

    const value = {
        isChatOpen,
        toggleChat,
        messages,
        addMessage
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};