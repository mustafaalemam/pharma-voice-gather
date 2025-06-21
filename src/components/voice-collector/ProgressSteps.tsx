
import React from 'react';

type Step = 'info' | 'sample' | 'record' | 'success';

interface ProgressStepsProps {
  currentStep: Step;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const steps: { id: Step; label: string; icon: string }[] = [
    { id: 'info', label: 'Info', icon: '📝' },
    { id: 'sample', label: 'Sample', icon: '🔊' },
    { id: 'record', label: 'Record', icon: '🎤' },
    { id: 'success', label: 'Success', icon: '🎉' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="flex justify-center mb-12">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 shadow-lg ${
                currentStep === step.id 
                  ? 'bg-gradient-to-r from-mint-500 to-ocean-500 text-white shadow-xl scale-110' 
                  : index < currentStepIndex
                  ? 'bg-gradient-to-r from-mint-200 to-mint-300 text-mint-800 shadow-md'
                  : 'bg-gray-100 text-gray-400 shadow-sm'
              }`}>
                <span className="text-xl">{step.icon}</span>
              </div>
              <span className={`mt-2 text-sm font-semibold transition-colors duration-300 ${
                currentStep === step.id 
                  ? 'text-mint-600' 
                  : index < currentStepIndex
                  ? 'text-mint-500'
                  : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {index < 3 && (
              <div className={`w-16 h-1 mx-4 rounded-full transition-all duration-500 ${
                index < currentStepIndex
                  ? 'bg-gradient-to-r from-mint-300 to-mint-400 shadow-sm'
                  : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
