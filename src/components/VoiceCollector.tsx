
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

type Step = 'info' | 'sample' | 'record' | 'success';

const VoiceCollector = () => {
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    isFromPharmacy: false,
    pharmacyName: '',
    gender: '',
    drugName: ''
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const sampleAudioRef = useRef<HTMLAudioElement | null>(null);
  const recordingAudioRef = useRef<HTMLAudioElement | null>(null);
  
  const { toast } = useToast();

  const handleInfoSubmit = () => {
    if ((userInfo.isFromPharmacy && !userInfo.pharmacyName) || !userInfo.gender || !userInfo.drugName) {
      toast({
        title: "Please fill in all fields",
        description: "We need all information to proceed.",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep('sample');
  };

  const playSampleAudio = () => {
    // In a real app, this would play from /samples/{drugname}.mp3
    setIsPlayingSample(true);
    
    // Simulate sample audio playback
    setTimeout(() => {
      setIsPlayingSample(false);
      toast({
        title: "Sample played",
        description: `Listen carefully to how "${userInfo.drugName}" should be pronounced.`
      });
    }, 2000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: `Please pronounce "${userInfo.drugName}" clearly.`
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Please allow microphone access to record your voice.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (recordedAudio && recordingAudioRef.current) {
      recordingAudioRef.current.src = recordedAudio;
      recordingAudioRef.current.play();
      setIsPlayingRecording(true);
      
      recordingAudioRef.current.onended = () => {
        setIsPlayingRecording(false);
      };
    }
  };

  const retakeRecording = () => {
    setRecordedAudio(null);
    if (recordingAudioRef.current) {
      recordingAudioRef.current.pause();
      recordingAudioRef.current.currentTime = 0;
    }
    setIsPlayingRecording(false);
  };

  const submitRecording = () => {
    // In a real app, this would upload to Google Cloud Storage
    const timestamp = new Date().toISOString();
    const filename = `audio_${timestamp.replace(/[:.]/g, '-')}.wav`;
    const folder = `dataset/${userInfo.gender.toLowerCase()}/${userInfo.drugName.toLowerCase()}`;
    
    console.log('Uploading to:', `${folder}/${filename}`);
    console.log('Metadata:', {
      drug: userInfo.drugName,
      gender: userInfo.gender,
      pharmacy: userInfo.isFromPharmacy ? userInfo.pharmacyName : 'Not from pharmacy',
      timestamp
    });

    // Simulate upload success
    setTimeout(() => {
      setCurrentStep('success');
      toast({
        title: "Upload successful!",
        description: "Your voice recording has been saved to our dataset."
      });
    }, 1500);
  };

  const resetApp = () => {
    setCurrentStep('info');
    setUserInfo({ isFromPharmacy: false, pharmacyName: '', gender: '', drugName: '' });
    setRecordedAudio(null);
    setIsRecording(false);
    setIsPlayingSample(false);
    setIsPlayingRecording(false);
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-mint-800 mb-4">
            🎙️ Voice Collector
          </h1>
          <p className="text-lg text-ocean-700 max-w-xl mx-auto">
            Help us build a comprehensive dataset of drug pronunciations to improve healthcare communication worldwide.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {(['info', 'sample', 'record', 'success'] as Step[]).map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                  currentStep === step 
                    ? 'bg-mint-500 text-white' 
                    : index < (['info', 'sample', 'record', 'success'] as Step[]).indexOf(currentStep)
                    ? 'bg-mint-200 text-mint-800'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-12 h-1 transition-colors duration-300 ${
                    index < (['info', 'sample', 'record', 'success'] as Step[]).indexOf(currentStep)
                      ? 'bg-mint-200'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="glass-card animate-fade-in">
          {currentStep === 'info' && (
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
                  onClick={handleInfoSubmit}
                  className="w-full bg-mint-500 hover:bg-mint-600 text-white py-3 text-lg"
                >
                  Continue →
                </Button>
              </CardContent>
            </>
          )}

          {currentStep === 'sample' && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl text-center text-mint-800">
                  🔊 Listen to the sample
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-ocean-700 text-lg">
                  Before recording, listen to how <span className="font-bold text-mint-600">"{userInfo.drugName}"</span> should be pronounced.
                </p>
                
                <div className="flex justify-center">
                  <Button
                    onClick={playSampleAudio}
                    disabled={isPlayingSample}
                    className="bg-ocean-500 hover:bg-ocean-600 text-white px-8 py-4 text-lg"
                  >
                    {isPlayingSample ? (
                      <>
                        <Pause className="w-6 h-6 mr-2" />
                        Playing Sample...
                      </>
                    ) : (
                      <>
                        <Play className="w-6 h-6 mr-2" />
                        Play Sample
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('info')}
                    className="border-mint-200 text-mint-700 hover:bg-mint-50"
                  >
                    ← Back
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep('record')}
                    className="bg-mint-500 hover:bg-mint-600 text-white"
                  >
                    Ready to Record →
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 'record' && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl text-center text-mint-800">
                  🎤 Record your pronunciation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-ocean-700 text-lg">
                  Press the microphone and clearly say <span className="font-bold text-mint-600">"{userInfo.drugName}"</span>
                </p>

                <div className="flex justify-center">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-24 h-24 rounded-full text-white text-lg font-bold transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 recording-pulse' 
                        : 'bg-mint-500 hover:bg-mint-600 hover:scale-105'
                    }`}
                  >
                    {isRecording ? (
                      <MicOff className="w-8 h-8" />
                    ) : (
                      <Mic className="w-8 h-8" />
                    )}
                  </Button>
                </div>

                {isRecording && (
                  <p className="text-red-600 font-medium animate-pulse">
                    🔴 Recording... Click to stop
                  </p>
                )}

                {recordedAudio && (
                  <div className="bg-mint-50 p-4 rounded-lg space-y-4">
                    <p className="text-mint-800 font-medium">Great! Here's your recording:</p>
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={playRecording}
                        disabled={isPlayingRecording}
                        variant="outline"
                        className="border-ocean-200 text-ocean-700 hover:bg-ocean-50"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {isPlayingRecording ? 'Playing...' : 'Play'}
                      </Button>
                      <Button
                        onClick={retakeRecording}
                        variant="outline"
                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('sample')}
                    className="border-mint-200 text-mint-700 hover:bg-mint-50"
                  >
                    ← Back
                  </Button>
                  {recordedAudio && (
                    <Button 
                      onClick={submitRecording}
                      className="bg-mint-500 hover:bg-mint-600 text-white"
                    >
                      Submit Recording →
                    </Button>
                  )}
                </div>

                <audio ref={recordingAudioRef} style={{ display: 'none' }} />
              </CardContent>
            </>
          )}

          {currentStep === 'success' && (
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
                  onClick={resetApp}
                  className="bg-mint-500 hover:bg-mint-600 text-white px-8 py-3"
                >
                  Record Another Drug →
                </Button>
              </CardContent>
            </>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-ocean-600">
          <p>🔒 Your recordings are securely stored and used only for research purposes.</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceCollector;
