'use client'

import React, { useState, useRef, useEffect } from 'react'
import { convertToNepali } from '@/lib/nepali-converter'

interface NepaliInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

export default function NepaliInput({
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  required = false,
  id
}: NepaliInputProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isComposing, setIsComposing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' && !isComposing) {
      e.preventDefault()
      const converted = convertToNepali(displayValue)
      setDisplayValue(converted)
      onChange(converted)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setDisplayValue(newValue)
    if (!isComposing) {
      onChange(newValue)
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false)
    const newValue = e.currentTarget.value
    setDisplayValue(newValue)
    onChange(newValue)
  }

  return (
    <div className="position-relative">
      <input
        ref={inputRef}
        type="text"
        id={id}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder={placeholder}
        className={`form-control nepali-input ${className}`}
        disabled={disabled}
        required={required}
        autoComplete="off"
      />
      <small className="form-text text-muted">
        Type in English and press Space to convert to Nepali
      </small>
    </div>
  )
}