
import React from 'react';
import { ButtonType } from '../types';

interface CalculatorButtonProps {
  label: string;
  type?: ButtonType;
  onClick: () => void;
  className?: string;
  cols?: number;
}

import { Haptics, ImpactStyle } from '@capacitor/haptics';

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  label,
  type = ButtonType.Neutral,
  onClick,
  className = '',
  cols = 1
}) => {

  const handleClick = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) {
      // Ignore errors on platforms where not supported
    }
    onClick();
  };

  const baseClasses = "h-full w-full rounded-2xl font-bold shadow-[0_3px_0_rgba(0,0,0,0.18)] active:translate-y-px active:shadow-none transition-all flex items-center justify-center select-none";

  let typeClasses = "";
  let textClasses = "text-xl";

  switch (type) {
    case ButtonType.Primary:
      typeClasses = "bg-[#ff484d] hover:bg-[#ff5a5e] text-white";
      textClasses = "text-sm uppercase tracking-wide";
      break;
    case ButtonType.Secondary:
      typeClasses = "bg-[#ffd21e] hover:bg-[#ffdb43] text-[#101820]";
      textClasses = "text-2xl";
      break;
    case ButtonType.Accent:
      typeClasses = "bg-[#19ad9b] hover:bg-[#24bba8] text-white";
      textClasses = "text-2xl";
      break;
    case ButtonType.Neutral:
      typeClasses = "bg-[#dbe3ea] hover:bg-[#cfd9e2] text-[#18232e] dark:bg-[#2b333d] dark:hover:bg-[#353f4b] dark:text-white";
      textClasses = "text-xl font-mono";
      break;
    case ButtonType.Memory:
      typeClasses = "bg-[#0b3aa5] text-white";
      textClasses = "text-xl";
      break;
    case ButtonType.Danger:
      typeClasses = "bg-[#ff484d] text-white";
      textClasses = "text-sm uppercase tracking-wide";
      break;
    case ButtonType.Function:
      typeClasses = "bg-[#ff8a00] hover:bg-[#ff991f] text-white";
      textClasses = "text-2xl";
      break;
  }

  return (
    <div
      className="min-h-0"
      style={{ gridColumn: cols > 1 ? `span ${cols} / span ${cols}` : undefined }}
    >
      <button
        onClick={handleClick}
        className={`aero-key aero-key-${type} ${baseClasses} ${typeClasses} ${textClasses} ${className}`}
      >
        {label}
      </button>
    </div>
  );
};

export default React.memo(CalculatorButton);
