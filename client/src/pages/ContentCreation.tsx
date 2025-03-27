import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const ContentCreation = () => {
  const [activeTab, setActiveTab] = useState("templates");
  
  // Fetch templates
  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["/api/content-templates"],
  });
  
  // Form setup
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      hashtags: "",
    }
  });
  
  const onSubmit = (data: any) => {
    console.log(data);
  };
  
  // AI content suggestions
  const aiSuggestions = [
    { content: "5 Underrated Features Most TikTok Users Don't Know", category: "tutorial" },
    { content: "My Morning Routine: What Actually Works vs Hype", category: "lifestyle" },
    { content: "Trying Viral TikTok Recipes - Success or Fail?", category: "food" },
    { content: "Transform Your Space with These Budget Decor Hacks", category: "home" },
    { content: "10 Seconds to Change Your Life: Daily Hacks", category: "productivity" },
    { content: "Things I Wish I Knew Before Starting on TikTok", category: "advice" }
  ];
  
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
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
            
            <div className="flex space-x-2 mb-6">
              <Button variant="outline" size="sm" className="bg-[#FF0050] text-white">All</Button>
              <Button variant="outline" size="sm">Tutorial</Button>
              <Button variant="outline" size="sm">Lifestyle</Button>
              <Button variant="outline" size="sm">Food</Button>
              <Button variant="outline" size="sm">Home</Button>
              <Button variant="outline" size="sm">Productivity</Button>
              <Button variant="outline" size="sm">Advice</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiSuggestions.map((suggestion, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-full bg-amber-100 text-amber-500 mr-3">
                      <i className="ri-lightbulb-line text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{suggestion.content}</h3>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {suggestion.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    This content idea is trending with creators in your niche and has high engagement potential.
                  </p>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <i className="ri-save-line mr-1"></i> Save
                    </Button>
                    <Button size="sm" className="flex-1 bg-[#FF0050] hover:bg-opacity-90">
                      <i className="ri-movie-line mr-1"></i> Create
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button variant="outline" className="mt-6 mx-auto block">
            Generate More Ideas
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentCreation;
