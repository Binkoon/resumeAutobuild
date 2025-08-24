import React from 'react';

export interface BreadcrumbStep {
  id: string;
  title: string;
  isCompleted: boolean;
  isRequired: boolean;
  isCurrent: boolean;
}

interface BreadcrumbNavProps {
  steps: BreadcrumbStep[];
  onStepClick: (stepId: string) => void;
  currentStep: string;
}

export function BreadcrumbNav({ steps, onStepClick, currentStep }: BreadcrumbNavProps) {
  const getStepStatus = (step: BreadcrumbStep) => {
    if (step.isCurrent) return 'current';
    if (step.isCompleted) return 'completed';
    if (step.isRequired && !step.isCompleted) return 'required';
    return 'optional';
  };

  const getStepIcon = (step: BreadcrumbStep) => {
    const status = getStepStatus(step);
    
    switch (status) {
      case 'completed':
        return '✓';
      case 'current':
        return '●';
      case 'required':
        return '!';
      default:
        return '○';
    }
  };

  const getStepClass = (step: BreadcrumbStep) => {
    const status = getStepStatus(step);
    return `breadcrumb-step ${status}`;
  };

  return (
    <div className="breadcrumb-nav">
      <div className="breadcrumb-container">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div 
              className={getStepClass(step)}
              onClick={() => onStepClick(step.id)}
            >
              <div className="step-icon">
                {getStepIcon(step)}
              </div>
              <div className="step-title">
                {step.title}
                {step.isRequired && <span className="required-mark">*</span>}
              </div>
              {step.isCompleted && (
                <div className="completion-indicator">
                  완료
                </div>
              )}
            </div>
            
            {index < steps.length - 1 && (
              <div className="step-connector">
                <div className="connector-line"></div>
                <div className="connector-arrow">›</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="breadcrumb-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${(steps.filter(s => s.isCompleted).length / steps.length) * 100}%` 
            }}
          ></div>
        </div>
        <span className="progress-text">
          {steps.filter(s => s.isCompleted).length} / {steps.length} 완료
        </span>
      </div>
    </div>
  );
}
