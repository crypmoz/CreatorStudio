import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { ContentIdea, ContentDraft } from '@shared/schema';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Star, StarOff, Copy, PlusCircle, Sparkles, PenLine, Check, Trash2, Clock, Upload, Video, Image as ImageIcon, FileText as FileIcon, X } from 'lucide-react';
import { MediaUploader } from '@/components/MediaUploader';
import { VideoProcessor } from '@/components/VideoProcessor';

// Form schema for idea generation
const generateIdeasSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  targetAudience: z.string().min(3, "Target audience must be at least 3 characters"),
  contentType: z.string().optional(),
  count: z.number().min(1).max(10).optional(),
});

type GenerateIdeasFormValues = z.infer<typeof generateIdeasSchema>;

const ContentCreation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("ideas");
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
  const [selectedDraft, setSelectedDraft] = useState<ContentDraft | null>(null);

  // Get content ideas for the current user
  const {
    data: ideas,
    isLoading: ideasLoading,
    error: ideasError,
  } = useQuery({
    queryKey: ['/api/users', user?.id, 'content-ideas'],
    queryFn: async () => {
      if (!user) return [];
      const response = await fetch(`/api/users/${user.id}/content-ideas`);
      if (!response.ok) throw new Error('Failed to fetch content ideas');
      return await response.json();
    },
    enabled: !!user,
  });

  // Get content drafts for the current user
  const {
    data: drafts,
    isLoading: draftsLoading,
    error: draftsError,
  } = useQuery({
    queryKey: ['/api/users', user?.id, 'content-drafts'],
    queryFn: async () => {
      if (!user) return [];
      const response = await fetch(`/api/users/${user.id}/content-drafts`);
      if (!response.ok) throw new Error('Failed to fetch content drafts');
      return await response.json();
    },
    enabled: !!user,
  });

  // Generate ideas mutation
  const generateIdeasMutation = useMutation({
    mutationFn: async (data: GenerateIdeasFormValues) => {
      const response = await apiRequest('POST', '/api/ai/generate-ideas', data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate ideas');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'content-ideas'] });
      toast({
        title: 'Ideas Generated',
        description: 'New content ideas have been created successfully',
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Generate Ideas',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Generate draft mutation
  const generateDraftMutation = useMutation({
    mutationFn: async (ideaId: number) => {
      const response = await apiRequest('POST', '/api/ai/generate-draft', { ideaId });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate draft');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'content-drafts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'content-ideas'] });
      toast({
        title: 'Draft Generated',
        description: 'New content draft has been created successfully',
        variant: 'default',
      });
      setActiveTab("drafts");
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Generate Draft',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (idea: ContentIdea) => {
      const response = await apiRequest('PATCH', `/api/content-ideas/${idea.id}`, { 
        favorite: !idea.favorite 
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update favorite status');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'content-ideas'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Update',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Generate image prompts mutation
  const generateImagePromptsMutation = useMutation({
    mutationFn: async (draftId: number) => {
      const response = await apiRequest('POST', '/api/ai/generate-image-prompts', { draftId });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image prompts');
      }
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Image Prompts Generated',
        description: 'New image prompts have been created successfully',
        variant: 'default',
      });
      setImagePrompts(data);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Generate Image Prompts',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete idea mutation
  const deleteIdeaMutation = useMutation({
    mutationFn: async (ideaId: number) => {
      const response = await apiRequest('DELETE', `/api/content-ideas/${ideaId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete idea');
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'content-ideas'] });
      setSelectedIdea(null);
      toast({
        title: 'Idea Deleted',
        description: 'Content idea has been deleted successfully',
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Delete',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete draft mutation
  const deleteDraftMutation = useMutation({
    mutationFn: async (draftId: number) => {
      const response = await apiRequest('DELETE', `/api/content-drafts/${draftId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete draft');
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'content-drafts'] });
      setSelectedDraft(null);
      toast({
        title: 'Draft Deleted',
        description: 'Content draft has been deleted successfully',
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Delete',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Form setup for idea generation
  const form = useForm<GenerateIdeasFormValues>({
    resolver: zodResolver(generateIdeasSchema),
    defaultValues: {
      topic: '',
      targetAudience: '',
      contentType: 'TikTok video',
      count: 5,
    },
  });

  // State for image prompts
  const [imagePrompts, setImagePrompts] = useState<string[]>([]);
  
  // State for media tab
  const [uploadedMedia, setUploadedMedia] = useState<{
    url: string;
    type: string;
    name: string;
    size: number;
  } | null>(null);
  const [processedMediaUrl, setProcessedMediaUrl] = useState<string | null>(null);

  // Generate ideas handler
  const onSubmit = (data: GenerateIdeasFormValues) => {
    generateIdeasMutation.mutate(data);
  };

  // Handle create draft from idea
  const handleCreateDraft = (ideaId: number) => {
    generateDraftMutation.mutate(ideaId);
  };

  // Handle generate image prompts
  const handleGenerateImagePrompts = (draftId: number) => {
    generateImagePromptsMutation.mutate(draftId);
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard',
      description: 'Content has been copied to clipboard',
      variant: 'default',
    });
  };

  // Format hashtags helper
  const formatHashtags = (hashtags: string | null) => {
    if (!hashtags) return [];
    return hashtags.split(/\\s+/).filter(tag => tag.trim() !== '');
  };

  // Status badge helper
  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    const variants: Record<string, string> = {
      'draft': 'secondary',
      'in-progress': 'warning',
      'ready': 'success',
      'published': 'default',
    };
    
    return (
      <Badge variant={variants[status] as any || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Format structure helper
  const formatStructure = (structureJson: string | null) => {
    if (!structureJson) return [];
    
    try {
      const structure = JSON.parse(structureJson);
      return structure;
    } catch (e) {
      return [];
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
        Content Creation Hub
      </h1>
      <p className="text-muted-foreground mb-8">
        Generate content ideas, create drafts, and optimize your TikTok videos all in one place.
      </p>

      <Tabs defaultValue="ideas" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="ideas">Ideas</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="ideas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Idea Generator Form */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Idea Generator
                </CardTitle>
                <CardDescription>
                  Generate AI-powered content ideas for your TikTok videos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Cooking tips, Travel hacks" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Gen Z, Fitness enthusiasts" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select content type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="TikTok video">TikTok Video</SelectItem>
                              <SelectItem value="Instagram Reel">Instagram Reel</SelectItem>
                              <SelectItem value="YouTube Short">YouTube Short</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Ideas</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select number of ideas" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1, 3, 5, 10].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={generateIdeasMutation.isPending}
                    >
                      {generateIdeasMutation.isPending ? (
                        <>Generating Ideas...</>
                      ) : (
                        <>Generate Ideas</>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Ideas List */}
            <Card className="md:col-span-1 min-h-[600px]">
              <CardHeader>
                <CardTitle>Your Ideas</CardTitle>
                <CardDescription>
                  {ideasLoading ? 'Loading ideas...' : 
                   ideas?.length > 0 ? `${ideas.length} ideas found` : 'No ideas yet'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 max-h-[500px] overflow-y-auto">
                {ideasLoading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                ) : ideas?.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No content ideas yet. Generate some ideas to get started!</p>
                  </div>
                ) : (
                  <div className="grid gap-1">
                    {ideas?.map((idea: ContentIdea) => (
                      <div 
                        key={idea.id}
                        className={`p-4 cursor-pointer border-l-2 hover:bg-accent/50 ${
                          selectedIdea?.id === idea.id ? 'border-l-primary bg-accent/50' : 'border-l-transparent'
                        }`}
                        onClick={() => setSelectedIdea(idea)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium truncate max-w-[80%]">{idea.title}</h3>
                          <div className="flex gap-1">
                            {getStatusBadge(idea.status)}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavoriteMutation.mutate(idea);
                              }}
                              className="text-amber-400 hover:text-amber-500"
                            >
                              {idea.favorite ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{idea.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Idea Details */}
            <Card className="md:col-span-1 min-h-[600px]">
              <CardHeader>
                <CardTitle>Idea Details</CardTitle>
                <CardDescription>
                  {selectedIdea ? 'View and create content from selected idea' : 'Select an idea to view details'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedIdea ? (
                  <div className="p-8 text-center text-muted-foreground h-[400px] flex flex-col items-center justify-center">
                    <PlusCircle className="h-10 w-10 mb-4 text-muted-foreground/50" />
                    <p>Select an idea from the list to view its details</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{selectedIdea.title}</h3>
                      <p className="text-muted-foreground">{selectedIdea.description}</p>
                    </div>

                    {selectedIdea.keyPoints && (
                      <div>
                        <h4 className="font-medium mb-2">Key Points</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {selectedIdea.keyPoints.split('\\n').map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedIdea.hashtags && (
                      <div>
                        <h4 className="font-medium mb-2">Hashtags</h4>
                        <div className="flex flex-wrap gap-2">
                          {formatHashtags(selectedIdea.hashtags).map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedIdea.estimatedEngagement && (
                      <div>
                        <h4 className="font-medium mb-2">Estimated Engagement</h4>
                        <div className="flex items-center">
                          <div className="bg-blue-100 dark:bg-blue-950 rounded-full h-2 w-full overflow-hidden">
                            <div 
                              className="bg-blue-500 h-2"
                              style={{ 
                                width: `${Math.min(selectedIdea.estimatedEngagement * 10, 100)}%` 
                              }}
                            />
                          </div>
                          <span className="ml-2 text-sm font-medium">
                            {selectedIdea.estimatedEngagement}/10
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 space-x-3">
                      <Button 
                        variant="default" 
                        onClick={() => handleCreateDraft(selectedIdea.id)}
                        disabled={generateDraftMutation.isPending}
                      >
                        {generateDraftMutation.isPending ? (
                          <>Generating Draft...</>
                        ) : (
                          <>
                            <PenLine className="h-4 w-4 mr-2" />
                            Create Draft
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(
                          `${selectedIdea.title}\n\n${selectedIdea.description}\n\n${selectedIdea.keyPoints || ''}\n\n${selectedIdea.hashtags || ''}`
                        )}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteIdeaMutation.mutate(selectedIdea.id)}
                        disabled={deleteIdeaMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="media">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Media Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-500" />
                  Media Manager
                </CardTitle>
                <CardDescription>
                  Upload and manage your media files for TikTok content
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploadedMedia ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {uploadedMedia.type.startsWith('image/') ? (
                          <ImageIcon className="h-8 w-8 text-blue-500" />
                        ) : uploadedMedia.type.startsWith('video/') ? (
                          <Video className="h-8 w-8 text-red-500" />
                        ) : (
                          <FileIcon className="h-8 w-8 text-gray-500" />
                        )}
                        <div>
                          <p className="font-medium">{uploadedMedia.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(uploadedMedia.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setUploadedMedia(null)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                    
                    {uploadedMedia.type.startsWith('image/') && (
                      <div className="aspect-video bg-muted/30 rounded-md overflow-hidden flex items-center justify-center">
                        <img
                          src={uploadedMedia.url}
                          alt="Uploaded image"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                    
                    {uploadedMedia.type.startsWith('video/') && !processedMediaUrl && (
                      <div className="aspect-video bg-muted/30 rounded-md overflow-hidden flex items-center justify-center">
                        <video
                          src={uploadedMedia.url}
                          controls
                          className="max-w-full max-h-full"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <MediaUploader 
                      onUploadComplete={(file) => {
                        setUploadedMedia(file);
                        setProcessedMediaUrl(null);
                      }}
                      allowedTypes={['image/*', 'video/*']}
                      maxSizeMB={100}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Video Processing Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-red-500" />
                  Video Editor
                </CardTitle>
                <CardDescription>
                  Edit and optimize your videos for TikTok
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploadedMedia && uploadedMedia.type.startsWith('video/') ? (
                  <VideoProcessor 
                    videoUrl={processedMediaUrl || uploadedMedia.url}
                    onProcessingComplete={(url) => setProcessedMediaUrl(url)}
                  />
                ) : (
                  <div className="h-[400px] flex flex-col items-center justify-center text-center p-8">
                    <Video className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Video Selected</h3>
                    <p className="text-muted-foreground mb-6">
                      Upload a video file using the Media Manager to edit and optimize it for TikTok.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("media")}
                      disabled={!!uploadedMedia}
                    >
                      Upload Video
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="drafts">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Draft List */}
            <Card className="md:col-span-1 min-h-[600px]">
              <CardHeader>
                <CardTitle>Your Drafts</CardTitle>
                <CardDescription>
                  {draftsLoading ? 'Loading drafts...' : 
                   drafts?.length > 0 ? `${drafts.length} drafts found` : 'No drafts yet'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 max-h-[500px] overflow-y-auto">
                {draftsLoading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                ) : drafts?.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No content drafts yet. Create a draft from your ideas!</p>
                  </div>
                ) : (
                  <div className="grid gap-1">
                    {drafts?.map((draft: ContentDraft) => (
                      <div 
                        key={draft.id}
                        className={`p-4 cursor-pointer border-l-2 hover:bg-accent/50 ${
                          selectedDraft?.id === draft.id ? 'border-l-primary bg-accent/50' : 'border-l-transparent'
                        }`}
                        onClick={() => setSelectedDraft(draft)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium truncate max-w-[80%]">{draft.title}</h3>
                          <div>
                            {getStatusBadge(draft.status)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {draft.content.substring(0, 100)}...
                        </p>
                        <div className="mt-2 flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(draft.updatedAt || draft.createdAt || '').toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Draft Details */}
            <Card className="md:col-span-2 min-h-[600px]">
              <CardHeader>
                <CardTitle>Draft Details</CardTitle>
                <CardDescription>
                  {selectedDraft ? 'View and edit selected draft' : 'Select a draft to view details'}
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                {!selectedDraft ? (
                  <div className="p-8 text-center text-muted-foreground h-[400px] flex flex-col items-center justify-center">
                    <PenLine className="h-10 w-10 mb-4 text-muted-foreground/50" />
                    <p>Select a draft from the list to view its details</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold mb-2">{selectedDraft.title}</h3>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(selectedDraft.content)}
                          >
                            <Copy className="h-4 w-4 mr-2" /> Copy
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteDraftMutation.mutate(selectedDraft.id)}
                            disabled={deleteDraftMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Tabs defaultValue="script">
                      <TabsList>
                        <TabsTrigger value="script">Script</TabsTrigger>
                        <TabsTrigger value="structure">Structure</TabsTrigger>
                        <TabsTrigger value="media">Media Suggestions</TabsTrigger>
                      </TabsList>

                      <TabsContent value="script" className="mt-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <div className="bg-accent/50 p-4 mb-4 rounded-md">
                            <h4 className="font-medium mb-1">Hook</h4>
                            <p>{selectedDraft.hook || "No hook provided"}</p>
                          </div>
                          
                          <div className="whitespace-pre-line">
                            {selectedDraft.content}
                          </div>
                          
                          {selectedDraft.callToAction && (
                            <div className="bg-accent/50 p-4 mt-4 rounded-md">
                              <h4 className="font-medium mb-1">Call to Action</h4>
                              <p>{selectedDraft.callToAction}</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="structure" className="mt-4">
                        <div className="rounded-md border">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="p-2 text-left font-medium">Time</th>
                                <th className="p-2 text-left font-medium">Section</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedDraft.structure ? (
                                formatStructure(selectedDraft.structure).map((item: any, index: number) => (
                                  <tr key={index} className="border-b last:border-b-0">
                                    <td className="p-2 text-sm">{item.time}</td>
                                    <td className="p-2 text-sm">{item.section}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={2} className="p-4 text-center text-muted-foreground">
                                    No structure information available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>

                      <TabsContent value="media" className="mt-4">
                        <div className="space-y-6">
                          <Accordion type="single" collapsible className="w-full">
                            {selectedDraft.audioSuggestions && (
                              <AccordionItem value="audio">
                                <AccordionTrigger>Audio Suggestions</AccordionTrigger>
                                <AccordionContent>
                                  <ul className="list-disc list-inside text-sm space-y-1">
                                    {selectedDraft.audioSuggestions.split('\\n').map((item, index) => (
                                      <li key={index}>{item}</li>
                                    ))}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            )}
                            
                            {selectedDraft.visualEffects && (
                              <AccordionItem value="visual">
                                <AccordionTrigger>Visual Effects</AccordionTrigger>
                                <AccordionContent>
                                  <ul className="list-disc list-inside text-sm space-y-1">
                                    {selectedDraft.visualEffects.split('\\n').map((item, index) => (
                                      <li key={index}>{item}</li>
                                    ))}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            )}
                            
                            <AccordionItem value="image-prompts">
                              <AccordionTrigger>Image Prompts</AccordionTrigger>
                              <AccordionContent>
                                {imagePrompts.length > 0 ? (
                                  <div className="space-y-3">
                                    {imagePrompts.map((prompt, index) => (
                                      <div key={index} className="relative group">
                                        <div className="p-3 rounded-md bg-accent/50 text-sm">
                                          {prompt}
                                        </div>
                                        <button 
                                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={() => copyToClipboard(prompt)}
                                        >
                                          <Copy className="h-4 w-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center p-4">
                                    <p className="text-muted-foreground mb-4">No image prompts generated yet</p>
                                    <Button
                                      onClick={() => handleGenerateImagePrompts(selectedDraft.id)}
                                      disabled={generateImagePromptsMutation.isPending}
                                    >
                                      {generateImagePromptsMutation.isPending ? (
                                        <>Generating Prompts...</>
                                      ) : (
                                        <>Generate Image Prompts</>
                                      )}
                                    </Button>
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Content Templates</CardTitle>
                <CardDescription>
                  Pre-built templates for different TikTok content formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Before/After Transformation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Perfect for showing impressive results or changes over time. Great for fitness, learning, makeover or home improvement content.
                      </p>
                      <Button variant="outline" className="w-full">Use Template</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Step-by-Step Tutorial</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Break down complicated processes into simple, easy-to-follow steps. Ideal for DIY, cooking, or educational content.
                      </p>
                      <Button variant="outline" className="w-full">Use Template</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Trending Sound Reaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Jump on viral sounds with your own creative twist. Helps boost reach through algorithmic recommendations.
                      </p>
                      <Button variant="outline" className="w-full">Use Template</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Unpopular Opinion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Share a controversial but thoughtful take on a topic in your niche. Generate engagement through discussion and debate.
                      </p>
                      <Button variant="outline" className="w-full">Use Template</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Day in the Life</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Document your daily routine as a professional in your field. Great for behind-the-scenes content that builds authenticity.
                      </p>
                      <Button variant="outline" className="w-full">Use Template</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Expectation vs. Reality</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Contrast common expectations with the actual reality of a situation. Humorous and relatable format with high engagement.
                      </p>
                      <Button variant="outline" className="w-full">Use Template</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Top 5 List</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Curate and count down the best products, tips, or ideas in your niche. Creates anticipation and encourages watching to the end.
                      </p>
                      <Button variant="outline" className="w-full">Use Template</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Duet Challenge</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create content that invites others to duet with you. Great for audience participation and extending your reach organically.
                      </p>
                      <Button variant="outline" className="w-full">Use Template</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">POV (Point of View)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create an immersive scenario where viewers feel like they're experiencing the content firsthand. Excellent for storytelling.
                      </p>
                      <Button variant="outline" className="w-full">Use Template</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentCreation;