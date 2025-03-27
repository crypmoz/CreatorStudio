import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RiUserAddLine, RiLineChartLine, RiUserSearchLine, RiBarChartBoxLine, RiBarChart2Line, RiUserVoiceLine, RiUserHeartLine, RiRssLine } from "react-icons/ri";

const AudienceGrowth = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [timeRange, setTimeRange] = useState("30days");
  
  // Fetch analytics data
  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["/api/users/1/analytics"],
  });
  
  // Audience demographics data
  const demographics = {
    age: [
      { group: "13-17", percentage: 15 },
      { group: "18-24", percentage: 42 },
      { group: "25-34", percentage: 28 },
      { group: "35-44", percentage: 10 },
      { group: "45+", percentage: 5 }
    ],
    gender: [
      { type: "Female", percentage: 65 },
      { type: "Male", percentage: 32 },
      { type: "Other", percentage: 3 }
    ],
    location: [
      { country: "United States", percentage: 45 },
      { country: "United Kingdom", percentage: 12 },
      { country: "Canada", percentage: 8 },
      { country: "Australia", percentage: 7 },
      { country: "Germany", percentage: 5 },
      { country: "Other", percentage: 23 }
    ]
  };
  
  // Follower growth data
  const followerGrowth = [
    { date: "Jun 1", followers: 75800 },
    { date: "Jun 8", followers: 77200 },
    { date: "Jun 15", followers: 79500 },
    { date: "Jun 22", followers: 81300 },
    { date: "Jun 29", followers: 83400 },
    { date: "Jul 6", followers: 85400 }
  ];
  
  // Growth strategies
  const growthStrategies = [
    {
      title: "Collaborate with Similar Creators",
      description: "Partner with creators in your niche for duets, challenges or shoutouts.",
      difficulty: "Medium",
      impact: "High",
      status: "todo"
    },
    {
      title: "Consistent Posting Schedule",
      description: "Post 1-2 videos daily during peak engagement times.",
      difficulty: "Easy",
      impact: "Medium",
      status: "inprogress"
    },
    {
      title: "Trending Hashtag Research",
      description: "Research and use 3-5 trending hashtags relevant to your content.",
      difficulty: "Easy",
      impact: "Medium",
      status: "done"
    },
    {
      title: "Create Content Series",
      description: "Develop a recurring series that viewers can anticipate and follow.",
      difficulty: "Medium",
      impact: "High",
      status: "inprogress"
    }
  ];
  
  // Trending hashtags
  const trendingHashtags = [
    { tag: "#summeroutfit", volume: "5.2B views", relevance: 85 },
    { tag: "#dancechallenge", volume: "3.8B views", relevance: 92 },
    { tag: "#cleantok", volume: "7.1B views", relevance: 65 },
    { tag: "#dayinmylife", volume: "4.3B views", relevance: 88 },
    { tag: "#learningontiktok", volume: "9.6B views", relevance: 76 }
  ];
  
  // Find max followers value for scaling the chart
  const maxFollowers = Math.max(...followerGrowth.map(item => item.followers));
  
  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "bg-gray-100 text-gray-800";
      case "inprogress": return "bg-amber-100 text-amber-800";
      case "done": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Audience Growth Tools</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="analytics">Audience Analytics</TabsTrigger>
          <TabsTrigger value="strategies">Growth Strategies</TabsTrigger>
          <TabsTrigger value="hashtags">Hashtag Research</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Followers</p>
                    <p className="text-2xl font-semibold">{isLoadingAnalytics ? "--" : analytics?.followers.toLocaleString()}</p>
                    <p className="text-xs text-green-500">+8.3% vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#FF0050] bg-opacity-10">
                    <RiUserAddLine className="text-xl text-[#FF0050]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Follower Growth Rate</p>
                    <p className="text-2xl font-semibold">12.7%</p>
                    <p className="text-xs text-green-500">+2.3% vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#00F2EA] bg-opacity-10">
                    <RiLineChartLine className="text-xl text-[#00F2EA]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Profile Views</p>
                    <p className="text-2xl font-semibold">18.5K</p>
                    <p className="text-xs text-green-500">+15.2% vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <RiUserSearchLine className="text-xl text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Follower Engagement</p>
                    <p className="text-2xl font-semibold">6.8%</p>
                    <p className="text-xs text-amber-500">-0.5% vs last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-amber-100">
                    <RiUserHeartLine className="text-xl text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                  <CardTitle className="text-base font-medium">Follower Growth</CardTitle>
                  <Select 
                    defaultValue={timeRange}
                    onValueChange={setTimeRange}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80 relative">
                    <div className="absolute bottom-0 left-0 w-full h-64 flex items-end justify-between px-2">
                      {followerGrowth.map((item, index) => (
                        <div key={index} className="flex flex-col items-center" style={{ width: `${100 / followerGrowth.length}%` }}>
                          <div 
                            className="w-16 bg-gradient-to-t from-[#FF0050] to-[#00F2EA] rounded-t-sm" 
                            style={{ height: `${(item.followers / maxFollowers) * 100}%` }}
                          ></div>
                          <span className="text-xs mt-2 text-gray-500">{item.date}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="absolute top-0 left-0 h-64 flex flex-col justify-between text-xs text-gray-500">
                      <span>90K</span>
                      <span>85K</span>
                      <span>80K</span>
                      <span>75K</span>
                      <span>70K</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Avg. Daily New Followers</p>
                      <p className="text-xl font-semibold">+284</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Follower Retention</p>
                      <p className="text-xl font-semibold">92.5%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Projected Next Month</p>
                      <p className="text-xl font-semibold">92.8K</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="h-full">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Audience Demographics</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Age Distribution</h3>
                      <div className="space-y-2">
                        {demographics.age.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-xs mb-1">
                              <span>{item.group}</span>
                              <span>{item.percentage}%</span>
                            </div>
                            <Progress value={item.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Gender</h3>
                      <div className="flex items-center justify-center">
                        <div className="w-32 h-32">
                          <svg viewBox="0 0 100 100">
                            {/* Female slice (65%) */}
                            <path d="M 50 50 L 50 5 A 45 45 0 0 1 95 50 Z" fill="#FF0050" />
                            {/* Male slice (32%) */}
                            <path d="M 50 50 L 95 50 A 45 45 0 0 1 27 90 Z" fill="#00F2EA" />
                            {/* Other slice (3%) */}
                            <path d="M 50 50 L 27 90 A 45 45 0 0 1 50 5 Z" fill="#EE1D52" />
                            <circle cx="50" cy="50" r="25" fill="white" />
                          </svg>
                        </div>
                        <div className="ml-4 space-y-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-[#FF0050]"></div>
                            <span className="ml-2 text-xs">Female (65%)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-[#00F2EA]"></div>
                            <span className="ml-2 text-xs">Male (32%)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-[#EE1D52]"></div>
                            <span className="ml-2 text-xs">Other (3%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Top Locations</h3>
                      <div className="space-y-2">
                        {demographics.location.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-xs">{item.country}</span>
                            <Badge variant="secondary">{item.percentage}%</Badge>
                          </div>
                        ))}
                      </div>
                      <Button variant="link" size="sm" className="mt-2 text-xs text-[#FF0050] p-0">
                        View All Locations
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardHeader className="px-6 py-5 border-b border-gray-200">
              <CardTitle className="text-base font-medium">Content Performance by Audience Segment</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      <th className="px-6 py-3">Audience Segment</th>
                      <th className="px-6 py-3">Engagement Rate</th>
                      <th className="px-6 py-3">Watch Time</th>
                      <th className="px-6 py-3">Top Content Type</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-pink-100 rounded-full">
                            <RiUserVoiceLine className="text-pink-600" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">Female, 18-24</p>
                            <p className="text-xs text-gray-500">42% of audience</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">8.7%</p>
                        <p className="text-xs text-green-500">Above average</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">22.4s</p>
                        <p className="text-xs text-green-500">+4.2s vs avg</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex">
                          <Badge className="mr-1">Tutorial</Badge>
                          <Badge variant="outline">Lifestyle</Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">Target Content</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <RiUserVoiceLine className="text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">Male, 18-24</p>
                            <p className="text-xs text-gray-500">19% of audience</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">6.2%</p>
                        <p className="text-xs text-amber-500">Below average</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">16.8s</p>
                        <p className="text-xs text-amber-500">-1.4s vs avg</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex">
                          <Badge className="mr-1">Tech</Badge>
                          <Badge variant="outline">Comedy</Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">Target Content</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <RiUserVoiceLine className="text-purple-600" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">Female, 25-34</p>
                            <p className="text-xs text-gray-500">18% of audience</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">7.5%</p>
                        <p className="text-xs text-green-500">Above average</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">20.1s</p>
                        <p className="text-xs text-green-500">+1.9s vs avg</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex">
                          <Badge className="mr-1">DIY</Badge>
                          <Badge variant="outline">Advice</Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">Target Content</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 text-center">
                <Button className="bg-[#FF0050] hover:bg-opacity-90">Generate Audience Insights Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="strategies">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Growth Rate</p>
                    <p className="text-2xl font-semibold">12.7%</p>
                    <p className="text-xs text-green-500">Monthly average</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#FF0050] bg-opacity-10">
                    <RiBarChart2Line className="text-xl text-[#FF0050]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Strategies</p>
                    <p className="text-2xl font-semibold">2</p>
                    <p className="text-xs text-gray-500">4 total</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#00F2EA] bg-opacity-10">
                    <RiBarChartBoxLine className="text-xl text-[#00F2EA]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Completion Rate</p>
                    <p className="text-2xl font-semibold">75%</p>
                    <p className="text-xs text-green-500">Of strategies</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <i className="ri-checkbox-circle-line text-xl text-purple-600"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Strategy Impact</p>
                    <p className="text-2xl font-semibold">High</p>
                    <p className="text-xs text-green-500">+5.2% additional growth</p>
                  </div>
                  <div className="p-3 rounded-full bg-amber-100">
                    <i className="ri-rocket-line text-xl text-amber-500"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Active Growth Strategies</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {growthStrategies.map((strategy, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium">{strategy.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{strategy.description}</p>
                          </div>
                          <Badge className={getStatusColor(strategy.status)}>
                            {strategy.status === "todo" ? "To Do" : 
                             strategy.status === "inprogress" ? "In Progress" : "Done"}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            Difficulty: {strategy.difficulty}
                          </div>
                          <div className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            Impact: {strategy.impact}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {strategy.status === "todo" && (
                            <Button variant="outline" size="sm" className="flex-1">
                              Start
                            </Button>
                          )}
                          {strategy.status === "inprogress" && (
                            <Button variant="outline" size="sm" className="flex-1">
                              Mark Complete
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="flex-1">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-6 bg-[#FF0050] hover:bg-opacity-90">
                    Add New Growth Strategy
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Strategy Impact</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative w-40 h-40">
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
                        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="bold" fill="#333">72%</text>
                        <text x="50" y="65" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#777">Effectiveness</text>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Content Series</span>
                        <span>+18% growth</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Collaborations</span>
                        <span>+15% growth</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Hashtag Research</span>
                        <span>+8% growth</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Posting Schedule</span>
                        <span>+12% growth</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Strategy Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800 mb-1">Join TikTok Challenges</h3>
                      <p className="text-xs text-blue-600">
                        Participating in trending challenges can increase visibility by up to 24%.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-green-800 mb-1">Cross-Platform Promotion</h3>
                      <p className="text-xs text-green-600">
                        Promote your TikTok content on Instagram and YouTube to bring followers from other platforms.
                      </p>
                    </div>
                    
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-amber-800 mb-1">Engage With Comments</h3>
                      <p className="text-xs text-amber-600">
                        Creators who respond to comments within 1 hour see 35% higher engagement rates.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardHeader className="px-6 py-5 border-b border-gray-200">
              <CardTitle className="text-base font-medium">Growth Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-9 border-l-2 border-dashed border-gray-200"></div>
                
                <div className="space-y-8">
                  <div className="relative flex items-start">
                    <div className="absolute left-0 rounded-full bg-[#FF0050] p-2 text-white z-10">
                      <RiRssLine className="h-4 w-4" />
                    </div>
                    <div className="pl-12">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Establish Consistent Posting Schedule</h3>
                        <span className="text-xs text-gray-500">July 1 - July 15</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Post 1-2 videos daily at optimal times (7-9 AM and 8-10 PM).</p>
                      <div className="mt-3 flex items-center">
                        <Progress value={100} className="h-2 flex-1 mr-2" />
                        <span className="text-xs text-green-500">Completed</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="absolute left-0 rounded-full bg-[#00F2EA] p-2 text-white z-10">
                      <RiRssLine className="h-4 w-4" />
                    </div>
                    <div className="pl-12">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Launch Weekly Content Series</h3>
                        <span className="text-xs text-gray-500">July 10 - Ongoing</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Create "TikTok Tuesday Tips" series with consistent branding and format.</p>
                      <div className="mt-3 flex items-center">
                        <Progress value={50} className="h-2 flex-1 mr-2" />
                        <span className="text-xs text-amber-500">In Progress</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="absolute left-0 rounded-full bg-gray-300 p-2 text-white z-10">
                      <RiRssLine className="h-4 w-4" />
                    </div>
                    <div className="pl-12">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Initiate Creator Collaborations</h3>
                        <span className="text-xs text-gray-500">July 20 - August 10</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Reach out to 5 creators in your niche for collaboration opportunities.</p>
                      <div className="mt-3 flex items-center">
                        <Progress value={0} className="h-2 flex-1 mr-2" />
                        <span className="text-xs text-gray-500">Not Started</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="absolute left-0 rounded-full bg-gray-300 p-2 text-white z-10">
                      <RiRssLine className="h-4 w-4" />
                    </div>
                    <div className="pl-12">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Implement Hashtag Strategy</h3>
                        <span className="text-xs text-gray-500">August 1 - Ongoing</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Research and use a mix of trending, niche, and branded hashtags.</p>
                      <div className="mt-3 flex items-center">
                        <Progress value={0} className="h-2 flex-1 mr-2" />
                        <span className="text-xs text-gray-500">Not Started</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hashtags">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Trending Hashtags</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <Input 
                      placeholder="Search hashtags by keyword..." 
                      className="mb-4"
                    />
                    
                    <div className="flex space-x-2 mb-4 flex-wrap gap-y-2">
                      <Badge variant="outline" className="cursor-pointer">All</Badge>
                      <Badge className="bg-[#FF0050] cursor-pointer">Trending</Badge>
                      <Badge variant="outline" className="cursor-pointer">Fashion</Badge>
                      <Badge variant="outline" className="cursor-pointer">Beauty</Badge>
                      <Badge variant="outline" className="cursor-pointer">Lifestyle</Badge>
                      <Badge variant="outline" className="cursor-pointer">Tech</Badge>
                      <Badge variant="outline" className="cursor-pointer">Food</Badge>
                      <Badge variant="outline" className="cursor-pointer">Fitness</Badge>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                          <th className="px-6 py-3">Hashtag</th>
                          <th className="px-6 py-3">Volume</th>
                          <th className="px-6 py-3">Relevance</th>
                          <th className="px-6 py-3">Competition</th>
                          <th className="px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {trendingHashtags.map((hashtag, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 font-medium">{hashtag.tag}</td>
                            <td className="px-6 py-4 text-sm">{hashtag.volume}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <Progress value={hashtag.relevance} className="h-2 w-24 mr-2" />
                                <span className="text-xs">{hashtag.relevance}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={index % 3 === 0 ? "default" : index % 3 === 1 ? "secondary" : "outline"}>
                                {index % 3 === 0 ? "High" : index % 3 === 1 ? "Medium" : "Low"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Button variant="outline" size="sm">Add to List</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <Button variant="outline" className="mr-2">Load More</Button>
                    <Button className="bg-[#FF0050] hover:bg-opacity-90">
                      Export Hashtag List
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Your Hashtag Performance</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                          <th className="px-6 py-3">Hashtag</th>
                          <th className="px-6 py-3">Uses</th>
                          <th className="px-6 py-3">Avg. Views</th>
                          <th className="px-6 py-3">Engagement</th>
                          <th className="px-6 py-3">Performance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 font-medium">#tutorial</td>
                          <td className="px-6 py-4">18</td>
                          <td className="px-6 py-4">245K</td>
                          <td className="px-6 py-4">7.8%</td>
                          <td className="px-6 py-4">
                            <Badge className="bg-green-100 text-green-800">High</Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium">#tiktoktips</td>
                          <td className="px-6 py-4">12</td>
                          <td className="px-6 py-4">186K</td>
                          <td className="px-6 py-4">6.5%</td>
                          <td className="px-6 py-4">
                            <Badge className="bg-green-100 text-green-800">High</Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium">#fyp</td>
                          <td className="px-6 py-4">24</td>
                          <td className="px-6 py-4">120K</td>
                          <td className="px-6 py-4">5.2%</td>
                          <td className="px-6 py-4">
                            <Badge className="bg-amber-100 text-amber-800">Medium</Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium">#dayinmylife</td>
                          <td className="px-6 py-4">8</td>
                          <td className="px-6 py-4">95K</td>
                          <td className="px-6 py-4">4.8%</td>
                          <td className="px-6 py-4">
                            <Badge className="bg-amber-100 text-amber-800">Medium</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Hashtag Generator</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Content Topic</label>
                      <Input placeholder="e.g., makeup tutorial, cooking, workout" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Hashtag Type</label>
                      <Select defaultValue="mixed">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trending">Trending Only</SelectItem>
                          <SelectItem value="niche">Niche Focused</SelectItem>
                          <SelectItem value="mixed">Balanced Mix</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Number of Hashtags</label>
                      <Select defaultValue="7">
                        <SelectTrigger>
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Hashtags</SelectItem>
                          <SelectItem value="7">7 Hashtags</SelectItem>
                          <SelectItem value="10">10 Hashtags</SelectItem>
                          <SelectItem value="15">15 Hashtags</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button className="w-full bg-[#FF0050] hover:bg-opacity-90">
                      Generate Hashtags
                    </Button>
                    
                    <div className="p-4 bg-gray-50 rounded-lg mt-4">
                      <label className="block text-sm font-medium mb-2">Suggested Hashtags</label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">#tiktokteacher</Badge>
                        <Badge variant="secondary">#learnontiktok</Badge>
                        <Badge variant="secondary">#tutorial</Badge>
                        <Badge variant="secondary">#tiktoktips</Badge>
                        <Badge variant="secondary">#howtotiktok</Badge>
                        <Badge variant="secondary">#creatortips</Badge>
                        <Badge variant="secondary">#fyp</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Copy All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Hashtag Tips</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800 mb-1">Mix Your Hashtags</h3>
                      <p className="text-xs text-blue-600">
                        Use a combination of trending (2-3), niche (2-3), and branded (1-2) hashtags for optimal reach.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-green-800 mb-1">Avoid Hashtag Stuffing</h3>
                      <p className="text-xs text-green-600">
                        5-7 well-researched hashtags perform better than using the maximum 30 hashtags.
                      </p>
                    </div>
                    
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-amber-800 mb-1">Research Competitors</h3>
                      <p className="text-xs text-amber-600">
                        Analyze which hashtags your successful competitors are using for similar content.
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-purple-800 mb-1">Create Branded Hashtags</h3>
                      <p className="text-xs text-purple-600">
                        Develop your own unique hashtag to build community and increase brand recognition.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="competitors">
          <Card className="mb-6">
            <CardHeader className="px-6 py-5 border-b border-gray-200">
              <CardTitle className="text-base font-medium">Competitor Tracking</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <Input 
                  placeholder="Search for a TikTok creator..." 
                  className="max-w-md mr-4"
                />
                <Button className="bg-[#FF0050] hover:bg-opacity-90">
                  <i className="ri-add-line mr-2"></i> Add Competitor
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      <th className="px-6 py-3">Creator</th>
                      <th className="px-6 py-3">Followers</th>
                      <th className="px-6 py-3">Engagement</th>
                      <th className="px-6 py-3">Post Frequency</th>
                      <th className="px-6 py-3">Top Content</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&h=80&q=80" 
                              alt="Creator" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">@tech_influencer</p>
                            <p className="text-xs text-gray-500">Tech reviews & tutorials</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">1.2M</p>
                        <p className="text-xs text-green-500">+5.3% weekly</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">8.7%</p>
                        <p className="text-xs text-green-500">Above average</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">Daily</p>
                        <p className="text-xs text-gray-500">1-2 videos/day</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">Reviews</Badge>
                          <Badge variant="secondary" className="text-xs">Tutorials</Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm" className="text-red-500">Remove</Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&h=80&q=80" 
                              alt="Creator" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">@beauty_guru</p>
                            <p className="text-xs text-gray-500">Makeup & skincare</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">950K</p>
                        <p className="text-xs text-green-500">+3.8% weekly</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">7.2%</p>
                        <p className="text-xs text-amber-500">Average</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">3-4x Weekly</p>
                        <p className="text-xs text-gray-500">High quality</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">Tutorials</Badge>
                          <Badge variant="secondary" className="text-xs">Product Reviews</Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm" className="text-red-500">Remove</Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&h=80&q=80" 
                              alt="Creator" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">@fitness_coach</p>
                            <p className="text-xs text-gray-500">Workouts & nutrition</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">780K</p>
                        <p className="text-xs text-green-500">+4.2% weekly</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">9.1%</p>
                        <p className="text-xs text-green-500">Above average</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">Daily</p>
                        <p className="text-xs text-gray-500">Morning posts</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">Workouts</Badge>
                          <Badge variant="secondary" className="text-xs">Motivation</Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm" className="text-red-500">Remove</Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="px-6 py-5 border-b border-gray-200">
                <CardTitle className="text-base font-medium">Competitor Content Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <Select defaultValue="tech_influencer">
                    <SelectTrigger>
                      <SelectValue placeholder="Select competitor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech_influencer">@tech_influencer</SelectItem>
                      <SelectItem value="beauty_guru">@beauty_guru</SelectItem>
                      <SelectItem value="fitness_coach">@fitness_coach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Top Performing Content</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Video Preview</span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-sm mb-1">10 Tech Hacks You Need To Know</h4>
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <span className="flex items-center mr-3"><i className="ri-eye-line mr-1"></i> 2.8M</span>
                          <span className="flex items-center mr-3"><i className="ri-heart-line mr-1"></i> 305K</span>
                          <span className="flex items-center"><i className="ri-chat-1-line mr-1"></i> 12.4K</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="secondary" className="text-xs">#techtips</Badge>
                          <Badge variant="secondary" className="text-xs">#hacks</Badge>
                          <Badge variant="secondary" className="text-xs">#tutorial</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Content Patterns</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Most Used Format</p>
                          <p className="text-xs text-gray-500">How-to tutorials and reviews</p>
                        </div>
                        <Badge>42% of content</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Average Video Length</p>
                          <p className="text-xs text-gray-500">45-60 seconds</p>
                        </div>
                        <Badge variant="outline">75% completion rate</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Best Posting Time</p>
                          <p className="text-xs text-gray-500">6-8 PM on weekdays</p>
                        </div>
                        <Badge variant="secondary">+18% engagement</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="px-6 py-5 border-b border-gray-200">
                <CardTitle className="text-base font-medium">Competitive Insights</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Gap Analysis</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Video Production Quality</span>
                          <div className="flex items-center">
                            <span className="mr-2 text-gray-500">You</span>
                            <span className="text-[#FF0050]">vs</span>
                            <span className="ml-2 text-gray-500">Competitors</span>
                          </div>
                        </div>
                        <div className="flex w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="bg-[#FF0050] w-[65%]"></div>
                          <div className="bg-[#00F2EA] w-[70%] ml-[-35%]"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Posting Frequency</span>
                          <div className="flex items-center">
                            <span className="mr-2 text-gray-500">You</span>
                            <span className="text-[#FF0050]">vs</span>
                            <span className="ml-2 text-gray-500">Competitors</span>
                          </div>
                        </div>
                        <div className="flex w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="bg-[#FF0050] w-[55%]"></div>
                          <div className="bg-[#00F2EA] w-[85%] ml-[-40%]"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Engagement Rate</span>
                          <div className="flex items-center">
                            <span className="mr-2 text-gray-500">You</span>
                            <span className="text-[#FF0050]">vs</span>
                            <span className="ml-2 text-gray-500">Competitors</span>
                          </div>
                        </div>
                        <div className="flex w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="bg-[#FF0050] w-[75%]"></div>
                          <div className="bg-[#00F2EA] w-[65%] ml-[-40%]"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Opportunities</h3>
                    <div className="space-y-3">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-green-800 mb-1">Content Gap</h4>
                        <p className="text-xs text-green-600">
                          Competitors aren't creating beginner-friendly content. Consider a "Basics Series" for newcomers.
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 mb-1">Collaboration Potential</h4>
                        <p className="text-xs text-blue-600">
                          @tech_influencer has mentioned wanting to collaborate with other creators in your niche.
                        </p>
                      </div>
                      
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-amber-800 mb-1">Hashtag Strategy</h4>
                        <p className="text-xs text-amber-600">
                          Your competitors aren't using industry-specific hashtags that have high engagement potential.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-[#FF0050] hover:bg-opacity-90">
                    Generate Competitive Action Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AudienceGrowth;
