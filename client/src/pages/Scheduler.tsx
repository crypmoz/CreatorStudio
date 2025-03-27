import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { apiRequest } from "@/lib/queryClient";
import { RiArrowLeftSLine, RiArrowRightSLine, RiTimeLine, RiCalendarLine, RiTiktokFill, RiInstagramLine, RiFacebookFill, RiTwitterXFill, RiYoutubeFill } from "react-icons/ri";

interface ScheduledPost {
  id: number;
  title: string;
  thumbnailUrl: string;
  platforms: string[];
  scheduledFor: Date;
}

interface CalendarDay {
  day: Date;
  isCurrentMonth: boolean;
  hasEvents: boolean;
  isSelected: boolean;
  events: number;
}

const Scheduler = () => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  
  // Fetch scheduled posts
  const { data: scheduledPosts, isLoading, refetch } = useQuery({
    queryKey: ["/api/users/1/scheduled-posts"],
  });
  
  // Form for new scheduled post
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      platforms: [] as string[],
      scheduledDate: new Date(),
      scheduledTime: "12:00",
    }
  });
  
  // Handle month navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  // Generate calendar days for the current month view
  const generateCalendarDays = (): CalendarDay[] => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add days from previous and next month to fill calendar grid
    const firstDayOfMonth = monthStart.getDay();
    const lastDayOfMonth = monthEnd.getDay();
    
    const prevMonthDays = firstDayOfMonth > 0 
      ? eachDayOfInterval({ 
          start: subMonths(monthStart, 1), 
          end: subMonths(monthStart, 1) 
        }).slice(-firstDayOfMonth)
      : [];
    
    const nextMonthDays = lastDayOfMonth < 6 
      ? eachDayOfInterval({ 
          start: addMonths(monthEnd, 1), 
          end: addMonths(monthEnd, 1)
        }).slice(0, 6 - lastDayOfMonth)
      : [];
    
    const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
    
    // Check which days have scheduled posts
    return allDays.map(day => {
      const hasEvents = scheduledPosts?.some((post: ScheduledPost) => 
        isSameDay(new Date(post.scheduledFor), day)
      ) || false;
      
      const postCount = scheduledPosts?.filter((post: ScheduledPost) => 
        isSameDay(new Date(post.scheduledFor), day)
      ).length || 0;
      
      return {
        day,
        isCurrentMonth: isSameMonth(day, currentMonth),
        hasEvents,
        isSelected: selectedDay ? isSameDay(day, selectedDay) : isToday(day),
        events: postCount
      };
    });
  };
  
  // Get posts for selected day
  const getSelectedDayPosts = () => {
    if (!selectedDay || !scheduledPosts) return [];
    
    return scheduledPosts.filter((post: ScheduledPost) => 
      isSameDay(new Date(post.scheduledFor), selectedDay)
    );
  };
  
  // Handle day selection
  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day.day);
  };
  
  // Handle form submission for new scheduled post
  const onSubmit = async (data: any) => {
    try {
      // Combine date and time
      const [hours, minutes] = data.scheduledTime.split(':').map(Number);
      const scheduledDate = new Date(data.scheduledDate);
      scheduledDate.setHours(hours, minutes);
      
      // Format the platforms array
      const platformsArray = Array.isArray(data.platforms) 
        ? data.platforms 
        : [data.platforms];
      
      const postData = {
        userId: 1, // Using demo user ID
        title: data.title,
        thumbnailUrl: "https://via.placeholder.com/80",
        platforms: platformsArray,
        scheduledFor: scheduledDate,
      };
      
      await apiRequest('POST', '/api/scheduled-posts', postData);
      
      toast({
        title: "Post Scheduled",
        description: `"${data.title}" has been scheduled for ${format(scheduledDate, 'PPpp')}`
      });
      
      // Reset form and close dialog
      form.reset();
      setIsCreateDialogOpen(false);
      
      // Refetch scheduled posts
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Platform options
  const platformOptions = [
    { value: "tiktok", label: "TikTok", icon: <RiTiktokFill className="mr-2" /> },
    { value: "instagram", label: "Instagram", icon: <RiInstagramLine className="mr-2" /> },
    { value: "facebook", label: "Facebook", icon: <RiFacebookFill className="mr-2" /> },
    { value: "twitter", label: "Twitter", icon: <RiTwitterXFill className="mr-2" /> },
    { value: "youtube", label: "YouTube", icon: <RiYoutubeFill className="mr-2" /> }
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Cross-Platform Scheduler</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF0050] hover:bg-opacity-90">
              <i className="ri-add-line mr-2"></i> Schedule New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule a New Post</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter post title" {...field} />
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
                        <Textarea placeholder="Enter post description" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="platforms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platforms</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value as string}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select platforms" />
                          </SelectTrigger>
                          <SelectContent>
                            {platformOptions.map((platform) => (
                              <SelectItem key={platform.value} value={platform.value}>
                                <div className="flex items-center">
                                  {platform.icon}
                                  {platform.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <RiCalendarLine className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="scheduledTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#FF0050] hover:bg-opacity-90">
                    Schedule Post
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="analytics">Scheduling Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
          <Card className="mb-6">
            <CardHeader className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  {format(currentMonth, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={prevMonth}
                  >
                    <RiArrowLeftSLine />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={nextMonth}
                  >
                    <RiArrowRightSLine />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                  <div key={i} className="text-xs font-medium text-gray-500 text-center py-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {generateCalendarDays().map((day, index) => (
                  <div 
                    key={index} 
                    className={`p-1 h-20 text-sm ${!day.isCurrentMonth ? 'bg-gray-50 opacity-50' : ''} 
                              ${day.isSelected ? 'bg-[#FF0050] bg-opacity-10 border border-[#FF0050]' : ''}
                              rounded-md relative cursor-pointer hover:bg-gray-50 transition-colors`}
                    onClick={() => handleDayClick(day)}
                  >
                    <span className={`block p-1 ${isToday(day.day) && !day.isSelected ? 'bg-[#00F2EA] text-white rounded-full h-7 w-7 flex items-center justify-center' : ''}`}>
                      {format(day.day, 'd')}
                    </span>
                    
                    {day.hasEvents && (
                      <div className="mt-1">
                        {day.events > 0 && (
                          <div className="text-xs bg-[#FF0050] text-white rounded px-1 py-0.5 text-center">
                            {day.events} post{day.events !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Selected day posts */}
          <Card>
            <CardHeader className="px-6 py-5 border-b border-gray-200">
              <CardTitle className="text-base font-medium">
                {selectedDay ? format(selectedDay, 'MMMM d, yyyy') : 'Today'}'s Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex animate-pulse">
                      <div className="h-12 w-12 bg-gray-200 rounded"></div>
                      <div className="ml-3 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {getSelectedDayPosts().length > 0 ? (
                    <div className="space-y-3">
                      {getSelectedDayPosts().map((post: ScheduledPost) => (
                        <div key={post.id} className="flex p-3 bg-gray-50 rounded-lg border-l-4 border-[#FF0050]">
                          <div className="h-12 w-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={post.thumbnailUrl} 
                              className="object-cover w-full h-full" 
                              alt={post.title} 
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <h5 className="text-sm font-medium">{post.title}</h5>
                              <div className="flex items-center space-x-2">
                                {post.platforms.includes("tiktok") && <RiTiktokFill className="text-sm" />}
                                {post.platforms.includes("instagram") && <RiInstagramLine className="text-sm" />}
                                {post.platforms.includes("facebook") && <RiFacebookFill className="text-sm" />}
                                {post.platforms.includes("twitter") && <RiTwitterXFill className="text-sm" />}
                                {post.platforms.includes("youtube") && <RiYoutubeFill className="text-sm" />}
                              </div>
                            </div>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <RiTimeLine className="mr-1" />
                              <span>{format(new Date(post.scheduledFor), 'h:mm a')}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="rounded-full bg-gray-100 p-3 inline-flex items-center justify-center mb-4">
                        <RiCalendarLine className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No posts scheduled</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {selectedDay ? `There are no posts scheduled for ${format(selectedDay, 'MMMM d, yyyy')}` : 'There are no posts scheduled for today'}
                      </p>
                      <Button 
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-[#FF0050] hover:bg-opacity-90"
                      >
                        <i className="ri-add-line mr-1"></i> Schedule Post
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardHeader className="px-6 py-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">
                  Upcoming Scheduled Posts
                </CardTitle>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex animate-pulse p-4 border-b border-gray-100">
                      <div className="h-16 w-16 bg-gray-200 rounded"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {scheduledPosts && scheduledPosts.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {scheduledPosts.map((post: ScheduledPost) => (
                        <div key={post.id} className="flex py-4 items-center">
                          <div className="h-16 w-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={post.thumbnailUrl} 
                              className="object-cover w-full h-full" 
                              alt={post.title} 
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h5 className="text-sm font-medium">{post.title}</h5>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <RiCalendarLine className="mr-1" />
                              <span>{format(new Date(post.scheduledFor), 'PPP')}</span>
                              <span className="mx-2">•</span>
                              <RiTimeLine className="mr-1" />
                              <span>{format(new Date(post.scheduledFor), 'h:mm a')}</span>
                            </div>
                            <div className="flex mt-2 space-x-1">
                              {post.platforms.map((platform, idx) => {
                                let Icon;
                                switch(platform) {
                                  case 'tiktok': Icon = RiTiktokFill; break;
                                  case 'instagram': Icon = RiInstagramLine; break;
                                  case 'facebook': Icon = RiFacebookFill; break;
                                  case 'twitter': Icon = RiTwitterXFill; break;
                                  case 'youtube': Icon = RiYoutubeFill; break;
                                  default: Icon = RiTiktokFill;
                                }
                                return (
                                  <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                    <Icon className="mr-1" />
                                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-500">Cancel</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="rounded-full bg-gray-100 p-3 inline-flex items-center justify-center mb-4">
                        <RiCalendarLine className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No scheduled posts</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        You don't have any posts scheduled yet
                      </p>
                      <Button 
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-[#FF0050] hover:bg-opacity-90"
                      >
                        <i className="ri-add-line mr-1"></i> Schedule Your First Post
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Scheduled</p>
                    <p className="text-2xl font-semibold">{scheduledPosts?.length || 0}</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#FF0050] bg-opacity-10">
                    <RiCalendarLine className="text-xl text-[#FF0050]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Posts This Week</p>
                    <p className="text-2xl font-semibold">4</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#00F2EA] bg-opacity-10">
                    <RiCalendarLine className="text-xl text-[#00F2EA]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Multi-Platform</p>
                    <p className="text-2xl font-semibold">2</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <RiTiktokFill className="text-xl text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Optimal Time Usage</p>
                    <p className="text-2xl font-semibold">85%</p>
                  </div>
                  <div className="p-3 rounded-full bg-amber-100">
                    <RiTimeLine className="text-xl text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="px-6 py-5 border-b border-gray-200">
              <CardTitle className="text-base font-medium">
                Posting Schedule Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-4">Best Times to Post</h3>
                <div className="grid grid-cols-7 gap-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                    <div key={i} className="text-center">
                      <p className="text-sm font-medium mb-2">{day}</p>
                      <div className="bg-gray-100 rounded-lg p-2">
                        <p className="text-xs font-medium text-[#FF0050]">9:00 AM</p>
                        <p className="text-xs text-gray-500 my-1">6:00 PM</p>
                        <p className="text-xs text-gray-500">9:00 PM</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-4">Platform-Specific Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <RiTiktokFill className="text-lg mr-2" />
                      <h4 className="font-medium">TikTok</h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Best days: Wednesday, Friday, Saturday</p>
                    <p className="text-xs text-gray-500">Best times: 9 AM, 12 PM, 7 PM</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <RiInstagramLine className="text-lg mr-2" />
                      <h4 className="font-medium">Instagram</h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Best days: Tuesday, Thursday, Friday</p>
                    <p className="text-xs text-gray-500">Best times: 11 AM, 2 PM, 5 PM</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <RiFacebookFill className="text-lg mr-2" />
                      <h4 className="font-medium">Facebook</h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Best days: Monday, Wednesday, Friday</p>
                    <p className="text-xs text-gray-500">Best times: 8 AM, 1 PM, 6 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Scheduler;
