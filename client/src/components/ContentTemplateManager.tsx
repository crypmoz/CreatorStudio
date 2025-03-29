import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ContentTemplate } from '@shared/schema';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  FileText, 
  Edit, 
  Trash, 
  CheckCircle2,
  AlertCircle,
  RotateCw
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form schema for creating a template
const templateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  thumbnailUrl: z.string().optional(),
  structure: z.string().min(10, "Structure must be at least 10 characters"),
  isNew: z.boolean().optional(),
  popularity: z.enum(["low", "normal", "high", "trending"]).optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface ContentTemplateManagerProps {
  onSelectTemplate?: (template: ContentTemplate) => void;
}

export function ContentTemplateManager({ onSelectTemplate }: ContentTemplateManagerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all templates
  const { 
    data: templates, 
    isLoading: templatesLoading, 
    error: templatesError 
  } = useQuery({
    queryKey: ['/api/content-templates'],
    queryFn: async () => {
      const response = await fetch('/api/content-templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      return await response.json();
    },
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (data: TemplateFormValues) => {
      const response = await apiRequest('POST', '/api/content-templates', data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create template');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-templates'] });
      setIsCreateDialogOpen(false);
      toast({
        title: 'Template Created',
        description: 'New content template has been created successfully',
        variant: 'default',
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Create Template',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Form setup for template creation
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: '',
      description: '',
      thumbnailUrl: '',
      structure: '',
      isNew: true,
      popularity: 'normal',
    },
  });

  // Handle template selection
  const handleSelectTemplate = (template: ContentTemplate) => {
    setSelectedTemplate(template);
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  // Handle form submission
  const onSubmit = (data: TemplateFormValues) => {
    createTemplateMutation.mutate(data);
  };

  // Filter templates by category
  const filteredTemplates = templates?.filter((template: ContentTemplate) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'new') return template.isNew;
    if (activeCategory === 'trending') return template.popularity === 'trending';
    return false;
  });

  // Get popular templates (for quick access)
  const popularTemplates = templates?.filter((template: ContentTemplate) => 
    template.popularity === 'high' || template.popularity === 'trending'
  ).slice(0, 3);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Content Template</DialogTitle>
                <DialogDescription>
                  Create a reusable template for your TikTok content
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Before and After Transformation" {...field} />
                        </FormControl>
                        <FormMessage />
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
                          <Textarea 
                            placeholder="Describe what this template is for and when to use it"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="structure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Structure</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Outline the structure of this template (e.g., 0:00-0:10 Hook, 0:10-0:30 Before footage, etc.)"
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Define the timing, sections, and content flow
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createTemplateMutation.isPending}
                    >
                      {createTemplateMutation.isPending ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Template'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <TabsContent value="all" className="mt-0">
          {templatesLoading ? (
            <div className="text-center py-8">
              <RotateCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Loading templates...</p>
            </div>
          ) : templatesError ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
              <p className="mt-2 text-muted-foreground">Failed to load templates</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredTemplates?.length > 0 ? (
                filteredTemplates.map((template: ContentTemplate) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate?.id === template.id}
                    onSelect={handleSelectTemplate}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No templates found in this category</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Template
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="new">
          {/* New templates content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredTemplates?.length > 0 ? (
              filteredTemplates.map((template: ContentTemplate) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate?.id === template.id}
                  onSelect={handleSelectTemplate}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No new templates found</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="trending">
          {/* Trending templates content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredTemplates?.length > 0 ? (
              filteredTemplates.map((template: ContentTemplate) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate?.id === template.id}
                  onSelect={handleSelectTemplate}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No trending templates found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Quick-access popular templates */}
      {popularTemplates && popularTemplates.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Popular Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularTemplates.map((template: ContentTemplate) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate?.id === template.id}
                onSelect={handleSelectTemplate}
                compact
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface TemplateCardProps {
  template: ContentTemplate;
  isSelected?: boolean;
  onSelect: (template: ContentTemplate) => void;
  compact?: boolean;
}

function TemplateCard({ template, isSelected, onSelect, compact = false }: TemplateCardProps) {
  return (
    <Card 
      className={`overflow-hidden ${isSelected ? 'border-primary' : 'border-border'} transition-all hover:shadow-md`}
    >
      <CardHeader className={compact ? "pb-2" : ""}>
        <div className="flex justify-between items-start">
          <CardTitle className={`${compact ? 'text-lg' : 'text-xl'}`}>
            {template.title}
          </CardTitle>
          {template.isNew && (
            <Badge variant="secondary">New</Badge>
          )}
        </div>
        {!compact && (
          <CardDescription>
            {template.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={compact ? "pb-3" : ""}>
        {!compact && <p className="text-sm text-muted-foreground mb-4">{template.description}</p>}
        {compact && <p className="text-sm text-muted-foreground mb-3">{template.description.substring(0, 60)}...</p>}
      </CardContent>
      <CardFooter className="bg-muted/40 pt-2">
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => onSelect(template)}
        >
          {isSelected ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Selected
            </>
          ) : (
            'Use Template'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}