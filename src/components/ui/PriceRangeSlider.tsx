import React, { useState, useEffect, useRef, useCallback } from 'react';

interface PriceRangeSliderProps {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    step?: number;
}

export const PriceRangeSlider = ({ min, max, value, onChange, step = 1 }: PriceRangeSliderProps) => {
    const [minVal, setMinVal] = useState(value[0]);
    const [maxVal, setMaxVal] = useState(value[1]);
    const range = useRef<HTMLDivElement>(null);
    const minValRef = useRef<HTMLInputElement>(null);
    const maxValRef = useRef<HTMLInputElement>(null);


    const getPercent = useCallback((value: number) => Math.round(((value - min) / (max - min)) * 100), [min, max]);

    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(maxValRef.current.valueAsNumber);

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minVal, getPercent]);

    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(minValRef.current.valueAsNumber);
            const maxPercent = getPercent(maxVal);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [maxVal, getPercent]);
    
     useEffect(() => {
        setMinVal(value[0]);
        setMaxVal(value[1]);
    }, [value]);

    const handleMouseUp = () => {
        onChange([minVal, maxVal]);
    };

    const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(event.target.valueAsNumber, maxVal - step);
        setMinVal(value);
    };

    const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(event.target.valueAsNumber, minVal + step);
        setMaxVal(value);
    };

    return (
        <div>
            <div className="relative h-10 flex items-center justify-center">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={minVal}
                    ref={minValRef}
                    onChange={handleMinChange}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                    className="thumb thumb--zindex-3"
                    aria-label="Minimum price"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={maxVal}
                    ref={maxValRef}
                    onChange={handleMaxChange}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                    className="thumb thumb--zindex-4"
                    aria-label="Maximum price"
                />

                <div className="relative w-full">
                    <div className="absolute w-full rounded h-1 bg-gray-300"></div>
                    <div ref={range} className="absolute h-1 bg-brown-gray rounded"></div>
                </div>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm text-brown-gray">
                <span>{minVal.toLocaleString('ru-RU')} ₽</span>
                <span>{maxVal.toLocaleString('ru-RU')} ₽</span>
            </div>
            <style>{`
                .thumb {
                    pointer-events: none;
                    position: absolute;
                    height: 0;
                    width: 100%;
                    outline: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    background: transparent;
                }
                .thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    pointer-events: all;
                    width: 20px;
                    height: 20px;
                    background-color: #fff;
                    border-radius: 50%;
                    border: 2px solid #787B7E;
                    cursor: pointer;
                    margin-top: -8px;
                }
                .thumb::-moz-range-thumb {
                     -moz-appearance: none;
                    pointer-events: all;
                    width: 20px;
                    height: 20px;
                    background-color: #fff;
                    border-radius: 50%;
                    border: 2px solid #787B7E;
                    cursor: pointer;
                }
                .thumb--zindex-3 {
                    z-index: 3;
                }
                .thumb--zindex-4 {
                    z-index: 4;
                }
            `}</style>
        </div>
    );
};
