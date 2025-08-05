'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatFileSize } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (files: File[]) => void
  acceptedTypes?: string[]
  maxSize?: number
  label: string
  required?: boolean
  currentFile?: File | null
}

export default function FileUpload({
  onFileSelect,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'],
  maxSize = 5 * 1024 * 1024, // 5MB
  label,
  required = false,
  currentFile = null
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`File is too large. Maximum size is ${formatFileSize(maxSize)}`)
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Please select an image or PDF file.')
      } else {
        setError('File upload failed. Please try again.')
      }
      return
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles)
    }
  }, [onFileSelect, maxSize])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    maxFiles: 1,
    multiple: false
  })

  const removeFile = () => {
    onFileSelect([])
    setError(null)
  }

  return (
    <div className="mb-3">
      <label className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      
      {!currentFile ? (
        <div
          {...getRootProps()}
          className={`file-upload-area ${isDragActive ? 'drag-active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <i className="bi bi-cloud-upload fs-1 text-muted mb-3"></i>
            <div className="mb-2">
              {isDragActive ? (
                <p className="mb-0">Drop the file here...</p>
              ) : (
                <>
                  <p className="mb-0">Drag & drop a file here, or click to select</p>
                  <small className="text-muted">
                    Supported: JPG, PNG, WebP, PDF (Max: {formatFileSize(maxSize)})
                  </small>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded p-3 bg-light">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className={`bi ${currentFile.type.includes('pdf') ? 'bi-file-pdf' : 'bi-image'} fs-4 text-primary me-3`}></i>
              <div>
                <div className="fw-medium">{currentFile.name}</div>
                <small className="text-muted">{formatFileSize(currentFile.size)}</small>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={removeFile}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="text-danger small mt-2">
          <i className="bi bi-exclamation-circle me-1"></i>
          {error}
        </div>
      )}
    </div>
  )
}
