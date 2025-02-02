import React, { useState, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import DropZone from './DropZone';
import CompressionSettings from './CompressionSettings';
import Progress from './Progress';
import { Download, Loader2 } from 'lucide-react';

const VideoCompressor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(50);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [compressed, setCompressed] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const { toast } = useToast();
  const ffmpeg = new FFmpeg();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setCompressed(null);
    setProgress(0);
    setStatus('');
  };

  const compressVideo = async () => {
    if (!file) return;

    try {
      setIsCompressing(true);
      setProgress(0);
      setStatus('Loading compression engine...');

      if (!ffmpeg.loaded) {
        await ffmpeg.load({
          coreURL: await toBlobURL(`/node_modules/@ffmpeg/core/dist/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`/node_modules/@ffmpeg/core/dist/ffmpeg-core.wasm`, 'application/wasm'),
        });
      }

      setProgress(20);
      setStatus('Preparing video...');
      
      const inputFileName = 'input.mp4';
      const outputFileName = 'output.mp4';
      
      await ffmpeg.writeFile(inputFileName, await fetchFile(file));

      setProgress(40);
      setStatus('Compressing video...');
      
      await ffmpeg.exec([
        '-i', inputFileName,
        '-crf', String(51 - (quality / 2)),
        '-preset', 'medium',
        outputFileName
      ]);

      setProgress(80);
      setStatus('Finalizing...');

      const data = await ffmpeg.readFile(outputFileName);
      const uint8Array = new Uint8Array(data as ArrayBufferLike);
      const compressedUrl = URL.createObjectURL(
        new Blob([uint8Array], { type: 'video/mp4' })
      );

      setCompressed(compressedUrl);
      setProgress(100);
      setStatus('Compression complete!');

      toast({
        title: "Compression Complete",
        description: "Your video has been successfully compressed!",
      });

    } catch (error) {
      console.error('Compression error:', error);
      toast({
        variant: "destructive",
        title: "Compression Failed",
        description: "There was an error compressing your video.",
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressed) return;
    
    const a = document.createElement('a');
    a.href = compressed;
    a.download = 'compressed-video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <DropZone onFileSelect={handleFileSelect} />
      
      {file && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
          
          <CompressionSettings quality={quality} setQuality={setQuality} />
          
          {(progress > 0 || isCompressing) && <Progress progress={progress} status={status} />}
          
          <div className="flex gap-4">
            <Button
              onClick={compressVideo}
              disabled={!file || isCompressing}
              className="w-full"
            >
              {isCompressing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Compressing...
                </>
              ) : (
                'Compress Video'
              )}
            </Button>
            
            {compressed && (
              <Button onClick={downloadCompressed} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCompressor;