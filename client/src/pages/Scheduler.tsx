import { useState, useEffect } from "react";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RiArrowLeftSLine, RiArrowRightSLine, RiCalendarLine, RiTimeLine, RiDeleteBinLine, RiPencilLine, RiShareLine } from "react-icons/ri";
import { SiTiktok, SiInstagram, SiYoutube, SiX, SiFacebook } from "react-icons/si";
import { useAuth } from "@/hooks/use-auth";

// Type definitions
interface ScheduledPost {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  content: string | null;
  thumbnailUrl: string | null;
  platforms: string[] | null;
  scheduledFor: string;
  status: string;
  timeZone: string;
  platformSpecificSettings: Record<string, any>;
  isOptimalTimeSelected: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CalendarDay {
  day: Date;
  isCurrentMonth: boolean;
  hasEvents: boolean;
  isSelected: boolean;
  events: number;
}

interface BestTimeData {
  platform: string;
  bestTimes: number[];
}

const Scheduler = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedPlatform, setSelectedPlatform] = useState("tiktok");
  
  // Fetch scheduled posts
  const { data: scheduledPosts, isLoading, refetch } = useQuery<ScheduledPost[]>({
    queryKey: ["/api/scheduler/posts"],
    enabled: !!user
  });
  
  // Fetch best posting times
  const { data: bestTimes } = useQuery<BestTimeData>({
    queryKey: ["/api/scheduler/best-times", selectedPlatform],
    enabled: !!user && activeTab === "analytics"
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/scheduler/posts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Post Deleted",
        description: "The scheduled post has been deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/scheduler/posts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Publish now mutation
  const publishMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/scheduler/posts/${id}/publish`);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Post Published",
        description: `Successfully published to ${data.results.length} platform(s)`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/scheduler/posts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish the post. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Form for new scheduled post
  const createForm = useForm({
    defaultValues: {
      title: "",
      description: "",
      content: "",
      platforms: [] as string[],
      scheduledDate: new Date(),
      scheduledTime: "12:00",
      timeZone: "UTC",
      useOptimalTime: false
    }
  });
  
  // Form for editing a post
  const editForm = useForm({
    defaultValues: {
      id: 0,
      title: "",
      description: "",
      content: "",
      platforms: [] as string[],
      scheduledDate: new Date(),
      scheduledTime: "12:00",
      timeZone: "UTC",
      useOptimalTime: false,
      status: "pending"
    }
  });
  
  // Set up edit form when editing post changes
  useEffect(() => {
    if (editingPost) {
      const scheduledDate = parseISO(editingPost.scheduledFor);
      const hours = scheduledDate.getHours().toString().padStart(2, '0');
      const minutes = scheduledDate.getMinutes().toString().padStart(2, '0');
      
      editForm.reset({
        id: editingPost.id,
        title: editingPost.title,
        description: editingPost.description || "",
        content: editingPost.content || "",
        platforms: editingPost.platforms || [],
        scheduledDate: scheduledDate,
        scheduledTime: `${hours}:${minutes}`,
        timeZone: editingPost.timeZone,
        useOptimalTime: editingPost.isOptimalTimeSelected,
        status: editingPost.status
      });
    }
  }, [editingPost, editForm]);
  
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
          start: new Date(monthStart.getFullYear(), monthStart.getMonth(), 0 - firstDayOfMonth + 1), 
          end: new Date(monthStart.getFullYear(), monthStart.getMonth(), 0)
        })
      : [];
    
    const nextMonthDays = lastDayOfMonth < 6 
      ? eachDayOfInterval({ 
          start: new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, 1), 
          end: new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, 6 - lastDayOfMonth)
        })
      : [];
    
    const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
    
    // Check which days have scheduled posts
    return allDays.map(day => {
      const hasEvents = scheduledPosts?.some((post: ScheduledPost) => 
        isSameDay(parseISO(post.scheduledFor), day)
      ) || false;
      
      const postCount = scheduledPosts?.filter((post: ScheduledPost) => 
        isSameDay(parseISO(post.scheduledFor), day)
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
      isSameDay(parseISO(post.scheduledFor), selectedDay)
    );
  };
  
  // Handle day selection
  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day.day);
  };
  
  // Handle create form submission
  const onCreateSubmit = async (data: any) => {
    try {
      // Combine date and time
      const [hours, minutes] = data.scheduledTime.split(':').map(Number);
      const scheduledDate = new Date(data.scheduledDate);
      scheduledDate.setHours(hours, minutes);
      
      const postData = {
        userId: user?.id,
        title: data.title,
        description: data.description,
        content: data.content,
        thumbnailUrl: "https://via.placeholder.com/80",
        platforms: data.platforms,
        scheduledFor: scheduledDate.toISOString(),
        timeZone: data.timeZone,
        isOptimalTimeSelected: data.useOptimalTime,
        status: "pending"
      };
      
      await apiRequest('POST', '/api/scheduler/posts', postData);
      
      toast({
        title: "Post Scheduled",
        description: `"${data.title}" has been scheduled for ${format(scheduledDate, 'PPpp')}`
      });
      
      // Reset form and close dialog
      createForm.reset();
      setIsCreateDialogOpen(false);
      
      // Refetch scheduled posts
      queryClient.invalidateQueries({ queryKey: ["/api/scheduler/posts"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle edit form submission
  const onEditSubmit = async (data: any) => {
    try {
      // Combine date and time
      const [hours, minutes] = data.scheduledTime.split(':').map(Number);
      const scheduledDate = new Date(data.scheduledDate);
      scheduledDate.setHours(hours, minutes);
      
      const postData = {
        title: data.title,
        description: data.description,
        content: data.content,
        platforms: data.platforms,
        scheduledFor: scheduledDate.toISOString(),
        timeZone: data.timeZone,
        isOptimalTimeSelected: data.useOptimalTime,
        status: data.status
      };
      
      await apiRequest('PUT', `/api/scheduler/posts/${data.id}`, postData);
      
      toast({
        title: "Post Updated",
        description: `"${data.title}" has been updated`
      });
      
      // Reset form and close dialog
      editForm.reset();
      setIsEditDialogOpen(false);
      setEditingPost(null);
      
      // Refetch scheduled posts
      queryClient.invalidateQueries({ queryKey: ["/api/scheduler/posts"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEdit = (post: ScheduledPost) => {
    setEditingPost(post);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this scheduled post?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handlePublishNow = (id: number) => {
    if (confirm("Are you sure you want to publish this post now?")) {
      publishMutation.mutate(id);
    }
  };
  
  // Platform options
  const platformOptions = [
    { value: "tiktok", label: "TikTok", icon: <SiTiktok className="mr-2" /> }
  ];
  
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok': return <SiTiktok className="text-black" />;
      default: return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case 'published':
        return <Badge variant="outline" className="text-green-600 border-green-600">Published</Badge>;
      case 'failed':
        return <Badge variant="outline" className="text-red-600 border-red-600">Failed</Badge>;
      case 'draft':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Format the hourly best times graph
  const formatBestTimes = (hours: number[] | undefined) => {
    const allHours = Array.from({ length: 24 }, (_, i) => i);
    return allHours.map(hour => ({
      hour,
      isRecommended: hours?.includes(hour) || false
    }));
  };
  
  const bestTimesFormatted = formatBestTimes(bestTimes?.bestTimes);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">TikTok Scheduler</h1>
          <p className="text-gray-600 mt-1">Schedule and manage your TikTok content</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF0050] hover:bg-[#e0004a]">
              Schedule New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Schedule a New Post</DialogTitle>
              <DialogDescription>
                Create and schedule your TikTok content
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={createForm.control}
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
                  control={createForm.control}
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
                  control={createForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter post content" {...field} className="min-h-[100px]" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="platforms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platforms</FormLabel>
                      <div className="grid grid-cols-5 gap-2">
                        {platformOptions.map((platform) => (
                          <div key={platform.value}>
                            <Checkbox
                              checked={field.value?.includes(platform.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, platform.value]);
                                } else {
                                  field.onChange(field.value?.filter(val => val !== platform.value));
                                }
                              }}
                              id={`platform-${platform.value}`}
                              className="sr-only"
                            />
                            <label
                              htmlFor={`platform-${platform.value}`}
                              className={`flex flex-col items-center justify-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer ${
                                field.value?.includes(platform.value) ? 'border-[#FF0050] bg-pink-50' : 'border-gray-300'
                              }`}
                            >
                              <span className="text-xl mb-1">
                                {platform.icon}
                              </span>
                              <span className="text-xs text-center">{platform.label}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
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
                    control={createForm.control}
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
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
                    name="timeZone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Zone</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time zone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="useOptimalTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Use optimal time</FormLabel>
                          <FormDescription>
                            AI will optimize posting time
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator />
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#FF0050] hover:bg-[#e0004a]">
                    Schedule Post
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Edit dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Scheduled Post</DialogTitle>
              <DialogDescription>
                Update your scheduled post
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="id"
                  render={({ field }) => (
                    <input type="hidden" {...field} />
                  )}
                />
                
                <FormField
                  control={editForm.control}
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
                  control={editForm.control}
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
                  control={editForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter post content" {...field} className="min-h-[100px]" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="platforms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platforms</FormLabel>
                      <div className="grid grid-cols-5 gap-2">
                        {platformOptions.map((platform) => (
                          <div key={platform.value}>
                            <Checkbox
                              checked={field.value?.includes(platform.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, platform.value]);
                                } else {
                                  field.onChange(field.value?.filter(val => val !== platform.value));
                                }
                              }}
                              id={`edit-platform-${platform.value}`}
                              className="sr-only"
                            />
                            <label
                              htmlFor={`edit-platform-${platform.value}`}
                              className={`flex flex-col items-center justify-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer ${
                                field.value?.includes(platform.value) ? 'border-[#FF0050] bg-pink-50' : 'border-gray-300'
                              }`}
                            >
                              <span className="text-xl mb-1">
                                {platform.icon}
                              </span>
                              <span className="text-xs text-center">{platform.label}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
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
                    control={editForm.control}
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
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="timeZone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Zone</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time zone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="useOptimalTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Use optimal time</FormLabel>
                          <FormDescription>
                            AI will optimize posting time
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <Separator />
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setEditingPost(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#FF0050] hover:bg-[#e0004a]">
                    Update Post
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
        
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">
                  {format(currentMonth, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={prevMonth}
                  >
                    <RiArrowLeftSLine className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={nextMonth}
                  >
                    <RiArrowRightSLine className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
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
                    className={`p-1 min-h-[90px] text-sm rounded-md 
                      ${!day.isCurrentMonth ? 'bg-gray-50 opacity-50' : 'bg-white'} 
                      ${day.isSelected ? 'ring-2 ring-[#FF0050] bg-pink-50' : ''}
                      relative cursor-pointer hover:bg-gray-50 transition-colors`}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`flex items-center justify-center h-6 w-6 text-xs 
                        ${isToday(day.day) ? 'bg-[#FF0050] text-white rounded-full' : ''}`}>
                        {format(day.day, 'd')}
                      </span>
                      
                      {day.hasEvents && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
                          {day.events}
                        </span>
                      )}
                    </div>
                    
                    {day.hasEvents && scheduledPosts && (
                      <div className="space-y-1 mt-1">
                        {scheduledPosts
                          .filter(post => isSameDay(parseISO(post.scheduledFor), day.day))
                          .slice(0, 2)
                          .map(post => (
                            <div key={post.id} 
                              className="text-xs p-1 truncate bg-white border rounded shadow-sm"
                              title={post.title}
                            >
                              {post.platforms && post.platforms.length > 0 && (
                                <span className="mr-1 inline-block">
                                  {getPlatformIcon(post.platforms[0])}
                                </span>
                              )}
                              <span>{post.title.substring(0, 12)}{post.title.length > 12 ? '...' : ''}</span>
                            </div>
                          ))
                        }
                        {scheduledPosts.filter(post => isSameDay(parseISO(post.scheduledFor), day.day)).length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{scheduledPosts.filter(post => isSameDay(parseISO(post.scheduledFor), day.day)).length - 2} more
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
            <CardHeader className="px-6 py-4 border-b border-gray-200">
              <CardTitle className="text-lg font-semibold">
                {selectedDay ? format(selectedDay, 'MMMM d, yyyy') : 'Today'}'s Posts
              </CardTitle>
              <CardDescription>
                Manage your scheduled content for this day
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex animate-pulse">
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
                  {getSelectedDayPosts().length > 0 ? (
                    <div className="space-y-4">
                      {getSelectedDayPosts().map((post: ScheduledPost) => (
                        <Card key={post.id} className="overflow-hidden">
                          <div className="flex p-4">
                            <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              {post.thumbnailUrl ? (
                                <img src={post.thumbnailUrl} alt={post.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                                  <span className="text-gray-400 text-xs">No image</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium text-gray-900">{post.title}</h3>
                                {getStatusBadge(post.status)}
                              </div>
                              
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {post.description || 'No description'}
                              </p>
                              
                              <div className="flex items-center mt-3 justify-between">
                                <div className="flex items-center space-x-2">
                                  <RiTimeLine className="text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {format(parseISO(post.scheduledFor), 'h:mm a')} {post.timeZone}
                                  </span>
                                  
                                  <div className="flex space-x-1 ml-3">
                                    {post.platforms && post.platforms.map((platform: string) => (
                                      <span key={platform} className="text-base">
                                        {getPlatformIcon(platform)}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleEdit(post)}
                                  >
                                    <RiPencilLine className="mr-1" /> Edit
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleDelete(post.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <RiDeleteBinLine className="mr-1" /> Delete
                                  </Button>
                                  {post.status === 'pending' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handlePublishNow(post.id)}
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <RiShareLine className="mr-1" /> Publish Now
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-500 mb-4">No posts scheduled for this day</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCreateDialogOpen(true)}
                      >
                        Schedule a Post
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
            <CardHeader>
              <CardTitle>All Scheduled Posts</CardTitle>
              <CardDescription>View and manage all your upcoming posts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex animate-pulse">
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
                    <div className="space-y-4">
                      {scheduledPosts.map((post: ScheduledPost) => (
                        <Card key={post.id} className="overflow-hidden">
                          <div className="flex p-4">
                            <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              {post.thumbnailUrl ? (
                                <img src={post.thumbnailUrl} alt={post.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                                  <span className="text-gray-400 text-xs">No image</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium text-gray-900">{post.title}</h3>
                                {getStatusBadge(post.status)}
                              </div>
                              
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {post.description || 'No description'}
                              </p>
                              
                              <div className="flex items-center mt-3 justify-between">
                                <div className="flex items-center space-x-2">
                                  <RiCalendarLine className="text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {format(parseISO(post.scheduledFor), 'MMM d, yyyy')}
                                  </span>
                                  
                                  <RiTimeLine className="text-gray-400 ml-2" />
                                  <span className="text-xs text-gray-500">
                                    {format(parseISO(post.scheduledFor), 'h:mm a')}
                                  </span>
                                  
                                  <div className="flex space-x-1 ml-3">
                                    {post.platforms && post.platforms.map((platform: string) => (
                                      <span key={platform} className="text-base">
                                        {getPlatformIcon(platform)}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleEdit(post)}
                                  >
                                    <RiPencilLine className="mr-1" /> Edit
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleDelete(post.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <RiDeleteBinLine className="mr-1" /> Delete
                                  </Button>
                                  {post.status === 'pending' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handlePublishNow(post.id)}
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <RiShareLine className="mr-1" /> Publish Now
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-500 mb-4">No scheduled posts found</p>
                      <Button 
                        onClick={() => setIsCreateDialogOpen(true)}
                      >
                        Schedule Your First Post
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Best Times to Post</CardTitle>
                <CardDescription>AI-recommended posting times for maximum engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  {platformOptions.map(platform => (
                    <Button
                      key={platform.value}
                      variant={selectedPlatform === platform.value ? "default" : "outline"}
                      className={selectedPlatform === platform.value ? "bg-[#FF0050] hover:bg-[#e0004a]" : ""}
                      onClick={() => setSelectedPlatform(platform.value)}
                    >
                      <span className="mr-2">{platform.icon}</span>
                      {platform.label}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-6">
                  <div className="grid grid-cols-24 gap-1">
                    {bestTimesFormatted.map(timeSlot => (
                      <div 
                        key={timeSlot.hour}
                        className={`h-16 rounded-md flex items-center justify-center transition-colors ${
                          timeSlot.isRecommended 
                            ? 'bg-[#FF0050] bg-opacity-20 border border-[#FF0050]' 
                            : 'bg-gray-100'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`text-sm font-medium ${timeSlot.isRecommended ? 'text-[#FF0050]' : 'text-gray-700'}`}>
                            {timeSlot.hour % 12 === 0 ? 12 : timeSlot.hour % 12}
                          </div>
                          <div className="text-xs text-gray-500">
                            {timeSlot.hour < 12 ? 'AM' : 'PM'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>12 AM</span>
                    <span>6 AM</span>
                    <span>12 PM</span>
                    <span>6 PM</span>
                    <span>11 PM</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Optimal Times for {platformOptions.find(p => p.value === selectedPlatform)?.label}</h3>
                  <p className="text-sm text-gray-600">
                    Based on your audience demographics and activity patterns, we recommend posting at the highlighted times for maximum engagement on {platformOptions.find(p => p.value === selectedPlatform)?.label}.
                  </p>
                  
                  {bestTimes?.bestTimes && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {bestTimes.bestTimes.map(hour => (
                        <Badge key={hour} variant="outline" className="bg-pink-50 border-[#FF0050] text-[#FF0050]">
                          {hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? ' AM' : ' PM'}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="w-full bg-[#FF0050] hover:bg-[#e0004a]"
                >
                  Schedule at Optimal Time
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Scheduling Tips</CardTitle>
                <CardDescription>AI-powered insights for content scheduling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Consistency is Key</h3>
                  <p className="text-sm text-gray-600">Post regularly at consistent times to build a reliable audience expectation.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Platform Differences</h3>
                  <p className="text-sm text-gray-600">Each platform has unique optimal posting times. TikTok engagement peaks in the evening, while Instagram sees higher morning activity.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Content Batching</h3>
                  <p className="text-sm text-gray-600">Create and schedule content in batches to maintain consistent quality and reduce stress.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Test and Adjust</h3>
                  <p className="text-sm text-gray-600">Experiment with different posting times and track engagement to refine your schedule.</p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex-col items-start">
                <h3 className="font-medium text-gray-900 mb-2">Your Audience Peak Times</h3>
                <div className="w-full bg-gray-100 h-12 rounded-md relative mb-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="h-full w-1 bg-[#FF0050] absolute" style={{ left: '33%' }}></div>
                    <div className="h-full w-1 bg-[#FF0050] absolute" style={{ left: '58%' }}></div>
                    <div className="h-full w-1 bg-[#FF0050] absolute" style={{ left: '75%' }}></div>
                  </div>
                  <div className="absolute inset-0 flex justify-between text-xs text-gray-500 px-2 items-center">
                    <span>12am</span>
                    <span>6am</span>
                    <span>12pm</span>
                    <span>6pm</span>
                    <span>12am</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  The markers indicate when your audience is most active
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Scheduler;