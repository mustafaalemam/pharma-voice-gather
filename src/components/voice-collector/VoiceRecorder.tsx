
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Play, RotateCcw } from 'lucide-react';

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
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-center text-mint-800">
          🎤 Record your pronunciation
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <p className="text-ocean-700 text-lg">
          Press the microphone and clearly say <span className="font-bold text-mint-600">"{drugName}"</span>
        </p>

        <div className="flex justify-center">
          <Button
            onClick={isRecording ? onStopRecording : onStartRecording}
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
                onClick={onPlayRecording}
                disabled={isPlayingRecording}
                variant="outline"
                className="border-ocean-200 text-ocean-700 hover:bg-ocean-50"
              >
                <Play className="w-4 h-4 mr-2" />
                {isPlayingRecording ? 'Playing...' : 'Play'}
              </Button>
              <Button
                onClick={onRetakeRecording}
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
            onClick={onBack}
            className="border-mint-200 text-mint-700 hover:bg-mint-50"
          >
            ← Back
          </Button>
          {recordedAudio && (
            <Button 
              onClick={onSubmitRecording}
              className="bg-mint-500 hover:bg-mint-600 text-white"
            >
              Submit Recording →
            </Button>
          )}
        </div>

        <audio ref={recordingAudioRef} style={{ display: 'none' }} />
      </CardContent>
    </>
  );
};

export default VoiceRecorder;
