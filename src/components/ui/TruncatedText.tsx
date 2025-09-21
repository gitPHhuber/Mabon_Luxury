import React, { useState } from 'react';

interface TruncatedTextProps {
    text: string;
    maxLength: number;
    className?: string;
}

export const TruncatedText = ({ text, maxLength, className = '' }: TruncatedTextProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

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
            <p className={className}>
                {isExpanded ? text : `${text.substring(0, maxLength)}...`}
            </p>
            <button
                onClick={toggleExpanded}
                className="text-brown-gray font-bold hover:underline mt-2 font-sans text-sm"
                aria-expanded={isExpanded}
            >
                {isExpanded ? 'Свернуть' : 'Читать далее'}
            </button>
        </div>
    );
};
