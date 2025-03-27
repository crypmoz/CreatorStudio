import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Video, Image as ImageIcon, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface MediaUploaderProps {
  onUploadComplete: (file: { url: string; type: string; name: string; size: number }) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export function MediaUploader({
  onUploadComplete,
  allowedTypes = ['image/*', 'video/*'],
  maxSizeMB = 100
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const isFileTypeAllowed = (file: File) => {
    // If no restrictions, allow all files
    if (allowedTypes.includes('*/*')) return true;
    
    // Check if file type matches any of the allowed types
    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        // Handle wildcard types like 'image/*'
        const category = type.split('/')[0];
        return file.type.startsWith(`${category}/`);
      }
      // Exact match
      return file.type === type;
    });
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (!isFileTypeAllowed(file)) {
      toast({
        title: 'Invalid file type',
        description: `Please upload one of the following: ${allowedTypes.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }
    
    // Validate file size
    if (file.size > maxSizeBytes) {
      toast({
        title: 'File too large',
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // In a real application, you would upload the file to a server
      // For demo purposes, we'll simulate upload progress and return a local URL
      await simulateUpload(file, (progress) => {
        setUploadProgress(progress);
      });
      
      // Generate a temporary URL for the uploaded file
      const fileUrl = URL.createObjectURL(file);
      
      // Call the callback with the file data
      onUploadComplete({
        url: fileUrl,
        type: file.type,
        name: file.name,
        size: file.size
      });
      
      toast({
        title: 'Upload successful',
        description: `${file.name} has been uploaded.`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      
      // Reset the input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  // Simulate a file upload with progress
  const simulateUpload = (file: File, progressCallback: (progress: number) => void): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        progressCallback(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-10 w-10 text-blue-500" />;
    if (fileType.startsWith('video/')) return <Video className="h-10 w-10 text-red-500" />;
    return <FileText className="h-10 w-10 text-gray-500" />;
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="record">Record Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardContent className="p-6">
              {isUploading ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    {uploadProgress < 100 ? (
                      <Upload className="h-10 w-10 text-blue-500 animate-pulse" />
                    ) : (
                      <Check className="h-10 w-10 text-green-500" />
                    )}
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-center text-sm text-muted-foreground">
                    {uploadProgress < 100 ? 'Uploading...' : 'Processing file...'}
                  </p>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 ${
                    dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Upload className="h-10 w-10 text-blue-500" />
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        Drag and drop a file, or{' '}
                        <Button
                          variant="link"
                          className="p-0 h-auto text-blue-500"
                          onClick={() => inputRef.current?.click()}
                        >
                          browse
                        </Button>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports {allowedTypes.join(', ')} (Max: {maxSizeMB}MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      ref={inputRef}
                      className="hidden"
                      accept={allowedTypes.join(',')}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="record">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Video className="h-10 w-10 text-red-500" />
                <p className="text-center text-sm">
                  Record video directly using your camera (Coming soon)
                </p>
                <Button variant="outline" disabled>
                  Start Recording
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}