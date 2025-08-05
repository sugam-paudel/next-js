interface FormStepperProps {
  currentStep: number
  totalSteps: number
  steps: { title: string; description?: string }[]
}

export default function FormStepper({ currentStep, totalSteps, steps }: FormStepperProps) {
  return (
    <div className="stepper">
      <div className="row">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          
          return (
            <div key={index} className="col">
              <div className="text-center">
                <div
                  className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  {isCompleted ? (
                    <i className="bi bi-check-lg"></i>
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className={`step-title ${isActive ? 'active' : ''}`}>
                  <div className="fw-medium">{step.title}</div>
                  {step.description && (
                    <small className="text-muted d-block">{step.description}</small>
                  )}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className="position-absolute top-50 start-100 translate-middle-y"
                  style={{ 
                    width: '100%', 
                    height: '2px', 
                    backgroundColor: isCompleted ? 'var(--bs-success)' : '#dee2e6',
                    zIndex: -1 
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}