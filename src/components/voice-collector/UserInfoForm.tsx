
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DRUG_NAMES = [
  'Paracetamol',
  'Ibuprofen',
  'Amoxicillin',
  'Metformin',
  'Atorvastatin',
  'Omeprazole',
  'Amlodipine',
  'Simvastatin',
  'Levothyroxine',
  'Warfarin',
  'Ciprofloxacin',
  'Prednisone',
  'Hydrochlorothiazide',
  'Acetaminophen',
  'Dexamethasone'
];

interface UserInfo {
  isFromPharmacy: boolean;
  pharmacyName: string;
  gender: string;
  drugName: string;
}

interface UserInfoFormProps {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  onSubmit: () => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ userInfo, setUserInfo, onSubmit }) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-center text-mint-800">
          👋 Welcome! Let's get started
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-ocean-700 font-medium mb-3 block">
            Are you from a pharmacy?
          </Label>
          <div className="flex gap-4">
            <Button
              variant={userInfo.isFromPharmacy === true ? "default" : "outline"}
              onClick={() => setUserInfo(prev => ({ ...prev, isFromPharmacy: true }))}
              className={userInfo.isFromPharmacy === true ? "bg-mint-500 hover:bg-mint-600 text-white" : "border-mint-200 text-mint-700 hover:bg-mint-50"}
            >
              Yes
            </Button>
            <Button
              variant={userInfo.isFromPharmacy === false ? "default" : "outline"}
              onClick={() => setUserInfo(prev => ({ ...prev, isFromPharmacy: false, pharmacyName: '' }))}
              className={userInfo.isFromPharmacy === false ? "bg-mint-500 hover:bg-mint-600 text-white" : "border-mint-200 text-mint-700 hover:bg-mint-50"}
            >
              No
            </Button>
          </div>
        </div>

        {userInfo.isFromPharmacy && (
          <div>
            <Label htmlFor="pharmacy" className="text-ocean-700 font-medium">
              Pharmacy Name
            </Label>
            <Input
              id="pharmacy"
              placeholder="e.g., Green Life Pharmacy"
              value={userInfo.pharmacyName}
              onChange={(e) => setUserInfo(prev => ({ ...prev, pharmacyName: e.target.value }))}
              className="mt-2 border-mint-200 focus:ring-mint-500"
            />
          </div>
        )}

        <div>
          <Label htmlFor="gender" className="text-ocean-700 font-medium">
            Gender
          </Label>
          <Select value={userInfo.gender} onValueChange={(value) => setUserInfo(prev => ({ ...prev, gender: value }))}>
            <SelectTrigger className="mt-2 border-mint-200 focus:ring-mint-500">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent className="bg-white border-mint-200">
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="drug" className="text-ocean-700 font-medium">
            Drug Name
          </Label>
          <Select value={userInfo.drugName} onValueChange={(value) => setUserInfo(prev => ({ ...prev, drugName: value }))}>
            <SelectTrigger className="mt-2 border-mint-200 focus:ring-mint-500">
              <SelectValue placeholder="Select a drug name to pronounce" />
            </SelectTrigger>
            <SelectContent className="bg-white border-mint-200 max-h-60">
              {DRUG_NAMES.map(drug => (
                <SelectItem key={drug} value={drug}>{drug}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={onSubmit}
          className="w-full bg-mint-500 hover:bg-mint-600 text-white py-3 text-lg"
        >
          Continue →
        </Button>
      </CardContent>
    </>
  );
};

export default UserInfoForm;
