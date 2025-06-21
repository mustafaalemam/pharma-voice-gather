
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause } from 'lucide-react';

interface SampleAudioPlayerProps {
  drugName: string;
  isPlayingSample: boolean;
  onPlaySample: () => void;
  onBack: () => void;
  onNext: () => void;
}

const SampleAudioPlayer: React.FC<SampleAudioPlayerProps> = ({
  drugName,
  isPlayingSample,
  onPlaySample,
  onBack,
  onNext
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-center text-mint-800">
          🔊 Listen to the sample
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <p className="text-ocean-700 text-lg">
          Before recording, listen to how <span className="font-bold text-mint-600">"{drugName}"</span> should be pronounced.
        </p>
        
        <div className="flex justify-center">
          <Button
            onClick={onPlaySample}
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
            onClick={onBack}
            className="border-mint-200 text-mint-700 hover:bg-mint-50"
          >
            ← Back
          </Button>
          <Button 
            onClick={onNext}
            className="bg-mint-500 hover:bg-mint-600 text-white"
          >
            Ready to Record →
          </Button>
        </div>
      </CardContent>
    </>
  );
};

export default SampleAudioPlayer;
