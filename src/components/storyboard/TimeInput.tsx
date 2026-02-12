'use client';

import { useState } from 'react';
import { TimeCode } from '@/types';
import { formatTimeCode, parseTimeCode } from '@/utils/timeCode';

interface TimeInputProps {
  value: TimeCode;
  onChange: (tc: TimeCode) => void;
}

export default function TimeInput({ value, onChange }: TimeInputProps) {
  const [editValue, setEditValue] = useState(formatTimeCode(value));
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseTimeCode(editValue);
    onChange(parsed);
    setEditValue(formatTimeCode(parsed));
  };

  return (
    <div className="w-full">
      <input
        type="text"
        value={isFocused ? editValue : formatTimeCode(value)}
        onChange={(e) => setEditValue(e.target.value)}
        onFocus={() => {
          setIsFocused(true);
          setEditValue(formatTimeCode(value));
        }}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
        placeholder="0+0"
        className="w-full bg-transparent text-center text-base font-mono text-foreground outline-none border-b border-transparent focus:border-accent"
      />
      <div className="text-xs text-muted text-center mt-0.5">초+프레임</div>
    </div>
  );
}
