'use client'

import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalInfoSchema, documentInfoSchema, PersonalInfoForm, DocumentInfoForm, CompleteFormData } from '@/lib/validations'
import FormStepper from '@/components/forms/FormStepper'
import PersonalInfoStep from '@/components/forms/PersonalInfoStep'
import DocumentInfoStep from '@/components/forms/DocumentInfoStep'

const steps = [
  {
    title: 'Personal Info',
    description: 'Basic information'
  },
  {
    title: 'Documents',
    description: 'Upload documents'
  }
]

// Constants for default values
const DEFAULT_PERSONAL_VALUES: PersonalInfoForm = {
  fullNameEnglish: '',
  fullNameNepali: '',
  gender: undefined as any, // Temporary cast until form loads
  dateOfBirth: '',
  dateFormat: 'BS',
  phoneNumber: ''
}

const DEFAULT_DOCUMENT_VALUES: DocumentInfoForm = {
  citizenshipNumber: '',
  issuedDistrict: '',
  issuedDate: '',
  issuedDateFormat: 'BS',
  citizenshipFront: [],
  citizenshipBack: []
}

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Form for step 1 (Personal Information)
  const personalForm = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_PERSONAL_VALUES
  })

  // Form for step 2 (Document Information)
  const documentForm = useForm<DocumentInfoForm>({
    resolver: zodResolver(documentInfoSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_DOCUMENT_VALUES
  })

  const onContinue = async () => {
    try {
      setSubmitError(null)
      const isValid = await personalForm.trigger()
      if (isValid) {
        setCurrentStep(2)
      }
    } catch (error) {
      console.error('Validation error:', error)
      setSubmitError('Please fix the errors above before continuing')
    }
  }

  const onBack = () => {
    setSubmitError(null)
    setCurrentStep(1)
  }

  const onSubmit = async (data: DocumentInfoForm) => {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Get personal info data
      const personalData = personalForm.getValues()

      // Validate personal data one more time
      const validatedPersonalData = personalInfoSchema.parse(personalData)
      const validatedDocumentData = documentInfoSchema.parse(data)

      // Combine both form data
      const completeData: CompleteFormData = {
        ...validatedPersonalData,
        ...validatedDocumentData
      }

      // Log the complete form data
      console.log('Complete Form Data:', completeData)

      // Here you would typically send the data to your API
      // const response = await submitFormData(completeData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Show success message (replace with proper toast/notification)
      console.log('✅ Form submitted successfully!')
      
      // Reset forms and go back to step 1
      await resetForms()
      
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'An error occurred while submitting the form. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForms = async () => {
    try {
      personalForm.reset(DEFAULT_PERSONAL_VALUES)
      documentForm.reset(DEFAULT_DOCUMENT_VALUES)
      setCurrentStep(1)
      setSubmitError(null)
    } catch (error) {
      console.error('Error resetting forms:', error)
    }
  }

  const handleFormError = (error: any) => {
    console.error('Form error:', error)
    setSubmitError('Please check your form data and try again')
  }

  return (
    <div className="card shadow">
      <div className="card-body">
        <FormStepper
          currentStep={currentStep}
          totalSteps={2}
          steps={steps}
        />

        {/* Error Display */}
        {submitError && (
          <div className="alert alert-danger mb-4" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {submitError}
          </div>
        )}

        {currentStep === 1 && (
          <FormProvider {...personalForm}>
            <form onSubmit={(e) => e.preventDefault()}>
              <PersonalInfoStep />
              
              {/* Form validation errors */}
              {Object.keys(personalForm.formState.errors).length > 0 && (
                <div className="alert alert-warning mt-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Please fix the errors above before continuing
                </div>
              )}
              
              <div className="d-flex justify-content-end mt-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onContinue}
                  disabled={!personalForm.formState.isValid && personalForm.formState.isSubmitted}
                >
                  Continue
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </form>
          </FormProvider>
        )}

        {currentStep === 2 && (
          <FormProvider {...documentForm}>
            <form onSubmit={documentForm.handleSubmit(onSubmit, handleFormError)}>
              <DocumentInfoStep />
              
              {/* Form validation errors */}
              {Object.keys(documentForm.formState.errors).length > 0 && (
                <div className="alert alert-warning mt-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Please fix the errors above before submitting
                </div>
              )}
              
              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onBack}
                  disabled={isSubmitting}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isSubmitting || !documentForm.formState.isValid}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Form
                      <i className="bi bi-check-lg ms-2"></i>
                    </>
                  )}
                </button>
              </div>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  )
}