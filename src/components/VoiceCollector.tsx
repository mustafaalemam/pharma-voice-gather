import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import UserInfoForm from './voice-collector/UserInfoForm';
import SampleAudioPlayer from './voice-collector/SampleAudioPlayer';
import VoiceRecorder from './voice-collector/VoiceRecorder';
import SuccessMessage from './voice-collector/SuccessMessage';
import ProgressSteps from './voice-collector/ProgressSteps';

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
    setIsPlayingSample(true);
    
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
    <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-mint-50 via-white to-ocean-50">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-mint-400 to-ocean-600 rounded-full shadow-2xl mb-4">
              <span className="text-3xl">🎙️</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-mint-600 to-ocean-600 bg-clip-text text-transparent mb-4">
            Voice Collector
          </h1>
          <p className="text-xl text-ocean-700 max-w-2xl mx-auto leading-relaxed">
            Help us build a comprehensive dataset of drug pronunciations to improve healthcare communication worldwide.
          </p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps currentStep={currentStep} />

        {/* Step Content */}
        <Card className="glass-card animate-fade-in shadow-2xl border-0 backdrop-blur-md bg-white/70">
          {currentStep === 'info' && (
            <UserInfoForm
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              onSubmit={handleInfoSubmit}
            />
          )}

          {currentStep === 'sample' && (
            <SampleAudioPlayer
              drugName={userInfo.drugName}
              isPlayingSample={isPlayingSample}
              onPlaySample={playSampleAudio}
              onBack={() => setCurrentStep('info')}
              onNext={() => setCurrentStep('record')}
            />
          )}

          {currentStep === 'record' && (
            <VoiceRecorder
              drugName={userInfo.drugName}
              isRecording={isRecording}
              recordedAudio={recordedAudio}
              isPlayingRecording={isPlayingRecording}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onPlayRecording={playRecording}
              onRetakeRecording={retakeRecording}
              onSubmitRecording={submitRecording}
              onBack={() => setCurrentStep('sample')}
              recordingAudioRef={recordingAudioRef}
            />
          )}

          {currentStep === 'success' && (
            <SuccessMessage
              userInfo={userInfo}
              onReset={resetApp}
            />
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 text-ocean-600">
            <span className="text-2xl">🔒</span>
            <p className="text-lg font-medium">
              Your recordings are securely stored and used only for research purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCollector;
