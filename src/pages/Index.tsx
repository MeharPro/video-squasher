import VideoCompressor from "@/components/VideoCompressor";

const Index = () => {
  return (
    <div className="min-h-screen gradient-bg py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Video Compressor
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Compress your videos without losing quality. Support for files up to 10GB.
        </p>
        
        <VideoCompressor />
      </div>
    </div>
  );
};

export default Index;