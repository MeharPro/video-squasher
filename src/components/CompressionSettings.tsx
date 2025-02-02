import React from 'react';
import { Slider } from "@/components/ui/slider";

interface CompressionSettingsProps {
  quality: number;
  setQuality: (value: number) => void;
}

const CompressionSettings = ({ quality, setQuality }: CompressionSettingsProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Quality</label>
        <Slider
          value={[quality]}
          onValueChange={(value) => setQuality(value[0])}
          min={1}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Higher Compression</span>
          <span>Better Quality</span>
        </div>
      </div>
    </div>
  );
};

export default CompressionSettings;