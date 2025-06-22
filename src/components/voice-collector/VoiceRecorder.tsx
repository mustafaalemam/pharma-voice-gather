import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Play, RotateCcw, ArrowLeft, ArrowRight, Square } from 'lucide-react';

interface VoiceRecorderProps {
  drugName: string;
  isRecording: boolean;
  recordedAudio: string | null;
  isPlayingRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayRecording: () => void;
  onRetakeRecording: () => void;
  onSubmitRecording: () => void;
  onBack: () => void;
  recordingAudioRef: React.RefObject<HTMLAudioElement>;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  drugName,
  isRecording,
  recordedAudio,
  isPlayingRecording,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
  onRetakeRecording,
  onSubmitRecording,
  onBack,
  recordingAudioRef
}) => {
  const handleRecordClick = () => {
    console.log('Record button clicked, current isRecording:', isRecording);
    if (isRecording) {
      console.log('Stopping recording...');
      onStopRecording();
    } else {
      console.log('Starting recording...');
      onStartRecording();
    }
  };

  return (
    <>
      <CardHeader className="text-center pb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-400 to-pink-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <span className="text-2xl">🎤</span>
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
          Record your pronunciation
        </CardTitle>
        <p className="text-ocean-600 mt-2">Speak clearly and confidently</p>
      </CardHeader>
      <CardContent className="text-center space-y-8 pb-8">
        <div className="bg-gradient-to-r from-mint-50 to-pink-50 p-6 rounded-2xl border border-mint-200">
          <p className="text-ocean-700 text-xl leading-relaxed">
            Press the microphone and clearly say{' '}
            <span className="font-bold text-2xl bg-gradient-to-r from-mint-600 to-pink-600 bg-clip-text text-transparent">
              "{drugName}"
            </span>
          </p>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <Button
              onClick={handleRecordClick}
              disabled={false}
              className={`w-28 h-28 rounded-full text-white text-lg font-bold shadow-2xl transition-all duration-300 ${
                isRecording 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse' 
                  : 'bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 hover:scale-110'
              }`}
            >
              {isRecording ? (
                <Square className="w-8 h-8 fill-current" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </Button>
            {isRecording && (
              <div className="absolute -inset-4 border-4 border-red-300 rounded-full animate-ping"></div>
            )}
          </div>
        </div>

        {isRecording && (
          <div className="animate-fade-in space-y-2">
            <p className="text-red-600 font-bold text-xl">
              🔴 Recording in progress...
            </p>
            <p className="text-red-500">
              Click the square button to stop recording
            </p>
          </div>
        )}

        {recordedAudio && (
          <div className="bg-gradient-to-r from-mint-50 to-green-50 p-6 rounded-2xl border-2 border-mint-200 space-y-6 animate-fade-in">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-mint-800 font-bold text-lg">Recording completed successfully!</p>
            </div>
            <div className="flex justify-center gap-4">
              <Button
                onClick={onPlayRecording}
                disabled={isPlayingRecording}
                variant="outline"
                className="h-12 px-6 border-2 border-ocean-200 text-ocean-700 hover:bg-ocean-50 rounded-xl font-semibold transition-all duration-300 hover:shadow-md"
              >
                <Play className="w-5 h-5 mr-2" />
                {isPlayingRecording ? 'Playing...' : 'Preview'}
              </Button>
              <Button
                onClick={onRetakeRecording}
                variant="outline"
                className="h-12 px-6 border-2 border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl font-semibold transition-all duration-300 hover:shadow-md"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="w-full sm:w-auto h-12 px-8 border-2 border-mint-200 text-mint-700 hover:bg-mint-50 hover:border-mint-300 rounded-xl font-semibold transition-all duration-300 hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          {recordedAudio && (
            <Button 
              onClick={onSubmitRecording}
              className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-green-500 to-mint-600 hover:from-green-600 hover:to-mint-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Submit Recording
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>

        <audio ref={recordingAudioRef} style={{ display: 'none' }} />
      </CardContent>
    </>
  );
};

export default VoiceRecorder;
