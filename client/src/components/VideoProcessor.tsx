import { useState, useEffect } from 'react';
import { Crop, RotateCw, Clock, Settings, Play, Square, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface VideoProcessorProps {
  videoUrl: string;
  onProcessingComplete?: (processedVideoUrl: string) => void;
}

export function VideoProcessor({ videoUrl, onProcessingComplete }: VideoProcessorProps) {
  const [videoReady, setVideoReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  
  // Processing settings
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [addWatermark, setAddWatermark] = useState(false);
  const [adjustSpeed, setAdjustSpeed] = useState(1);
  const [trimStartTime, setTrimStartTime] = useState(0);
  const [trimEndTime, setTrimEndTime] = useState(0);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Create a video element to get metadata
    const video = document.createElement('video');
    video.src = videoUrl;
    
    video.onloadedmetadata = () => {
      setDuration(video.duration);
      setTrimEndTime(video.duration);
      setVideoReady(true);
      setVideoElement(video);
    };
    
    video.onerror = () => {
      toast({
        title: 'Error',
        description: 'Failed to load video. The file may be corrupted or unsupported.',
        variant: 'destructive',
      });
    };
    
    // Clean up
    return () => {
      video.src = '';
      if (videoElement) {
        videoElement.pause();
      }
    };
  }, [videoUrl, toast]);

  // Simulate video playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (playing && videoElement) {
      videoElement.play();
      interval = setInterval(() => {
        setCurrentTime(videoElement.currentTime);
        
        if (videoElement.currentTime >= trimEndTime) {
          videoElement.pause();
          videoElement.currentTime = trimStartTime;
          setPlaying(false);
          setCurrentTime(trimStartTime);
        }
      }, 100);
    } else if (videoElement) {
      videoElement.pause();
    }
    
    return () => {
      clearInterval(interval);
    };
  }, [playing, videoElement, trimEndTime, trimStartTime]);

  const togglePlay = () => {
    if (!videoElement) return;
    
    if (playing) {
      setPlaying(false);
    } else {
      if (currentTime >= trimEndTime) {
        videoElement.currentTime = trimStartTime;
        setCurrentTime(trimStartTime);
      }
      setPlaying(true);
    }
  };

  const seekVideo = (time: number) => {
    if (!videoElement) return;
    
    videoElement.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const processVideo = () => {
    setProcessing(true);
    
    // In a real application, you would send the video to a server for processing
    // For demo purposes, we'll simulate processing and return the same URL
    setTimeout(() => {
      if (onProcessingComplete) {
        onProcessingComplete(videoUrl);
      }
      
      toast({
        title: 'Processing complete',
        description: 'Your video has been processed successfully.',
      });
      
      setProcessing(false);
    }, 3000);
  };

  if (!videoReady) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="text-center">
          <RotateCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="aspect-video bg-black/90 rounded-lg overflow-hidden relative">
        <video 
          src={videoUrl} 
          className="w-full h-full object-contain"
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          ref={(el) => {
            if (el && !videoElement) setVideoElement(el);
          }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono">{formatTime(currentTime)}</span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {playing ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
            <span className="text-sm font-mono">{formatTime(duration)}</span>
          </div>
          
          <Slider
            value={[currentTime]}
            min={0}
            max={duration}
            step={0.01}
            onValueChange={(value) => seekVideo(value[0])}
            className="w-full"
          />
        </div>
      </div>
      
      <Tabs defaultValue="trim">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="trim">Trim</TabsTrigger>
          <TabsTrigger value="ratio">Aspect Ratio</TabsTrigger>
          <TabsTrigger value="speed">Speed</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trim">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Trim Video
              </CardTitle>
              <CardDescription>
                Adjust the start and end points of your video
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Start Time: {formatTime(trimStartTime)}</Label>
                    <Label>End Time: {formatTime(trimEndTime)}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Slider
                      value={[trimStartTime, trimEndTime]}
                      min={0}
                      max={duration}
                      step={0.01}
                      onValueChange={(value) => {
                        setTrimStartTime(value[0]);
                        setTrimEndTime(value[1]);
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Duration: {formatTime(trimEndTime - trimStartTime)}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => {
                    seekVideo(trimStartTime);
                  }}>
                    Preview Trim
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ratio">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crop className="h-5 w-5 mr-2" />
                Aspect Ratio
              </CardTitle>
              <CardDescription>
                Change the dimensions of your video for different platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  value={aspectRatio}
                  onValueChange={setAspectRatio}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:16">9:16 (TikTok, Instagram Stories)</SelectItem>
                    <SelectItem value="16:9">16:9 (Landscape, YouTube)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square, Instagram)</SelectItem>
                    <SelectItem value="4:5">4:5 (Instagram Post)</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex justify-center pt-4">
                  <div 
                    className={`border-2 border-dashed border-primary/50 bg-muted/30 flex items-center justify-center ${
                      aspectRatio === '9:16' ? 'w-32 h-56' :
                      aspectRatio === '16:9' ? 'w-56 h-32' :
                      aspectRatio === '1:1' ? 'w-40 h-40' :
                      aspectRatio === '4:5' ? 'w-32 h-40' : ''
                    }`}
                  >
                    <p className="text-xs text-muted-foreground">{aspectRatio}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="speed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Playback Speed
              </CardTitle>
              <CardDescription>
                Adjust how fast or slow the video plays
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Speed: {adjustSpeed}x</Label>
                  <Slider
                    value={[adjustSpeed]}
                    min={0.25}
                    max={2}
                    step={0.25}
                    onValueChange={(value) => setAdjustSpeed(value[0])}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex text-xs space-x-4">
                    <span>0.25x</span>
                    <span>0.5x</span>
                    <span>1x</span>
                    <span>1.5x</span>
                    <span>2x</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Preview Speed
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="effects">
          <Card>
            <CardHeader>
              <CardTitle>Video Effects</CardTitle>
              <CardDescription>
                Add visual effects to enhance your video
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="watermark">Add Logo Watermark</Label>
                  <Switch
                    id="watermark"
                    checked={addWatermark}
                    onCheckedChange={setAddWatermark}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Filters</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="h-auto py-2">None</Button>
                    <Button variant="outline" className="h-auto py-2">Vibrant</Button>
                    <Button variant="outline" className="h-auto py-2">Dramatic</Button>
                    <Button variant="outline" className="h-auto py-2">Warm</Button>
                    <Button variant="outline" className="h-auto py-2">Cool</Button>
                    <Button variant="outline" className="h-auto py-2">Vintage</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={() => setPlaying(!playing)}>
          Preview
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button onClick={processVideo} disabled={processing}>
          {processing ? (
            <>
              <RotateCw className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Process Video'
          )}
        </Button>
      </div>
    </div>
  );
}