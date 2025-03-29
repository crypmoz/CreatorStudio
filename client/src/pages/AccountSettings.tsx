import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";

export default function AccountSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    displayName: "",
    bio: "",
    email: "",
    tiktokHandle: "",
    profileImageUrl: "",
  });
  
  const [socialProfiles, setSocialProfiles] = useState({
    instagram: "",
    youtube: "",
    twitter: "",
    facebook: "",
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
          instagram: user.socialProfiles.instagram || "",
          youtube: user.socialProfiles.youtube || "",
          twitter: user.socialProfiles.twitter || "",
          facebook: user.socialProfiles.facebook || "",
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
          <TabsTrigger value="social">Social Profiles</TabsTrigger>
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
              <h2 className="text-xl font-semibold">Social Media Profiles</h2>
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={socialProfiles.instagram}
                    onChange={(e) => setSocialProfiles({ ...socialProfiles, instagram: e.target.value })}
                    placeholder="@username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={socialProfiles.youtube}
                    onChange={(e) => setSocialProfiles({ ...socialProfiles, youtube: e.target.value })}
                    placeholder="channel name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={socialProfiles.twitter}
                    onChange={(e) => setSocialProfiles({ ...socialProfiles, twitter: e.target.value })}
                    placeholder="@username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={socialProfiles.facebook}
                    onChange={(e) => setSocialProfiles({ ...socialProfiles, facebook: e.target.value })}
                    placeholder="username or page name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    value={socialProfiles.tiktok}
                    onChange={(e) => setSocialProfiles({ ...socialProfiles, tiktok: e.target.value })}
                    placeholder="@username"
                  />
                </div>
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