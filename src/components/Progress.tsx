import React from 'react';
import { Progress as ProgressBar } from "@/components/ui/progress";

interface ProgressProps {
  progress: number;
  status: string;
}

const Progress = ({ progress, status }: ProgressProps) => {
  return (
    <div className="w-full space-y-2">
      <ProgressBar value={progress} className="w-full" />
      <p className="text-sm text-center text-muted-foreground">{status}</p>
    </div>
  );
};

export default Progress;