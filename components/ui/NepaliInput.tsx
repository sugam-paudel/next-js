'use client'

import React, { useState, useRef, useEffect } from 'react'
import { convertToNepali } from '@/lib/nepali-converter'

// Extend React.InputHTMLAttributes, but OMIT the default 'onChange' and 'value' properties
// This allows us to define our own 'value' and 'onChange' with custom signatures.
interface NepaliInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string; // Keep value as required for controlled component, with string type
  onChange: (value: string) => void; // Keep onChange as required for controlled component, with string parameter
}

export default function NepaliInput({
  value,
  onChange,
  // Destructure other props from the rest operator to pass them directly to the input
  ...rest
}: NepaliInputProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isComposing, setIsComposing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Synchronize local state with prop value (e.g., when form resets or initial load)
  useEffect(() => {
    if (value !== displayValue) {
      console.log('NepaliInput: Prop value changed, updating displayValue to:', value);
      setDisplayValue(value);
    }
  }, [value, displayValue]); // Added displayValue to dependency array for more robust sync

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('NepaliInput: handleKeyDown - Key:', e.key, 'isComposing:', isComposing, 'displayValue before conversion:', displayValue);

    if (e.key === ' ' && !isComposing) {
      e.preventDefault(); 
      
      const textToConvert = displayValue.trim();
      console.log('NepaliInput: Converting text:', textToConvert);
      
      const convertedText = convertToNepali(textToConvert);
      console.log('NepaliInput: Converted text:', convertedText);
      
      const newValue = convertedText + ' ';
      
      setDisplayValue(newValue);
      console.log('NepaliInput: Updated displayValue to:', newValue);
      
      onChange(newValue); 
      console.log('NepaliInput: Called onChange with converted value:', newValue);
    } else if (e.key === 'Backspace' && displayValue === '') {
        console.log('NepaliInput: Backspace on empty field, calling onChange with empty string');
        onChange('');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('NepaliInput: handleChange - New value from input:', newValue);
    setDisplayValue(newValue); 
    
    if (!isComposing) {
      // Now, 'onChange' here directly expects a string, which is what 'newValue' is.
      onChange(newValue);
      console.log('NepaliInput: Called onChange from handleChange with:', newValue);
    }
  }

  const handleCompositionStart = () => {
    console.log('NepaliInput: handleCompositionStart');
    setIsComposing(true);
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    console.log('NepaliInput: handleCompositionEnd');
    setIsComposing(false);
    const newValue = e.currentTarget.value;
    setDisplayValue(newValue);
    // Again, 'onChange' here directly expects a string.
    onChange(newValue); 
    console.log('NepaliInput: Called onChange from compositionEnd with:', newValue);
  }

  return (
    <div className="position-relative">
      <input
        ref={inputRef}
        type="text"
        value={displayValue} 
        onChange={handleChange} 
        onKeyDown={handleKeyDown} 
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        // Spread the rest of the props here, including id, placeholder, className, etc.
        {...rest} 
        autoComplete="off" // Ensure this is explicitly passed if desired
      />
      <small className="form-text text-muted">
        Type in English and press Space to convert to Nepali
      </small>
    </div>
  )
}
