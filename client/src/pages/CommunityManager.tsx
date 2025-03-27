import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RiHeart3Line, RiSendPlaneLine, RiEmotionLine, RiTimeLine, RiHashtag, RiStarFill } from "react-icons/ri";

interface Comment {
  id: number;
  videoId: number;
  username: string;
  avatarUrl: string;
  content: string;
  likes: number;
  timestamp: Date;
}

const CommunityManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("comments");
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  
  // Fetch comments
  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ["/api/videos/1/comments"],
  });
  
  // Handle reply to comment
  const handleReplyClick = (comment: Comment) => {
    setSelectedComment(comment);
    setReplyDialogOpen(true);
  };
  
  // Submit reply
  const handleSubmitReply = async () => {
    if (!selectedComment || !replyContent.trim()) return;
    
    try {
      // In a real implementation, this would post to an endpoint like /api/comments/:id/replies
      // For now, we'll just simulate a successful reply
      
      toast({
        title: "Reply sent",
        description: `Your reply to ${selectedComment.username} has been sent.`
      });
      
      // Reset state
      setReplyContent("");
      setReplyDialogOpen(false);
      setSelectedComment(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle like comment
  const handleLikeComment = async (commentId: number) => {
    try {
      // In a real implementation, this would use a PUT/PATCH request to update the comment likes
      
      toast({
        description: "Comment liked",
      });
      
      // Update local data optimistically
      queryClient.setQueryData(["/api/videos/1/comments"], (oldData: any) => 
        oldData.map((comment: Comment) => 
          comment.id === commentId 
            ? { ...comment, likes: comment.likes + 1 } 
            : comment
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like comment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Engagement metrics
  const engagementInsights = [
    { 
      label: "Avg. Response Time", 
      value: "3.2 hrs", 
      target: "Target: < 2 hrs",
      icon: <RiTimeLine className="h-5 w-5 text-amber-500" />
    },
    { 
      label: "Response Rate", 
      value: "78%", 
      changePercentage: 5,
      icon: <RiSendPlaneLine className="h-5 w-5 text-green-500" />
    },
    { 
      label: "Comment Sentiment", 
      value: "92% Positive", 
      changePercentage: 3,
      icon: <RiEmotionLine className="h-5 w-5 text-blue-500" />
    },
    { 
      label: "Engagement Rate", 
      value: "6.8%", 
      changePercentage: -1.2,
      icon: <RiHeart3Line className="h-5 w-5 text-purple-500" />
    }
  ];
  
  // Top hashtags for trending discussions
  const trendingHashtags = [
    { tag: "#dancechallenge", mentions: 158 },
    { tag: "#tiktoktips", mentions: 93 },
    { tag: "#trending", mentions: 72 },
    { tag: "#fyp", mentions: 68 },
    { tag: "#tutorial", mentions: 45 }
  ];
  
  // Influencer recommendations
  const influencerRecommendations = [
    { 
      username: "@dance_queen", 
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80",
      followers: "2.5M",
      relevance: 92,
      engaged: false
    },
    { 
      username: "@tech_guru", 
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80",
      followers: "1.8M",
      relevance: 85,
      engaged: true
    },
    { 
      username: "@foodie_adventures", 
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80",
      followers: "950K",
      relevance: 79,
      engaged: false
    }
  ];
  
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Community Manager</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="insights">Engagement Insights</TabsTrigger>
          <TabsTrigger value="influencers">Influencer Network</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comments">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                  <CardTitle className="text-base font-medium">Recent Comments</CardTitle>
                  <div className="flex space-x-2">
                    <Select defaultValue="recent">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="likes">Most Likes</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                        <SelectItem value="unreplied">Unreplied</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <i className="ri-refresh-line"></i>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Input 
                    placeholder="Search comments..." 
                    className="mb-6"
                    icon={<i className="ri-search-line"></i>}
                  />
                  
                  {isLoadingComments ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex animate-pulse">
                          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                          <div className="ml-3 flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {comments?.map((comment: Comment) => (
                        <div key={comment.id} className="flex">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={comment.avatarUrl} 
                            alt={comment.username} 
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center">
                              <h5 className="text-sm font-medium">{comment.username}</h5>
                              <span className="ml-2 text-xs text-gray-500">
                                {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                            <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
                              <button 
                                className="flex items-center hover:text-[#FF0050] transition-colors"
                                onClick={() => handleLikeComment(comment.id)}
                              >
                                <RiHeart3Line className="mr-1" /> {comment.likes}
                              </button>
                              <button 
                                className="text-[#FF0050] hover:text-opacity-80 transition-colors"
                                onClick={() => handleReplyClick(comment)}
                              >
                                Reply
                              </button>
                              <div className="flex-1 text-right">
                                <Badge variant="secondary" className="text-xs">Video #1</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-center">
                    <Button variant="outline">Load More Comments</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {engagementInsights.map((insight, index) => (
                      <div key={index} className="flex items-center">
                        <div className="p-3 rounded-full bg-gray-100">
                          {insight.icon}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-500">{insight.label}</p>
                          <div className="flex items-center">
                            <p className="text-lg font-semibold">{insight.value}</p>
                            {insight.changePercentage && (
                              <span className={`text-xs ml-2 ${insight.changePercentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {insight.changePercentage >= 0 ? "+" : ""}{insight.changePercentage}%
                              </span>
                            )}
                          </div>
                          {insight.target && (
                            <p className="text-xs text-amber-500">{insight.target}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Trending Discussions</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {trendingHashtags.map((hashtag, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <RiHashtag className="text-[#FF0050] mr-1" />
                          <span className="text-sm font-medium">{hashtag.tag.substring(1)}</span>
                        </div>
                        <span className="text-xs text-gray-500">{hashtag.mentions} mentions</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    View All Trends
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Reply Dialog */}
          <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Reply to Comment</DialogTitle>
              </DialogHeader>
              
              {selectedComment && (
                <div className="py-4">
                  <div className="flex items-start mb-4 p-3 bg-gray-50 rounded-lg">
                    <img 
                      className="h-8 w-8 rounded-full" 
                      src={selectedComment.avatarUrl} 
                      alt={selectedComment.username} 
                    />
                    <div className="ml-3">
                      <div className="flex items-center">
                        <h5 className="text-sm font-medium">{selectedComment.username}</h5>
                        <span className="ml-2 text-xs text-gray-500">
                          {formatDistanceToNow(new Date(selectedComment.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{selectedComment.content}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Write your reply..." 
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={4}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setReplyDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSubmitReply}
                        disabled={!replyContent.trim()}
                        className="bg-[#FF0050] hover:bg-opacity-90"
                      >
                        Post Reply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="px-6 py-5 border-b border-gray-200">
                <CardTitle className="text-base font-medium">Engagement Over Time</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="p-6 bg-gray-100 rounded-full inline-flex items-center justify-center mb-4">
                      <i className="ri-line-chart-line text-3xl text-gray-400"></i>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Engagement Chart</h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                      This chart would display your engagement metrics over time, including comments, likes, and shares.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="px-6 py-5 border-b border-gray-200">
                <CardTitle className="text-base font-medium">Comment Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between mb-6">
                  <div className="text-center flex-1">
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-2">
                      <i className="ri-emotion-happy-line text-xl text-green-600"></i>
                    </div>
                    <p className="text-sm text-gray-500">Positive</p>
                    <p className="text-2xl font-semibold">72%</p>
                  </div>
                  <div className="text-center flex-1">
                    <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-2">
                      <i className="ri-emotion-normal-line text-xl text-gray-600"></i>
                    </div>
                    <p className="text-sm text-gray-500">Neutral</p>
                    <p className="text-2xl font-semibold">20%</p>
                  </div>
                  <div className="text-center flex-1">
                    <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-2">
                      <i className="ri-emotion-unhappy-line text-xl text-red-600"></i>
                    </div>
                    <p className="text-sm text-gray-500">Negative</p>
                    <p className="text-2xl font-semibold">8%</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Top Positive Keywords</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">amazing</Badge>
                      <Badge variant="secondary">helpful</Badge>
                      <Badge variant="secondary">love</Badge>
                      <Badge variant="secondary">great</Badge>
                      <Badge variant="secondary">awesome</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Common Questions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">how did you</Badge>
                      <Badge variant="secondary">what app</Badge>
                      <Badge variant="secondary">tutorial please</Badge>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Generate Detailed Report
                </Button>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader className="px-6 py-5 border-b border-gray-200">
                <CardTitle className="text-base font-medium">Engagement Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <i className="ri-chat-smile-3-line text-lg text-green-600"></i>
                      </div>
                      <h3 className="ml-2 font-medium">Respond to Questions</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      There are 12 unanswered questions in your recent comments that could use a response.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      View Questions
                    </Button>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <i className="ri-user-follow-line text-lg text-blue-600"></i>
                      </div>
                      <h3 className="ml-2 font-medium">Engage With Fans</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Your top 5 most active commenters haven't received a response in the last week.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      View Top Fans
                    </Button>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <i className="ri-hashtag text-lg text-amber-600"></i>
                      </div>
                      <h3 className="ml-2 font-medium">Join Conversations</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      There are 3 trending hashtags in your niche that you could engage with to increase visibility.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      View Hashtags
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="influencers">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Influencer Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Input 
                    placeholder="Search influencers by username, niche, or location..." 
                    className="mb-6"
                  />
                  
                  <div className="space-y-4">
                    {influencerRecommendations.map((influencer, index) => (
                      <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#FF0050] transition-colors">
                        <img 
                          src={influencer.avatar} 
                          alt={influencer.username} 
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium">{influencer.username}</h3>
                            <span className="ml-2 text-xs text-gray-500">{influencer.followers} followers</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {Array(5).fill(0).map((_, i) => (
                                <RiStarFill 
                                  key={i} 
                                  className={`h-4 w-4 ${i < Math.round(influencer.relevance / 20) ? "text-amber-400" : "text-gray-200"}`} 
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-xs text-gray-500">{influencer.relevance}% relevance match</span>
                          </div>
                        </div>
                        <Button 
                          variant={influencer.engaged ? "default" : "outline"}
                          className={influencer.engaged ? "bg-[#00F2EA] hover:bg-opacity-90" : ""}
                        >
                          {influencer.engaged ? "Connected" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-6">
                    Load More Influencers
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Collaboration Stats</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-[#FF0050] bg-opacity-10">
                        <i className="ri-team-line text-xl text-[#FF0050]"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500">Active Collaborations</p>
                        <p className="text-xl font-semibold">7</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-[#00F2EA] bg-opacity-10">
                        <i className="ri-shake-hands-line text-xl text-[#00F2EA]"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500">Collaboration Reach</p>
                        <p className="text-xl font-semibold">12.4M</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-100">
                        <i className="ri-bar-chart-line text-xl text-purple-600"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500">Avg. Engagement Boost</p>
                        <p className="text-xl font-semibold">+18.7%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="px-6 py-5 border-b border-gray-200">
                  <CardTitle className="text-base font-medium">Collaboration Ideas</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-sm mb-1">Duet Challenge</h3>
                      <p className="text-xs text-gray-500">
                        Create a duet challenge with complementary content creators in your niche.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-sm mb-1">Takeover Tuesday</h3>
                      <p className="text-xs text-gray-500">
                        Swap accounts for a day to cross-pollinate audiences and gain new followers.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-sm mb-1">Joint Livestream</h3>
                      <p className="text-xs text-gray-500">
                        Host a Q&A or tutorial session with another creator to combine expertise.
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 bg-[#FF0050] hover:bg-opacity-90">
                    Start New Collaboration
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityManager;
