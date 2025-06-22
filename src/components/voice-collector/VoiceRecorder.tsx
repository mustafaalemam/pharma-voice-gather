
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
    if (!isRecording) {
      console.log('Starting recording...');
      onStartRecording();
    }
  };

  const handleStopClick = () => {
    console.log('Stop button clicked');
    onStopRecording();
  };

  return (
    <>
      <CardHeader className="text-center pb-6 px-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-400 to-pink-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <span className="text-2xl">🎤</span>
        </div>
        <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
          Record your pronunciation
        </CardTitle>
        <p className="text-ocean-600 mt-2 text-sm md:text-base">Speak clearly and confidently</p>
      </CardHeader>
      
      <CardContent className="text-center space-y-6 pb-6 px-4">
        <div className="bg-gradient-to-r from-mint-50 to-pink-50 p-4 md:p-6 rounded-2xl border border-mint-200">
          <p className="text-ocean-700 text-lg md:text-xl leading-relaxed">
            Press the microphone and clearly say{' '}
            <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-mint-600 to-pink-600 bg-clip-text text-transparent block mt-2">
              "{drugName}"
            </span>
          </p>
        </div>

        {/* Recording Controls - Mobile Optimized */}
        <div className="flex flex-col items-center space-y-6">
          {!isRecording && !recordedAudio && (
            <div className="relative">
              <Button
                onClick={handleRecordClick}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-mint-300"
              >
                <div className="flex flex-col items-center">
                  <Mic className="w-10 h-10 md:w-12 md:h-12 mb-1" />
                  <span className="text-xs md:text-sm font-semibold">START</span>
                </div>
              </Button>
            </div>
          )}

          {isRecording && (
            <div className="flex flex-col items-center space-y-6 animate-fade-in">
              <div className="relative">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center animate-pulse border-4 border-red-300">
                  <div className="flex flex-col items-center text-white">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse mb-2"></div>
                    <span className="text-xs md:text-sm font-semibold">RECORDING</span>
                  </div>
                </div>
                <div className="absolute -inset-4 border-4 border-red-300 rounded-full animate-ping"></div>
              </div>
              
              {/* Dedicated Stop Button */}
              <Button
                onClick={handleStopClick}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center">
                  <Square className="w-8 h-8 md:w-10 md:h-10 fill-current mb-1" />
                  <span className="text-xs md:text-sm font-semibold">STOP</span>
                </div>
              </Button>
              
              <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200 max-w-sm">
                <p className="text-red-600 font-bold text-lg flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Recording in progress...
                </p>
                <p className="text-red-600 font-medium text-sm mt-2">
                  Tap the STOP button below to finish
                </p>
              </div>
            </div>
          )}
        </div>

        {recordedAudio && (
          <div className="bg-gradient-to-r from-mint-50 to-green-50 p-4 md:p-6 rounded-2xl border-2 border-mint-200 space-y-4 animate-fade-in">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-mint-800 font-bold text-base md:text-lg">Recording completed!</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                onClick={onPlayRecording}
                disabled={isPlayingRecording}
                variant="outline"
                className="h-12 px-6 border-2 border-ocean-200 text-ocean-700 hover:bg-ocean-50 rounded-xl font-semibold transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                {isPlayingRecording ? 'Playing...' : 'Preview'}
              </Button>
              <Button
                onClick={onRetakeRecording}
                variant="outline"
                className="h-12 px-6 border-2 border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl font-semibold transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake
              </Button>
            </div>
          </div>
        )}

        {/* Mobile-Optimized Bottom Navigation */}
        <div className="pt-6 border-t border-gray-200 space-y-4">
          <div className="flex flex-col gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="w-full h-14 border-2 border-mint-200 text-mint-700 hover:bg-mint-50 hover:border-mint-300 rounded-xl font-semibold transition-all duration-300 text-base"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
            
            {recordedAudio && (
              <Button 
                onClick={onSubmitRecording}
                className="w-full h-14 bg-gradient-to-r from-green-500 to-mint-600 hover:from-green-600 hover:to-mint-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-base"
              >
                Submit Recording
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
          
          {!recordedAudio && !isRecording && (
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Tap the microphone to start recording
              </p>
            </div>
          )}
        </div>

        <audio ref={recordingAudioRef} style={{ display: 'none' }} />
      </CardContent>
    </>
  );
};

export default VoiceRecorder;
