'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { PersonalInfoForm } from '@/lib/validations'
import NepaliInput from '@/components/ui/NepaliInput'
import DatePicker from '@/components/ui/Date'

export default function PersonalInfoStep() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<PersonalInfoForm>()

  // Always default to 'BS' to match schema and defaultValues
  const dateFormat = watch('dateFormat') ?? 'BS'
  const dateOfBirth = watch('dateOfBirth') || ''
  const fullNameNepali = watch('fullNameNepali') || ''

  return (
    <div className="form-step">
      <div className="row">
        <div className="col-12">
          <h4 className="mb-4">
            <i className="bi bi-person-circle me-2"></i>
            Personal Information
          </h4>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="fullNameEnglish" className="form-label">
            Full Name (English) <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="fullNameEnglish"
            className={`form-control ${errors.fullNameEnglish ? 'is-invalid' : ''}`}
            placeholder="Enter your full name in English"
            {...register('fullNameEnglish')}
          />
          {errors.fullNameEnglish && (
            <div className="invalid-feedback">
              {errors.fullNameEnglish.message}
            </div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="fullNameNepali" className="form-label">
            Full Name (Nepali) <span className="text-danger">*</span>
          </label>
          <NepaliInput
            id="fullNameNepali"
            value={fullNameNepali}
            onChange={(value) => setValue('fullNameNepali', value)}
            placeholder="नेपालीमा आफ्नो पूरा नाम लेख्नुहोस्"
            className={errors.fullNameNepali ? 'is-invalid' : ''}
            required
          />
          {errors.fullNameNepali && (
            <div className="invalid-feedback d-block">
              {errors.fullNameNepali.message}
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="gender" className="form-label">
            Gender <span className="text-danger">*</span>
          </label>
          <select
            id="gender"
            className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
            {...register('gender')}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <div className="invalid-feedback">
              {errors.gender.message}
            </div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <DatePicker
            id="dateOfBirth"
            label="Date of Birth"
            value={dateOfBirth}
            onChange={(value) => setValue('dateOfBirth', value)}
            format={dateFormat}
            onFormatChange={(format) => setValue('dateFormat', format)}
            showAge={true}
            required={true}
            className={errors.dateOfBirth ? 'is-invalid' : ''}
          />
          {errors.dateOfBirth && (
            <div className="text-danger small mt-1">
              {errors.dateOfBirth.message}
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text">+977</span>
            <input
              type="tel"
              id="phoneNumber"
              className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
              placeholder="9876543210"
              maxLength={10}
              {...register('phoneNumber')}
            />
            {errors.phoneNumber && (
              <div className="invalid-feedback">
                {errors.phoneNumber.message}
              </div>
            )}
          </div>
          <small className="form-text text-muted">
            Enter 10-digit number starting with 9
          </small>
        </div>
      </div>
    </div>
  )
}