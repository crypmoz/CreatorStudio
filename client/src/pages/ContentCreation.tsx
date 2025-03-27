import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
// Define types for our content entities
interface ContentTemplate {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  avgViews: number | null;
  popularity: string | null;
  isNew: boolean | null;
}

interface ContentIdea {
  id: number;
  userId: number;
  title: string;
  description: string;
  createdAt: Date | null;
  niche: string | null;
  prompt: string | null;
  aiGenerated: boolean | null;
  favorite: boolean | null;
  tags: string[] | null;
}

interface ContentDraft {
  id: number;
  userId: number;
  ideaId: number | null;
  title: string;
  content: string;
  status: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface MediaFile {
  id: number;
  userId: number;
  draftId: number | null;
  filename: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl: string | null;
  duration: number | null;
  width: number | null;
  height: number | null;
  uploadedAt: Date | null;
}

const ContentCreation = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch templates
  const { data: templates, isLoading: isLoadingTemplates } = useQuery<ContentTemplate[]>({
    queryKey: ["/api/content-templates"],
  });
  
  // Fetch content ideas
  const { data: contentIdeas, isLoading: isLoadingIdeas } = useQuery<ContentIdea[]>({
    queryKey: ["/api/users/1/content-ideas"],
  });
  
  // Fetch content drafts
  const { data: contentDrafts, isLoading: isLoadingDrafts } = useQuery<ContentDraft[]>({
    queryKey: ["/api/users/1/content-drafts"],
  });
  
  // Fetch media files
  const { data: mediaFiles, isLoading: isLoadingMedia } = useQuery<MediaFile[]>({
    queryKey: ["/api/users/1/media-files"],
  });
  
  // Form setup for drafts
  const draftForm = useForm({
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
      userId: 1,
    }
  });
  
  // Form setup for content details
  const detailsForm = useForm({
    defaultValues: {
      title: "",
      description: "",
      hashtags: "",
    }
  });
  
  // Create new content idea mutation
  const createIdeaMutation = useMutation({
    mutationFn: async (ideaData: any) => {
      return await apiRequest(
        'POST',
        '/api/content-ideas',
        ideaData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/content-ideas'] });
      toast({
        title: "Success!",
        description: "New content idea created.",
      });
    },
  });
  
  // Create new content draft mutation
  const createDraftMutation = useMutation({
    mutationFn: async (draftData: any) => {
      return await apiRequest(
        'POST',
        '/api/content-drafts',
        draftData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/content-drafts'] });
      draftForm.reset();
      toast({
        title: "Success!",
        description: "New content draft created.",
      });
    },
  });
  
  const onSubmitDraft = (data: any) => {
    createDraftMutation.mutate(data);
  };
  
  const onSubmitDetails = (data: any) => {
    console.log(data);
    toast({
      title: "Video details saved",
      description: "Your video details have been saved successfully.",
    });
  };
  
  // Filter content ideas by category
  const filteredIdeas = selectedCategory 
    ? contentIdeas?.filter(idea => 
        idea.tags?.includes(selectedCategory.toLowerCase())
      )
    : contentIdeas;
  
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Creation Hub</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="editor">Video Editor</TabsTrigger>
          <TabsTrigger value="ideas">AI Ideas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingTemplates ? (
              // Loading states
              Array(6).fill(0).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Templates
              templates?.map((template: any) => (
                <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-48 relative">
                    <img 
                      src={template.thumbnailUrl || "https://via.placeholder.com/400x240"} 
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                    {template.popularity !== "normal" && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {template.popularity === "trending" ? "Trending 🔥" : "New ✨"}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">{template.title}</h3>
                    <p className="text-xs text-gray-500">{template.description}</p>
                    <Button className="w-full mt-3 bg-[#FF0050] hover:bg-opacity-90">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button variant="outline" className="mr-2">Load More</Button>
            <Button variant="outline">Browse Categories</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="editor">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Video Editor</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="aspect-video bg-gray-800 rounded-md mb-6 flex items-center justify-center">
                    <span className="text-gray-400">Video Preview Area</span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {Array(8).fill(0).map((_, i) => (
                      <div key={i} className="aspect-video bg-gray-200 rounded cursor-pointer hover:ring-2 hover:ring-[#FF0050]"></div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline"><i className="ri-scissors-line mr-1"></i> Cut</Button>
                    <Button variant="outline"><i className="ri-speed-line mr-1"></i> Speed</Button>
                    <Button variant="outline"><i className="ri-music-line mr-1"></i> Sound</Button>
                    <Button variant="outline"><i className="ri-text mr-1"></i> Text</Button>
                    <Button variant="outline"><i className="ri-filter-line mr-1"></i> Filter</Button>
                    <Button variant="outline"><i className="ri-magic-line mr-1"></i> Effects</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Video Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Form {...detailsForm}>
                    <form onSubmit={detailsForm.handleSubmit(onSubmitDetails)} className="space-y-4">
                      <FormField
                        control={detailsForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter video title" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={detailsForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter video description" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={detailsForm.control}
                        name="hashtags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hashtags</FormLabel>
                            <FormControl>
                              <Input placeholder="food, vlog, summer (without #)" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-[#FF0050] hover:bg-opacity-90">
                        Save Draft
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">AI Enhancement</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <i className="ri-magic-line mr-2"></i> Auto-Enhance Video
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <i className="ri-scissors-2-line mr-2"></i> Smart Cut (Remove Silences)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <i className="ri-subtitle mr-2"></i> Generate Captions
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <i className="ri-hashtag mr-2"></i> Suggest Trending Hashtags
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <i className="ri-musical-note-line mr-2"></i> Recommend Trending Sounds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ideas">
          <div className="mb-6">
            <Input 
              placeholder="Search for content ideas or topics..." 
              className="max-w-md mb-4"
            />
            
            <div className="flex flex-wrap space-x-2 mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                className={selectedCategory === null ? "bg-[#FF0050] text-white" : ""}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {['Tutorial', 'Lifestyle', 'Food', 'Productivity', 'Wellness', 'Social-Media', 'Tips'].map((category) => (
                <Button 
                  key={category}
                  variant="outline" 
                  size="sm"
                  className={selectedCategory === category ? "bg-[#FF0050] text-white" : ""}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingIdeas ? (
              // Loading states
              Array(6).fill(0).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))
            ) : filteredIdeas?.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="text-lg font-medium mb-2">No content ideas found</h3>
                <p className="text-gray-500 mb-4">Try selecting a different category or create a new idea.</p>
                <Button className="bg-[#FF0050] hover:bg-opacity-90">
                  Create New Idea
                </Button>
              </div>
            ) : (
              filteredIdeas?.map((idea) => (
                <Card key={idea.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="p-3 rounded-full bg-amber-100 text-amber-500 mr-3">
                        {idea.aiGenerated ? (
                          <span className="text-xl">🤖</span>
                        ) : (
                          <span className="text-xl">💡</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{idea.title}</h3>
                        <div className="flex flex-wrap gap-1">
                          {idea.tags?.map((tag, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                          {idea.niche && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {idea.niche}
                            </span>
                          )}
                          {idea.favorite && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                              ⭐ Favorite
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4">
                      {idea.description}
                    </p>
                    
                    <div className="flex space-x-2">
                      {!idea.favorite && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            // Update to mark as favorite
                            toast({
                              title: "Saved to favorites",
                              description: "Content idea added to your favorites."
                            });
                          }}
                        >
                          <i className="ri-star-line mr-1"></i> Favorite
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        className="flex-1 bg-[#FF0050] hover:bg-opacity-90"
                        onClick={() => {
                          // Create a new draft from this idea
                          const draftData = {
                            userId: 1,
                            ideaId: idea.id,
                            title: idea.title,
                            content: "",
                            status: "draft",
                            createdAt: new Date(),
                          };
                          createDraftMutation.mutate(draftData);
                          setActiveTab("editor");
                        }}
                      >
                        <i className="ri-edit-line mr-1"></i> Create Draft
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="mt-8 flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={() => {
                // Modal to create new idea
                toast({
                  title: "Creating new idea",
                  description: "A new content idea is being created."
                });
              }}
            >
              <i className="ri-add-line mr-1"></i> Create New Idea
            </Button>
            <Button 
              className="bg-[#FF0050] hover:bg-opacity-90 flex items-center"
              onClick={() => {
                // Generate AI suggestions
                toast({
                  title: "Generating ideas",
                  description: "AI is generating new content ideas based on your niche and audience."
                });
              }}
            >
              <i className="ri-ai-generate mr-1"></i> Generate AI Ideas
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentCreation;
