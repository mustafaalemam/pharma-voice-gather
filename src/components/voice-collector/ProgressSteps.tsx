
import React from 'react';

type Step = 'info' | 'sample' | 'record' | 'success';

interface ProgressStepsProps {
  currentStep: Step;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const steps: Step[] = ['info', 'sample', 'record', 'success'];

  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
              currentStep === step 
                ? 'bg-mint-500 text-white' 
                : index < steps.indexOf(currentStep)
                ? 'bg-mint-200 text-mint-800'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {index + 1}
            </div>
            {index < 3 && (
              <div className={`w-12 h-1 transition-colors duration-300 ${
                index < steps.indexOf(currentStep)
                  ? 'bg-mint-200'
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
