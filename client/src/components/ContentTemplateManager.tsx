import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ContentAPI } from '@/lib/api-client';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ContentTemplate } from '@shared/schema';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, FileDown, Edit, Copy, Star, Filter, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialog } from '@/components/ui/alert-dialog';
import { OptimizedImage } from '@/components/ui/optimized-image';

// Validation schema for creating/editing templates
const templateFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }).max(100),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }).max(500),
  category: z.string().min(1, { message: 'Please select a category' }),
  structure: z.string().min(20, { message: 'Template structure must be detailed' }),
  exampleContent: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

interface ContentTemplateManagerProps {
  onSelectTemplate?: (template: ContentTemplate) => void;
  showCreateOption?: boolean;
  selectedTemplateId?: number | null;
}

export function ContentTemplateManager({ 
  onSelectTemplate, 
  showCreateOption = true,
  selectedTemplateId = null
}: ContentTemplateManagerProps) {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<ContentTemplate | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get all templates
  const { data: templates, isLoading } = useQuery({
    queryKey: ['/api/content-templates'],
    queryFn: ContentAPI.getTemplates
  });

  // Form for creating/editing templates
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      structure: '',
      exampleContent: '',
      tags: '',
    },
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: (data: Omit<ContentTemplate, 'id'>) => {
      return ContentAPI.createTemplate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-templates'] });
      toast({
        title: 'Template created successfully',
        description: 'Your new content template is now available',
      });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Failed to create template',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Edit template mutation
  const editTemplateMutation = useMutation({
    mutationFn: (data: { id: number, data: Partial<ContentTemplate> }) => {
      return ContentAPI.updateTemplate(data.id, data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-templates'] });
      toast({
        title: 'Template updated successfully',
        description: 'Your content template has been updated',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to update template',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: (id: number) => {
      return ContentAPI.deleteTemplate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-templates'] });
      toast({
        title: 'Template deleted successfully',
        description: 'The content template has been removed',
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete template',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle form submission for creating templates
  const onCreateSubmit = (values: TemplateFormValues) => {
    const templateData = {
      ...values,
      // Adding empty fields if they are not present
      exampleContent: values.exampleContent || '',
      tags: values.tags || ''
    };
    createTemplateMutation.mutate(templateData as Omit<ContentTemplate, 'id'>);
  };

  // Handle form submission for editing templates
  const onEditSubmit = (values: TemplateFormValues) => {
    if (!currentTemplate) return;
    
    editTemplateMutation.mutate({
      id: currentTemplate.id,
      data: {
        ...values,
        // Adding empty fields if they are not present
        exampleContent: values.exampleContent || '',
        tags: values.tags || ''
      }
    });
  };

  // Start editing a template
  const handleEditTemplate = (template: ContentTemplate) => {
    setCurrentTemplate(template);
    form.reset({
      title: template.title,
      description: template.description,
      category: template.category,
      structure: template.structure,
      exampleContent: template.exampleContent || undefined,
      tags: template.tags || undefined,
    });
    setIsEditDialogOpen(true);
  };

  // Start deleting a template
  const handleDeleteTemplate = (template: ContentTemplate) => {
    setCurrentTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  // Confirm template deletion
  const confirmDeleteTemplate = () => {
    if (currentTemplate) {
      deleteTemplateMutation.mutate(currentTemplate.id);
    }
  };

  // Extract unique categories from templates
  const categories = templates 
    ? Array.from(new Set(templates.map(t => t.category)))
    : [];

  // Filter templates by category and search query
  const filteredTemplates = templates
    ? templates.filter(template => {
        const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
        const matchesSearch = 
          searchQuery === '' || 
          template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (template.tags && template.tags.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return matchesCategory && matchesSearch;
      })
    : [];

  // Select a template to use
  const handleSelectTemplate = (template: ContentTemplate) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <Select 
              value={activeCategory} 
              onValueChange={setActiveCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {showCreateOption && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create a New Content Template</DialogTitle>
                  <DialogDescription>
                    Design a template to streamline your content creation process.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template Name</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., Before vs After Transformation" {...field} />
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
                              placeholder="Briefly describe what this template is for..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Educational">Educational</SelectItem>
                                <SelectItem value="Entertainment">Entertainment</SelectItem>
                                <SelectItem value="Tutorial">Tutorial</SelectItem>
                                <SelectItem value="Storytelling">Storytelling</SelectItem>
                                <SelectItem value="Reaction">Reaction</SelectItem>
                                <SelectItem value="Product Review">Product Review</SelectItem>
                                <SelectItem value="Day in the Life">Day in the Life</SelectItem>
                                <SelectItem value="Challenge">Challenge</SelectItem>
                                <SelectItem value="Trend">Trend</SelectItem>
                              </SelectContent>
                            </Select>
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
                              placeholder="Describe the structure of the content (e.g., Intro - 5s, Main Content - 20s, Call to Action - 5s)" 
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
                      name="exampleContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Example Content (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Provide an example of content using this template..."
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
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Separate tags with commas (e.g., viral, transformation, before-after)" 
                              {...field} 
                            />
                          </FormControl>
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
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : 'Create Template'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No templates found. {showCreateOption && 'Create your first template!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id}
              className={`overflow-hidden transition-all hover:shadow-md ${
                selectedTemplateId === template.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Structure</Label>
                    <div className="text-sm border rounded-md p-2 bg-muted/20 h-24 overflow-y-auto">
                      {template.structure}
                    </div>
                  </div>
                  
                  {template.tags && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {template.tags.split(',').map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <FileDown className="h-4 w-4 mr-1" /> Use Template
                </Button>
                
                <div className="flex gap-2">
                  {showCreateOption && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteTemplate(template)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Content Template</DialogTitle>
            <DialogDescription>
              Update your template to improve your content creation process.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Educational">Educational</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Tutorial">Tutorial</SelectItem>
                          <SelectItem value="Storytelling">Storytelling</SelectItem>
                          <SelectItem value="Reaction">Reaction</SelectItem>
                          <SelectItem value="Product Review">Product Review</SelectItem>
                          <SelectItem value="Day in the Life">Day in the Life</SelectItem>
                          <SelectItem value="Challenge">Challenge</SelectItem>
                          <SelectItem value="Trend">Trend</SelectItem>
                        </SelectContent>
                      </Select>
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
                name="exampleContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Example Content (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
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
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={editTemplateMutation.isPending}
                >
                  {editTemplateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : 'Update Template'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{currentTemplate?.title}" template. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTemplate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteTemplateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : 'Delete Template'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Export as default for backwards compatibility
export default ContentTemplateManager;