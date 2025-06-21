
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface UserInfo {
  isFromPharmacy: boolean;
  pharmacyName: string;
  gender: string;
  drugName: string;
}

interface SuccessMessageProps {
  userInfo: UserInfo;
  onReset: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ userInfo, onReset }) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-center text-mint-800">
          🎉 Thank you!
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-mint-500" />
        </div>
        
        <div className="space-y-4">
          <p className="text-lg text-ocean-700">
            Your voice was recorded successfully!
          </p>
          <p className="text-mint-600 font-medium">
            You're helping us build a smarter, safer healthcare future. 💚
          </p>
        </div>

        <div className="bg-mint-50 p-4 rounded-lg">
          <p className="text-sm text-mint-800">
            <strong>Recorded:</strong> {userInfo.drugName}<br />
            <strong>Affiliation:</strong> {userInfo.isFromPharmacy ? userInfo.pharmacyName : 'Not from pharmacy'}<br />
            <strong>Gender:</strong> {userInfo.gender}
          </p>
        </div>

        <Button 
          onClick={onReset}
          className="bg-mint-500 hover:bg-mint-600 text-white px-8 py-3"
        >
          Record Another Drug →
        </Button>
      </CardContent>
    </>
  );
};

export default SuccessMessage;
