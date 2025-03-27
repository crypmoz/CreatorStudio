import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import ViralityScore from "@/components/dashboard/ViralityScore";
import EngagementChart from "@/components/dashboard/EngagementChart";

const AlgorithmAssistant = () => {
  const [selectedVideo, setSelectedVideo] = useState("1");
  const [activeTab, setActiveTab] = useState("performance");
  
  // Fetch video data
  const { data: video, isLoading: isLoadingVideo } = useQuery({
    queryKey: [`/api/videos/${selectedVideo}`],
  });
  
  // Optimization suggestions
  const optimizationSuggestions = [
    { type: "success", message: "Your hook is effective (first 3 seconds)" },
    { type: "warning", message: "Video length (45s) is shorter than optimal (60-90s)" },
    { type: "warning", message: "Try adding 2-3 more trending hashtags" }
  ];
  
  // Engagement chart data
  const chartData = [
    { label: "Mon", value: 30 },
    { label: "Tue", value: 45 },
    { label: "Wed", value: 80 },
    { label: "Thu", value: 60 },
    { label: "Fri", value: 75 },
    { label: "Sat", value: 90 },
    { label: "Sun", value: 50 }
  ];
  
  // Metrics data for engagement chart
  const engagementMetrics = [
    { 
      label: "Avg. Watch Time", 
      value: "18.2s", 
      change: { value: "+5.3%", direction: "up" as const } 
    },
    { 
      label: "Comments/View", 
      value: "2.4%", 
      change: { value: "+1.7%", direction: "up" as const } 
    },
    { 
      label: "Shares/View", 
      value: "3.8%", 
      change: { value: "-0.5%", direction: "down" as const } 
    }
  ];
  
  // Trending hashtags
  const trendingHashtags = [
    { name: "#fyp", volume: "9.8B views" },
    { name: "#foryou", volume: "7.2B views" },
    { name: "#trending", volume: "5.4B views" },
    { name: "#viral", volume: "4.9B views" },
    { name: "#tiktok", volume: "3.6B views" },
    { name: "#summer2023", volume: "2.8B views" },
    { name: "#dance", volume: "2.3B views" },
    { name: "#comedy", volume: "2.1B views" }
  ];
  
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Algorithm Assistant</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <Card className="dashboard-card">
            <CardHeader className="px-6 py-5 border-b border-gray-200">
              <CardTitle className="text-base font-medium">Video Selection</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Select 
                defaultValue={selectedVideo}
                onValueChange={setSelectedVideo}
              >
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Select a video" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">How to Edit TikTok Videos Like a Pro</SelectItem>
                  <SelectItem value="2">5 Trends You Need to Try Today</SelectItem>
                  <SelectItem value="3">My Morning Routine</SelectItem>
                </SelectContent>
              </Select>
              
              {isLoadingVideo ? (
                <div className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <div>
                  <div className="aspect-video bg-gray-200 rounded mb-4 flex items-center justify-center">
                    <span className="text-gray-500">Video Preview</span>
                  </div>
                  <h3 className="font-medium mb-2">{video?.title || "Video Title"}</h3>
                  <p className="text-sm text-gray-500 mb-4">{video?.description || "Video description"}</p>
                  
                  <div className="flex space-x-2 flex-wrap">
                    {video?.hashtags?.map((tag: string, i: number) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full mb-1">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
              <TabsTrigger value="prediction">Prediction</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-6">
              <ViralityScore 
                score={78} 
                optimizations={optimizationSuggestions}
                onAnalysisClick={() => setActiveTab("optimization")}
              />
              
              <EngagementChart 
                chartData={chartData}
                metrics={engagementMetrics}
              />
            </TabsContent>
            
            <TabsContent value="optimization">
              <Card className="dashboard-card mb-6">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Content Optimization</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">Video Length Optimization</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs">30s</span>
                      <Slider defaultValue={[45]} max={180} step={5} className="flex-1" />
                      <span className="text-xs">3m</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Optimal length: 60-90s (current: 45s)
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">Hook Placement</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs">Start</span>
                      <Slider defaultValue={[0]} max={10} step={1} className="flex-1" />
                      <span className="text-xs">10s</span>
                    </div>
                    <p className="text-xs text-green-500 mt-2">
                      Great! Your hook is in the first 3 seconds.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Sound Selection</h3>
                    <Select defaultValue="trending">
                      <SelectTrigger>
                        <SelectValue placeholder="Select sound type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trending">Trending Sound</SelectItem>
                        <SelectItem value="original">Original Sound</SelectItem>
                        <SelectItem value="licensed">Licensed Music</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-amber-500 mt-2">
                      Trending sounds can increase discoverability by 3.5x
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="dashboard-card">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Hashtag Optimization</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    <Input placeholder="Search hashtags" className="mr-2" />
                    <Button>Add</Button>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">Your Hashtags</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {video?.hashtags?.map((tag: string, i: number) => (
                        <div key={i} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                          <span className="text-sm">#{tag}</span>
                          <button className="ml-2 text-gray-500 hover:text-red-500">×</button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-amber-500">
                      Add 2-3 more trending hashtags for better reach
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Trending Hashtags</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {trendingHashtags.map((tag, i) => (
                        <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span className="text-sm font-medium">{tag.name}</span>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-2">{tag.volume}</span>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">+</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="prediction">
              <Card className="dashboard-card">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Video Success Prediction</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-center">
                      <div className="relative w-48 h-48">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#EEE" strokeWidth="8"/>
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="45" 
                            fill="none" 
                            stroke="#00F2EA" 
                            strokeWidth="8" 
                            strokeDasharray="283" 
                            strokeDashoffset="85" 
                            strokeLinecap="round" 
                            transform="rotate(-90 50 50)"
                          />
                          <text x="50" y="45" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="bold" fill="#333">92%</text>
                          <text x="50" y="60" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#777">Success Probability</text>
                          <text x="50" y="75" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#777">with Optimizations</text>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-500">Estimated Views</p>
                        <p className="text-xl font-semibold">150K - 230K</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-500">Engagement Rate</p>
                        <p className="text-xl font-semibold">7.2% - 8.5%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium mb-3">Key Success Factors</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">1</span>
                        Strong hook in first 3 seconds
                      </li>
                      <li className="flex items-center text-sm">
                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">2</span>
                        Trending soundtrack usage
                      </li>
                      <li className="flex items-center text-sm">
                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">3</span>
                        High-quality video content
                      </li>
                      <li className="flex items-center text-sm">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-2">4</span>
                        Extend video length to 60-90s
                      </li>
                      <li className="flex items-center text-sm">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-2">5</span>
                        Add more trending hashtags
                      </li>
                    </ul>
                  </div>
                  
                  <Button className="w-full mt-6 bg-[#FF0050] hover:bg-opacity-90">
                    Apply All Optimizations
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmAssistant;
