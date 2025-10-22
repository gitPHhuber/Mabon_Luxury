import React, { useState } from 'react';

interface TruncatedTextProps {
    text: string;
    maxLength: number;
    className?: string;
}

export const TruncatedText = ({ text, maxLength, className = '' }: TruncatedTextProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [textId] = useState(() => `truncated-text-${Math.random().toString(36).substr(2, 9)}`);

    if (text.length <= maxLength) {
        return <p className={className}>{text}</p>;
    }

    const toggleExpanded = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <p id={textId} className={className}>
                {isExpanded ? text : `${text.substring(0, maxLength)}...`}
            </p>
            <button
                onClick={toggleExpanded}
                className="text-brown-gray font-bold hover:underline mt-2 font-sans text-sm"
                aria-expanded={isExpanded}
                aria-controls={textId}
            >
                {isExpanded ? 'Свернуть' : 'Читать далее'}
            </button>
        </div>
    );
};