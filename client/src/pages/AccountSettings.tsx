import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useOnboarding } from "@/hooks/use-onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Check, AlertCircle, Trash2, RefreshCw, Award, HelpCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { BadgesDisplay } from "@/components/onboarding/BadgesDisplay";

// OnboardingPreferences Component
function OnboardingPreferences() {
  const { startOnboarding, progress, steps } = useOnboarding();
  const { toast } = useToast();
  
  // Calculate completion percentage
  const totalSteps = steps.length - 1; // Exclude the "completed" step
  const completedSteps = progress.completedSteps.length;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);
  
  const handleRestartTutorial = () => {
    startOnboarding();
    toast({
      title: "Tutorial Restarted",
      description: "The platform tutorial has been restarted. Follow the prompts to continue.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-[#FF0050]" />
              Platform Tutorial
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Learn about the platform's features through an interactive tutorial
            </p>
          </div>
          
          <Button 
            onClick={handleRestartTutorial}
            className="bg-[#FF0050] hover:bg-[#CC0040] text-white"
          >
            Restart Tutorial
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Tutorial Progress</span>
            <span>{completionPercentage}% Complete</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
        
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-4 flex items-center">
            <Award className="h-4 w-4 mr-2 text-yellow-500" />
            Your Achievements
          </h4>
          <BadgesDisplay />
        </div>
      </div>
    </div>
  );
}

// TikTok Connection Component
function TikTokConnection({ userId }: { userId: number }) {
  const { toast } = useToast();
  const [importingVideos, setImportingVideos] = useState(false);
  
  // Fetch TikTok connection status
  const { data: connectionStatus, isLoading, refetch } = useQuery({
    queryKey: ['/api/tiktok/connection-status'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/tiktok/connection-status');
      return res.json();
    }
  });
  
  // Get TikTok auth URL
  const getAuthUrlMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('GET', '/api/tiktok/auth-url');
      return res.json();
    },
    onSuccess: (data) => {
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to get TikTok authentication URL. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Disconnect TikTok account
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/tiktok/disconnect');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "TikTok Disconnected",
        description: "Your TikTok account has been disconnected successfully.",
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to disconnect TikTok account. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Import videos from TikTok
  const importVideosMutation = useMutation({
    mutationFn: async () => {
      setImportingVideos(true);
      try {
        const res = await apiRequest('POST', '/api/tiktok/import-videos', { limit: 10 });
        return res.json();
      } finally {
        setImportingVideos(false);
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Videos Imported",
        description: `Successfully imported ${data.count} videos from TikTok.`,
      });
    },
    onError: (error: any) => {
      const requiresAuth = error.response?.data?.requiresAuth;
      
      if (requiresAuth) {
        toast({
          title: "Authentication Required",
          description: "Your TikTok connection has expired. Please reconnect your account.",
          variant: "destructive",
        });
        
        // Automatically initiate reconnection
        getAuthUrlMutation.mutate();
      } else {
        toast({
          title: "Import Failed",
          description: "Failed to import videos from TikTok. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
  
  const handleConnect = () => {
    getAuthUrlMutation.mutate();
  };
  
  const handleDisconnect = () => {
    disconnectMutation.mutate();
  };
  
  const handleImportVideos = () => {
    importVideosMutation.mutate();
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-6 h-6 mr-2 text-[#FF0050]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.321 5.562a5.825 5.825 0 0 1-.577-.317 5.526 5.526 0 0 1-2.715-4.75h-3.127v16.573c0 .85-.345 1.621-.903 2.181-.584.585-1.396.947-2.291.947-1.788 0-3.236-1.448-3.236-3.236 0-1.788 1.448-3.236 3.236-3.236.249 0 .491.028.724.082V9.91a7.208 7.208 0 0 0-.724-.037c-3.997 0-7.231 3.233-7.231 7.231 0 3.998 3.234 7.229 7.231 7.229 3.998 0 7.229-3.231 7.229-7.229l.027-11.178a9.228 9.228 0 0 0 5.386 1.7V3.58a5.574 5.574 0 0 1-3.029-1.031V5.562z" />
            </svg>
            TikTok Integration
          </CardTitle>
          <CardDescription>Connect your TikTok account to import your content</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF0050]" />
        </CardContent>
      </Card>
    );
  }
  
  const isConnected = connectionStatus?.connected;
  const profile = connectionStatus?.profile;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <svg className="w-6 h-6 mr-2 text-[#FF0050]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.321 5.562a5.825 5.825 0 0 1-.577-.317 5.526 5.526 0 0 1-2.715-4.75h-3.127v16.573c0 .85-.345 1.621-.903 2.181-.584.585-1.396.947-2.291.947-1.788 0-3.236-1.448-3.236-3.236 0-1.788 1.448-3.236 3.236-3.236.249 0 .491.028.724.082V9.91a7.208 7.208 0 0 0-.724-.037c-3.997 0-7.231 3.233-7.231 7.231 0 3.998 3.234 7.229 7.231 7.229 3.998 0 7.229-3.231 7.229-7.229l.027-11.178a9.228 9.228 0 0 0 5.386 1.7V3.58a5.574 5.574 0 0 1-3.029-1.031V5.562z" />
          </svg>
          TikTok Integration
          {isConnected && (
            <Badge variant="success" className="ml-2 bg-green-500">
              Connected
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {isConnected 
            ? "Your TikTok account is connected" 
            : "Connect your TikTok account to import your content"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            {profile && (
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-md">
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.displayName} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{profile.displayName}</h3>
                  <p className="text-sm text-gray-500">
                    {profile.followerCount.toLocaleString()} followers • {profile.videoCount.toLocaleString()} videos
                  </p>
                  <a 
                    href={profile.profileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            )}
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Import Your TikTok Videos</AlertTitle>
              <AlertDescription>
                Import your existing TikTok videos into the platform to analyze their performance and create new content based on what works.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connect your TikTok account</AlertTitle>
            <AlertDescription>
              Connecting your TikTok account enables automatic content importing, scheduling posts, 
              and viewing analytics all in one place.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        {isConnected ? (
          <>
            <Button 
              variant="outline" 
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={handleDisconnect}
              disabled={disconnectMutation.isPending}
            >
              {disconnectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Disconnect
                </>
              )}
            </Button>
            
            <Button
              onClick={handleImportVideos}
              disabled={importingVideos}
              className="bg-[#FF0050] hover:bg-[#CC0040] text-white"
            >
              {importingVideos ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Import Videos
                </>
              )}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={getAuthUrlMutation.isPending}
            className="bg-[#FF0050] hover:bg-[#CC0040] text-white"
          >
            {getAuthUrlMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect TikTok Account"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function AccountSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [location] = useLocation();
  
  // Check if we've been redirected from TikTok OAuth
  useEffect(() => {
    if (location.includes('tiktok=connected')) {
      toast({
        title: "TikTok Connected",
        description: "Your TikTok account has been successfully connected.",
        variant: "default",
      });
    }
  }, [location, toast]);
  
  const [profileData, setProfileData] = useState({
    displayName: "",
    bio: "",
    email: "",
    tiktokHandle: "",
    profileImageUrl: "",
  });
  
  const [socialProfiles, setSocialProfiles] = useState({
    tiktok: "",
  });
  
  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "en",
    notifications: true,
  });
  
  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || "",
        bio: user.bio || "",
        email: user.email,
        tiktokHandle: user.tiktokHandle || "",
        profileImageUrl: user.profileImageUrl || "",
      });
      
      if (user.socialProfiles) {
        setSocialProfiles({
          tiktok: user.socialProfiles.tiktok || "",
        });
      }
      
      if (user.preferences) {
        setPreferences({
          theme: user.preferences.theme || "system",
          language: user.preferences.language || "en",
          notifications: user.preferences.notifications !== undefined ? user.preferences.notifications : true,
        });
      }
    }
  }, [user]);
  
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedUser: Partial<User>) => {
      const res = await apiRequest("PATCH", `/api/users/${user?.id}`, updatedUser);
      return await res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], (oldData: any) => ({
        ...oldData,
        ...updatedUser,
      }));
      
      toast({
        title: "Profile updated",
        description: "Your account settings have been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const updatedUser = {
      ...profileData,
      socialProfiles,
      preferences,
    };
    
    updateProfileMutation.mutate(updatedUser);
  };
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Please login to access account settings</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-gray-500">Manage your profile and account preferences</p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="social">TikTok Profile</TabsTrigger>
          <TabsTrigger value="connections">TikTok Connection</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleProfileSubmit}>
          <TabsContent value="profile">
            <div className="space-y-6 bg-white p-6 rounded-md shadow-sm">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tiktokHandle">TikTok Handle</Label>
                  <Input
                    id="tiktokHandle"
                    value={profileData.tiktokHandle}
                    onChange={(e) => setProfileData({ ...profileData, tiktokHandle: e.target.value })}
                    placeholder="@username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                  <Input
                    id="profileImageUrl"
                    value={profileData.profileImageUrl}
                    onChange={(e) => setProfileData({ ...profileData, profileImageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio || ""}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="social">
            <div className="space-y-6 bg-white p-6 rounded-md shadow-sm">
              <h2 className="text-xl font-semibold">TikTok Profile</h2>
              <Separator />
              
              <div className="grid grid-cols-1 gap-6 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok Username</Label>
                  <Input
                    id="tiktok"
                    value={socialProfiles.tiktok}
                    onChange={(e) => setSocialProfiles({ ...socialProfiles, tiktok: e.target.value })}
                    placeholder="@username"
                  />
                  <p className="text-sm text-gray-500">Enter your TikTok username to connect your content with analytics.</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="connections">
            <div className="space-y-6 bg-white p-6 rounded-md shadow-sm">
              <h2 className="text-xl font-semibold">TikTok Connection</h2>
              <Separator />
              
              <div className="space-y-6">
                {/* TikTok Connection Card */}
                <TikTokConnection userId={user.id} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences">
            <div className="space-y-6 bg-white p-6 rounded-md shadow-sm">
              <h2 className="text-xl font-semibold">Account Preferences</h2>
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <select
                    id="theme"
                    value={preferences.theme}
                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={preferences.notifications}
                      onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
                      className="form-checkbox h-4 w-4 text-[#FF0050]"
                    />
                    <span>Enable notifications</span>
                  </Label>
                </div>
              </div>
              
              <div className="pt-6 mt-6 border-t">
                <h3 className="text-lg font-medium mb-4">TikTok Creator Onboarding</h3>
                <div className="space-y-4">
                  <OnboardingPreferences />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <div className="mt-6 flex justify-end">
            <Button 
              type="submit" 
              disabled={updateProfileMutation.isPending}
              className="bg-[#FF0050] hover:bg-[#CC0040] text-white"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}