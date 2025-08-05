'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { DocumentInfoForm, nepaliDistricts } from '@/lib/validations'
import DatePicker from '@/components/ui/Date'
import FileUpload from '@/components/ui/FileUpload'

export default function DocumentInfoStep() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useFormContext<DocumentInfoForm>()
  
  const issuedDateFormat = watch('issuedDateFormat')
  const issuedDate = watch('issuedDate')
  const citizenshipFront = watch('citizenshipFront')
  const citizenshipBack = watch('citizenshipBack')

  // Helper function to safely get the first file
  const getFirstFile = (files: File[] | undefined | null): File | null => {
    return Array.isArray(files) && files.length > 0 ? files[0] : null
  }

  return (
    <div className="form-step">
      <div className="row">
        <div className="col-12">
          <h4 className="mb-4">
            <i className="bi bi-file-earmark-text me-2"></i>
            Document Information
          </h4>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="citizenshipNumber" className="form-label">
            Citizenship Number <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="citizenshipNumber"
            className={`form-control ${errors.citizenshipNumber ? 'is-invalid' : ''}`}
            placeholder="Enter citizenship number"
            {...register('citizenshipNumber')}
          />
          {errors.citizenshipNumber && (
            <div className="invalid-feedback">
              {errors.citizenshipNumber.message}
            </div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="issuedDistrict" className="form-label">
            Issued District <span className="text-danger">*</span>
          </label>
          <select
            id="issuedDistrict"
            className={`form-select ${errors.issuedDistrict ? 'is-invalid' : ''}`}
            {...register('issuedDistrict')}
          >
            <option value="">Select District</option>
            {nepaliDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors.issuedDistrict && (
            <div className="invalid-feedback">
              {errors.issuedDistrict.message}
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <DatePicker
            id="issuedDate"
            label="Issued Date"
            value={issuedDate || ''}
            onChange={(value) => setValue('issuedDate', value)}
            format={issuedDateFormat}
            onFormatChange={(format) => setValue('issuedDateFormat', format)}
            required
          />
          {errors.issuedDate && (
            <div className="text-danger small mt-1">
              {errors.issuedDate.message}
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <FileUpload
            label="Citizenship Front Image"
            onFileSelect={(files) => setValue('citizenshipFront', files)}
            currentFile={getFirstFile(citizenshipFront)}
            required
          />
          {errors.citizenshipFront && (
            <div className="text-danger small">
              {errors.citizenshipFront.message}
            </div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <FileUpload
            label="Citizenship Back Image"
            onFileSelect={(files) => setValue('citizenshipBack', files)}
            currentFile={getFirstFile(citizenshipBack)}
            required
          />
          {errors.citizenshipBack && (
            <div className="text-danger small">
              {errors.citizenshipBack.message}
            </div>
          )}
        </div>
      </div>

      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2"></i>
        <strong>Note:</strong> Please ensure that uploaded images are clear and readable. 
        Supported formats: JPG, PNG, WebP, PDF (Max size: 5MB each)
      </div>
    </div>
  )
}