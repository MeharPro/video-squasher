import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

const DropZone = ({ onFileSelect }: DropZoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv']
    },
    maxSize: 10737418240, // 10GB in bytes
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`drop-zone w-full h-64 rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer
        ${isDragActive ? 'border-primary' : ''}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 text-primary mb-4" />
      <p className="text-lg mb-2">Drag & drop your video here</p>
      <p className="text-sm text-muted-foreground">
        Support for MP4, AVI, MOV, MKV (up to 10GB)
      </p>
    </div>
  );
};

export default DropZone;