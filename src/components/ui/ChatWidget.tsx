import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { Message } from '../../context/ChatContext';

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const CloseIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);


const ChatMessage = ({ message }: { message: Message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[80%] rounded-xl px-4 py-2 ${isUser ? 'bg-cream text-brown-gray rounded-br-none' : 'bg-gray-100 text-brown-gray rounded-bl-none'}`}>
                <p className="text-sm">{message.text}</p>
            </div>
        </div>
    );
};


export const ChatWidget = () => {
    const { isChatOpen, toggleChat, messages, addMessage } = useChat();
    const [inputValue, setInputValue] = useState('');
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            addMessage(inputValue.trim());
            setInputValue('');
        }
    };
    
    return (
        <div className="fixed bottom-6 right-6 z-[80] font-sans">
            {/* Chat Window */}
            <div className={`
                absolute bottom-20 right-0 w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out
                ${isChatOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}>
                <header className="flex justify-between items-center p-4 bg-cream border-b rounded-t-lg">
                    <h3 className="font-bold text-brown-gray">Чат с поддержкой</h3>
                    <button onClick={toggleChat} className="text-brown-gray hover:opacity-75" aria-label="Закрыть чат">
                        <CloseIcon />
                    </button>
                </header>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Введите сообщение..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-brown-gray focus:border-brown-gray text-sm"
                        aria-label="Поле для ввода сообщения"
                    />
                    <button type="submit" className="bg-brown-gray text-white p-2 rounded-lg hover:brightness-90 transition-all disabled:bg-gray-400" disabled={!inputValue.trim()} aria-label="Отправить сообщение">
                        <SendIcon />
                    </button>
                </form>
            </div>

            {/* Chat Button */}
            <button
                onClick={toggleChat}
                className={`
                    bg-brown-gray w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:brightness-90 transition-transform duration-300
                    ${isChatOpen ? 'transform rotate-90' : ''}
                `}
                aria-label={isChatOpen ? "Закрыть чат" : "Открыть чат"}
                aria-expanded={isChatOpen}
            >
                {isChatOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
        </div>
    );
};