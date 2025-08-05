'use client'

import React, { useState, useEffect } from 'react'
import { convertBSToAD, convertADToBS, formatDateDisplay, calculateAge } from '@/lib/date-converter'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  format: 'BS' | 'AD'
  onFormatChange: (format: 'BS' | 'AD') => void
  showAge?: boolean
  label?: string
  required?: boolean
  id?: string
  className?: string
}

export default function DatePicker({
  value,
  onChange,
  format,
  onFormatChange,
  showAge = false,
  label,
  required = false,
  id,
  className = ''
}: DatePickerProps) {
  const [convertedDate, setConvertedDate] = useState('')
  const [age, setAge] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (value) {
      try {
        // Only convert if we have the conversion functions available
        let converted = ''
        if (format === 'BS' && typeof convertBSToAD === 'function') {
          converted = convertBSToAD(value)
        } else if (format === 'AD' && typeof convertADToBS === 'function') {
          converted = convertADToBS(value)
        }
        
        setConvertedDate(converted)
        setError('')
        
        if (showAge && typeof calculateAge === 'function') {
          const calculatedAge = calculateAge(value, format === 'BS')
          setAge(calculatedAge)
        }
      } catch (err) {
        console.error('Date conversion error:', err)
        setError('Invalid date format')
        setConvertedDate('')
        setAge(null)
      }
    } else {
      setConvertedDate('')
      setAge(null)
      setError('')
    }
  }, [value, format, showAge])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
  }

  const handleFormatToggle = () => {
    const newFormat = format === 'BS' ? 'AD' : 'BS'
    onFormatChange(newFormat)
    
    if (value) {
      try {
        let convertedValue = value
        if (format === 'BS' && typeof convertBSToAD === 'function') {
          convertedValue = convertBSToAD(value)
        } else if (format === 'AD' && typeof convertADToBS === 'function') {
          convertedValue = convertADToBS(value)
        }
        onChange(convertedValue)
      } catch (err) {
        console.error('Error converting date:', err)
        setError('Error converting date format')
      }
    }
  }

  return (
    <div className={`date-picker-container ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      <div className="input-group">
        <input
          type="date"
          id={id}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          value={value || ''}
          onChange={handleDateChange}
          required={required}
        />
        <button
          type="button"
          className={`btn btn-outline-primary ${format === 'BS' ? 'active' : ''}`}
          onClick={handleFormatToggle}
          title={`Switch to ${format === 'BS' ? 'AD' : 'BS'} format`}
        >
          {format}
        </button>
      </div>
      
      {error && (
        <div className="text-danger small mt-1">
          {error}
        </div>
      )}
      
      {value && !error && convertedDate && (
        <div className="mt-2">
          <small className="text-muted">
            <i className="bi bi-arrow-left-right me-1"></i>
            {format === 'BS' ? 'AD' : 'BS'}: {typeof formatDateDisplay === 'function' ? formatDateDisplay(convertedDate, format === 'BS' ? 'AD' : 'BS') : convertedDate}
          </small>
          {showAge && age !== null && (
            <div className="mt-1">
              <small className="text-info">
                <i className="bi bi-calendar-check me-1"></i>
                Age: {age} years old
              </small>
            </div>
          )}
        </div>
      )}
      
      {format === 'BS' && (
        <small className="text-muted d-block mt-1">
          <i className="bi bi-info-circle me-1"></i>
          Enter date in YYYY-MM-DD format (e.g., 2080-05-15)
        </small>
      )}
    </div>
  )
}