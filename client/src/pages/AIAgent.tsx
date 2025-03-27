import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { RiRobot2Line, RiLightbulbLine, RiTimeLine, RiFileTextLine, RiSearchLine, RiQuestionLine } from "react-icons/ri";

const AIAgent = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("assistant");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [idealLength, setIdealLength] = useState([60]);
  const [contentType, setContentType] = useState("tutorial");
  const [toneStyle, setToneStyle] = useState("casual");
  
  // Conversation history
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! I'm your AI content assistant. How can I help you create amazing TikTok content today?"
    }
  ]);
  
  // Content ideas
  const contentIdeas = [
    {
      title: "5-Minute Tech Hack Series",
      description: "Short, easy-to-follow tech tips that solve common problems.",
      category: "Tutorial",
      confidence: 92
    },
    {
      title: "Behind-the-Scenes Content Creation",
      description: "Show your creative process and how you make your videos.",
      category: "Lifestyle",
      confidence: 87
    },
    {
      title: "Product Review: Latest Smartphone Features",
      description: "Honest, quick takes on new smartphone features worth trying.",
      category: "Review",
      confidence: 85
    },
    {
      title: "Morning Productivity Routine",
      description: "Share your productivity hacks and morning routine that helps you create content.",
      category: "Lifestyle",
      confidence: 81
    }
  ];
  
  // Templates
  const templates = [
    {
      title: "Hook, Problem, Solution, CTA",
      description: "Start with attention hook, present problem, offer solution, end with call to action.",
      examples: ["Tech tips", "Life hacks", "Beauty tutorials"],
      complexity: "Beginner"
    },
    {
      title: "Day In The Life",
      description: "Document interesting parts of your day with transitions between scenes.",
      examples: ["Creator routine", "Student life", "Work day"],
      complexity: "Intermediate"
    },
    {
      title: "Voiceover Tutorial",
      description: "Step-by-step instructions with engaging voiceover and visual demonstrations.",
      examples: ["Cooking", "DIY projects", "Software tutorials"],
      complexity: "Intermediate"
    }
  ];
  
  // Trending topic suggestions
  const trendingTopics = [
    "AI tools for creators",
    "Content batching strategies",
    "Camera gear under $100",
    "Editing shortcuts",
    "Lighting setup hacks",
    "Algorithm updates",
    "Monetization strategies"
  ];
  
  // Handle prompt submission
  const handleSubmitPrompt = () => {
    if (!prompt.trim()) return;
    
    // Add user message to conversation
    setMessages([...messages, { role: "user", content: prompt }]);
    
    // Simulate AI response
    setIsGenerating(true);
    
    // Clear prompt input
    setPrompt("");
    
    // Simulate response delay
    setTimeout(() => {
      const responseOptions = [
        "Here's a content idea based on your interests: Try creating a 'Day in the Life' video that shows behind-the-scenes of your content creation process. This format is trending and has high engagement rates.",
        "Based on current TikTok trends, tutorial videos with quick, actionable tips are performing well. Consider creating a series where each video focuses on one specific tip related to your niche.",
        "Looking at your account analytics, your audience seems to engage most with videos that include demonstrations and how-to content. I'd recommend focusing on practical tutorials with clear before-and-after results."
      ];
      
      const randomResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];
      
      setMessages(prev => [...prev, { role: "assistant", content: randomResponse }]);
      setIsGenerating(false);
    }, 1500);
  };
  
  // Handle content generation
  const handleGenerateContent = () => {
    toast({
      title: "Generating Content",
      description: "Your customized content is being created based on your preferences.",
    });
    
    // Simulate content generation
    setTimeout(() => {
      toast({
        title: "Content Generated",
        description: "Your content script has been created successfully!",
      });
    }, 2000);
  };
  
  // Handle idea selection
  const handleSelectIdea = (idea: any) => {
    toast({
      description: `Selected idea: ${idea.title}`,
    });
  };
  
  // Handle template selection
  const handleSelectTemplate = (template: any) => {
    toast({
      description: `Selected template: ${template.title}`,
    });
  };
  
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">AI Agent</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="generator">Content Generator</TabsTrigger>
          <TabsTrigger value="ideas">Idea Explorer</TabsTrigger>
          <TabsTrigger value="templates">Script Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assistant">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">TikTok Content Assistant</CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-grow overflow-y-auto">
                  <div className="space-y-4 mb-4">
                    {messages.map((message, index) => (
                      <div 
                        key={index} 
                        className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-4 rounded-lg ${
                            message.role === 'assistant' 
                              ? 'bg-gray-100 text-gray-800' 
                              : 'bg-gradient-to-r from-[#FF0050] to-[#00F2EA] text-white'
                          }`}
                        >
                          {message.role === 'assistant' && (
                            <div className="flex items-center mb-2">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback className="bg-[#00F2EA] text-white text-xs">AI</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">AI Assistant</span>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    
                    {isGenerating && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] p-4 rounded-lg bg-gray-100">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback className="bg-[#00F2EA] text-white text-xs">AI</AvatarFallback>
                            </Avatar>
                            <div className="flex space-x-1">
                              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "600ms" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <Input
                      placeholder="Ask me about content ideas, trends, or how to improve your videos..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmitPrompt()}
                      className="flex-grow mr-2"
                    />
                    <Button 
                      onClick={handleSubmitPrompt}
                      disabled={!prompt.trim() || isGenerating}
                      className="bg-[#FF0050] hover:bg-opacity-90"
                    >
                      <RiSearchLine className="mr-2" />
                      {isGenerating ? "Thinking..." : "Ask"}
                    </Button>
                  </div>
                  <div className="flex mt-2 space-x-2">
                    <Button variant="outline" size="sm" className="text-xs">Content suggestions</Button>
                    <Button variant="outline" size="sm" className="text-xs">Trending sounds</Button>
                    <Button variant="outline" size="sm" className="text-xs">Hashtag help</Button>
                  </div>
                </div>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Trending Topics</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {trendingTopics.map((topic, index) => (
                      <div 
                        key={index} 
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => setPrompt(`Give me content ideas about "${topic}"`)}
                      >
                        <RiLightbulbLine className="text-amber-500 mr-3" />
                        <span className="text-sm">{topic}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Quick Questions</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal h-auto py-3"
                      onClick={() => setPrompt("What type of content is performing best on TikTok right now?")}
                    >
                      <RiQuestionLine className="mr-2 flex-shrink-0" />
                      <span className="text-sm">What type of content is performing best right now?</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal h-auto py-3"
                      onClick={() => setPrompt("How can I improve my video hook to increase watch time?")}
                    >
                      <RiQuestionLine className="mr-2 flex-shrink-0" />
                      <span className="text-sm">How can I improve my video hook to increase watch time?</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal h-auto py-3"
                      onClick={() => setPrompt("What are some video transitions I should try?")}
                    >
                      <RiQuestionLine className="mr-2 flex-shrink-0" />
                      <span className="text-sm">What are some video transitions I should try?</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal h-auto py-3"
                      onClick={() => setPrompt("Suggest music tracks that are trending right now")}
                    >
                      <RiQuestionLine className="mr-2 flex-shrink-0" />
                      <span className="text-sm">Suggest music tracks that are trending right now</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="generator">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Content Parameters</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Content Type</label>
                      <Select 
                        value={contentType}
                        onValueChange={setContentType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tutorial">Tutorial / How-To</SelectItem>
                          <SelectItem value="review">Product Review</SelectItem>
                          <SelectItem value="dayinlife">Day in the Life</SelectItem>
                          <SelectItem value="trend">Trending Challenge</SelectItem>
                          <SelectItem value="storytelling">Storytelling</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Tone & Style</label>
                      <Select 
                        value={toneStyle}
                        onValueChange={setToneStyle}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone and style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="casual">Casual & Conversational</SelectItem>
                          <SelectItem value="educational">Educational & Informative</SelectItem>
                          <SelectItem value="entertaining">Entertaining & Humorous</SelectItem>
                          <SelectItem value="inspirational">Inspirational & Motivational</SelectItem>
                          <SelectItem value="professional">Professional & Authoritative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Ideal Length (seconds)</label>
                      <div className="px-3">
                        <Slider
                          value={idealLength}
                          onValueChange={setIdealLength}
                          min={15}
                          max={180}
                          step={15}
                        />
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>15s</span>
                          <span>{idealLength[0]}s</span>
                          <span>180s</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Video Subject/Topic</label>
                      <Textarea 
                        placeholder="Describe what your video will be about..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Key Points to Include</label>
                      <Textarea 
                        placeholder="List the main points you want to cover..."
                        rows={3}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleGenerateContent}
                      className="w-full bg-[#FF0050] hover:bg-opacity-90"
                    >
                      <RiRobot2Line className="mr-2" />
                      Generate Content Script
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Generated Content</CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <div className="mb-6 p-4 bg-gradient-to-r from-[#FF0050]/10 to-[#00F2EA]/10 rounded-lg">
                    <h3 className="text-sm font-medium mb-1">Content Script Overview</h3>
                    <p className="text-xs text-gray-600">
                      This is where your AI-generated content script will appear. Customize the parameters on the left to create the perfect TikTok video script.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF0050] text-white text-xs mr-2">1</span>
                        Hook (0-3 seconds)
                      </h3>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-700">
                          Start with a direct question or surprising statement to grab attention immediately.
                        </p>
                        <div className="text-xs text-gray-500 mt-2 flex items-center">
                          <RiTimeLine className="mr-1" /> 3 seconds
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#00F2EA] text-white text-xs mr-2">2</span>
                        Introduction (3-10 seconds)
                      </h3>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-700">
                          Briefly introduce yourself and what you'll be covering in this video. Keep it concise.
                        </p>
                        <div className="text-xs text-gray-500 mt-2 flex items-center">
                          <RiTimeLine className="mr-1" /> 7 seconds
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs mr-2">3</span>
                        Main Content (10-50 seconds)
                      </h3>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-700">
                          Demonstrate the main topic with clear, step-by-step instructions. Use visual cues and text overlays to emphasize key points. 
                        </p>
                        <div className="text-xs text-gray-500 mt-2 flex items-center">
                          <RiTimeLine className="mr-1" /> 40 seconds
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs mr-2">4</span>
                        Call to Action (50-60 seconds)
                      </h3>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-700">
                          End with a strong call to action. Ask viewers to follow for more content, comment with questions, or try the technique themselves.
                        </p>
                        <div className="text-xs text-gray-500 mt-2 flex items-center">
                          <RiTimeLine className="mr-1" /> 10 seconds
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="outline">
                      <RiFileTextLine className="mr-2" />
                      Export as Text
                    </Button>
                    <Button className="bg-[#FF0050] hover:bg-opacity-90">
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ideas">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">AI-Powered Content Ideas</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <Input 
                      placeholder="Search content ideas or enter a topic..." 
                      className="mb-4"
                    />
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge variant="outline" className="cursor-pointer">All Categories</Badge>
                      <Badge className="bg-[#FF0050] cursor-pointer">Tutorials</Badge>
                      <Badge variant="outline" className="cursor-pointer">Lifestyle</Badge>
                      <Badge variant="outline" className="cursor-pointer">Reviews</Badge>
                      <Badge variant="outline" className="cursor-pointer">Entertainment</Badge>
                      <Badge variant="outline" className="cursor-pointer">Educational</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contentIdeas.map((idea, index) => (
                      <Card 
                        key={index} 
                        className="hover:border-[#FF0050] transition-colors cursor-pointer"
                        onClick={() => handleSelectIdea(idea)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center mb-3">
                            <div className="p-2 rounded-full bg-[#FF0050] bg-opacity-10">
                              <RiLightbulbLine className="text-[#FF0050]" />
                            </div>
                            <div className="ml-3">
                              <h3 className="font-medium text-sm">{idea.title}</h3>
                              <div className="flex items-center mt-0.5">
                                <Badge variant="secondary" className="text-xs mr-2">{idea.category}</Badge>
                                <span className="text-xs text-green-500">{idea.confidence}% match</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">
                            {idea.description}
                          </p>
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm">
                              Use This Idea
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <Button className="bg-[#FF0050] hover:bg-opacity-90">
                      Generate More Ideas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Idea Preferences</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Content Length</label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short (15-30s)</SelectItem>
                          <SelectItem value="medium">Medium (30-60s)</SelectItem>
                          <SelectItem value="long">Long (60s+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Production Complexity</label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue placeholder="Select complexity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simple">Simple (Minimal editing)</SelectItem>
                          <SelectItem value="medium">Medium (Some effects/transitions)</SelectItem>
                          <SelectItem value="complex">Complex (Advanced editing)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Strengths</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Speaking</Badge>
                        <Badge className="bg-[#FF0050] cursor-pointer">Tutorials</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Storytelling</Badge>
                        <Badge className="bg-[#00F2EA] cursor-pointer">Editing</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Humor</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Music</Badge>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-[#FF0050] hover:bg-opacity-90">
                      Update Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Trending Inspiration</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium mb-1">Before & After Transformations</h3>
                      <p className="text-xs text-gray-600">
                        Videos showing dramatic before/after results are trending with 3.2x average engagement.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium mb-1">POV Style Content</h3>
                      <p className="text-xs text-gray-600">
                        Point-of-view videos that immerse viewers in scenarios have 2.8x higher completion rates.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium mb-1">Quick Tutorials With Text</h3>
                      <p className="text-xs text-gray-600">
                        Step-by-step tutorials with on-screen text instructions are seeing 4.1x saves and shares.
                      </p>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-2">
                      Explore Trend Examples
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Content Script Templates</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <Input 
                      placeholder="Search templates..." 
                      className="mb-4"
                    />
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge variant="outline" className="cursor-pointer">All Templates</Badge>
                      <Badge className="bg-[#FF0050] cursor-pointer">Beginner</Badge>
                      <Badge variant="outline" className="cursor-pointer">Intermediate</Badge>
                      <Badge variant="outline" className="cursor-pointer">Advanced</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {templates.map((template, index) => (
                      <div 
                        key={index} 
                        className="border border-gray-200 rounded-lg p-4 hover:border-[#FF0050] transition-colors cursor-pointer"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium">{template.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                          </div>
                          <Badge variant={
                            template.complexity === "Beginner" ? "default" :
                            template.complexity === "Intermediate" ? "secondary" : "outline"
                          }>
                            {template.complexity}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.examples.map((example, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {example}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-end">
                          <Button className="bg-[#FF0050] hover:bg-opacity-90">
                            Use Template
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Template Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="p-4 bg-gradient-to-r from-[#FF0050]/10 to-[#00F2EA]/10 rounded-lg mb-4">
                    <h3 className="text-sm font-medium mb-1">Selected Template</h3>
                    <p className="text-xs text-gray-600">
                      Click on any template to see a detailed preview and structure here.
                    </p>
                  </div>
                  
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gray-400 text-sm">Template Preview</span>
                  </div>
                  
                  <Button className="w-full bg-[#FF0050] hover:bg-opacity-90">
                    Customize Template
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Template Usage Tips</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800 mb-1">Personalize Templates</h3>
                      <p className="text-xs text-blue-600">
                        Adapt templates to match your unique style and audience preferences for better engagement.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-green-800 mb-1">Focus on the Hook</h3>
                      <p className="text-xs text-green-600">
                        The first 3 seconds are critical. Make sure your hook is strong and immediately captivating.
                      </p>
                    </div>
                    
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-amber-800 mb-1">Add Your Unique Twist</h3>
                      <p className="text-xs text-amber-600">
                        Templates provide structure, but your unique perspective is what makes your content stand out.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAgent;
