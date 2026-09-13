
import React from 'react';
import { FormattedValue } from '../types';

interface DisplayProps {
    value: FormattedValue;
    onBackspace: () => void; // Add backspace handler prop
    memoryActive?: boolean;
}

const Display: React.FC<DisplayProps> = ({ value, onBackspace, memoryActive = false }) => {
    const { yard, feet, inch, numerator, denominator, isNegative, showFeetLabel, showInchLabel, showYardLabel, showDash, inputBuffer, secondaryDisplay, dimension, dimensionLabel } = value;

    // We only render parts that have value or are active
    const hasFeet = feet !== 0 || showFeetLabel;
    // If numerator exists or label is forced, we ensure the inch section renders.
    const hasInch = inch !== 0 || showInchLabel;
    // Yard is usually exclusive or primary, but we'll render it if active
    const hasYard = showYardLabel; // Always show if explicitly set

    // Special case: if input buffer is active for first number and we aren't showing labels yet
    const isSimpleNumber = !showFeetLabel && !showInchLabel && !showYardLabel && !showDash && numerator === 0;

    const dimPrefix = dimension === 2 ? 'SQ ' : (dimension === 3 ? 'CB ' : '');
    const dimensionValue = yard !== 0 || showYardLabel ? yard : (inch !== 0 || showInchLabel ? inch : feet);

    return (
        <div
            onClick={onBackspace}
            className="w-full flex-1 bg-[#0d1114] rounded-xl py-4 px-5 flex flex-col justify-between shadow-inner border border-[#16304a] relative overflow-hidden cursor-pointer active:bg-[#10161b] min-h-[160px]"
        >
            <div className="flex justify-between items-start w-full h-6 text-[#85909d] text-[10px] font-mono tracking-[0.16em] uppercase">
                <span className="flex items-center gap-2">
                    {memoryActive && <span className="rounded bg-[#0b3aa5] px-1.5 py-0.5 text-[9px] font-bold text-white tracking-normal">M</span>}
                    {inputBuffer ? 'ENTRY' : 'RESULT'}
                </span>
            </div>

            <div className="flex flex-col h-full justify-end">
                {/* Main Numbers (Top Row) */}
                <div className="flex items-end justify-end w-full select-none pb-1">

                    {dimension > 1 && dimensionLabel ? (
                        <div className="flex w-full flex-col items-end justify-end">
                            <span className="text-6xl sm:text-[5rem] font-mono text-[#f1f3f6] break-all text-right leading-tight">
                                {isNegative ? '-' : ''}{dimensionValue}
                            </span>
                            <span className="mt-2 text-xl sm:text-2xl font-sans font-medium tracking-wide text-[#f1f3f6]">
                                {dimensionLabel}
                            </span>
                        </div>
                    ) : isSimpleNumber ? (
                        <span className="text-6xl sm:text-[5rem] font-mono text-[#f1f3f6] break-all text-right leading-tight">
                            {/* If typing a decimal, inputBuffer might be "5.", show that directly if active */}
                            {inputBuffer ? inputBuffer : feet}
                        </span>
                    ) : (
                        <div className="flex items-end justify-end gap-4 sm:gap-5 text-[#f1f3f6]">

                            {isNegative && (
                                <span className="text-4xl font-mono text-[#8993a0] mr-2">-</span>
                            )}

                            {/* Yard */}
                            {hasYard && (
                                <div className="flex flex-col items-center">
                                    <span className="text-5xl sm:text-[4rem] font-mono leading-none">
                                        {yard}
                                    </span>
                                    <span className={`text-[10px] font-bold text-[#8793a1] mt-1 tracking-widest ${showYardLabel ? 'opacity-100' : 'opacity-0'}`}>
                                        {dimPrefix}YARD
                                    </span>
                                </div>
                            )}

                            {/* Dash Separator (Only if mixing Yards and Feet, or Feet and Inches) */}
                            {showDash && hasYard && (showFeetLabel || hasFeet) && (
                                <div className="flex flex-col justify-start h-[3.5rem] sm:h-[4rem] lg:h-[5rem]">
                                    <span className="text-2xl font-mono text-[#5d6670] self-center">-</span>
                                </div>
                            )}


                            {/* Feet */}
                            {((hasFeet || showFeetLabel) && !showYardLabel) && (
                                <div className="flex flex-col items-center">
                                    <span className="text-5xl sm:text-[4rem] font-mono leading-none">
                                        {feet}
                                    </span>
                                    <span className={`text-[10px] font-bold text-[#8793a1] mt-1 tracking-widest ${showFeetLabel ? 'opacity-100' : 'opacity-0'}`}>
                                        {dimPrefix}FEET
                                    </span>
                                </div>
                            )}

                            {/* Dash Separator */}
                            {showDash && !hasYard && (
                                <div className="flex flex-col justify-start h-[3.5rem] sm:h-[4rem] lg:h-[5rem]">
                                    <span className="text-2xl font-mono text-[#5d6670] self-center">-</span>
                                </div>
                            )}

                            {/* Inches */}
                            {(hasInch || showInchLabel) && (
                                <div className="flex flex-col items-center">
                                    <span className="text-5xl sm:text-[4rem] font-mono leading-none">
                                        {inch}
                                    </span>
                                    <span className={`text-[10px] font-bold text-[#8793a1] mt-1 tracking-widest ${showInchLabel ? 'opacity-100' : 'opacity-0'}`}>
                                        {dimPrefix}INCH
                                    </span>
                                </div>
                            )}

                            {/* Fraction */}
                            {numerator > 0 && (
                                <div className="flex flex-col items-start justify-end self-end mb-0.5 ml-1">
                                    <div className="flex flex-col items-center leading-none font-mono">
                                        <span className="text-xl sm:text-2xl border-b border-[#64707d] px-1 mb-0.5">
                                            {numerator}
                                        </span>
                                        <span className="text-xl sm:text-2xl px-1">
                                            {denominator === 0 ? '' : denominator}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Secondary Display (Bottom Row) - Converted Value */}
                <div className="h-10 w-full flex items-end justify-end border-t border-[#1b2a38] mt-2 pt-1">
                    <span className="font-mono text-2xl text-[#7d8793] tracking-wider">
                        {secondaryDisplay}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(Display);
