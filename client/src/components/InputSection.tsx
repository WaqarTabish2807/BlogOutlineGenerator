import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { OutlineContent } from "@shared/schema";

interface InputSectionProps {
  onOutlineGenerated: (outline: OutlineContent) => void;
}

export function InputSection({ onOutlineGenerated }: InputSectionProps) {
  const [topic, setTopic] = useState("");
  const [fileId, setFileId] = useState<number>(0);
  
  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/generate-outline", { topic });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      onOutlineGenerated(data.content);
      toast({
        title: "Outline generated successfully",
        description: "Your outline is ready to view.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to generate outline",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });
  
  const handleGenerateOutline = () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a blog topic",
        variant: "destructive",
      });
      return;
    }
    
    if (!fileId) {
      toast({
        title: "Sample outline required",
        description: "Please upload a sample outline document",
        variant: "destructive",
      });
      return;
    }
    
    generateMutation.mutate();
  };
  
  const handleFileUploaded = (id: number, name: string) => {
    setFileId(id);
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Topic Input */}
      <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-md bg-white/25 dark:bg-gray-800/25 backdrop-blur-sm">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 p-1.5 rounded-md mr-3">
              <i className="fas fa-heading text-sm"></i>
            </span>
            Blog Topic
          </h3>
          
          <div className="space-y-3">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              What would you like to write about?
            </label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              placeholder="e.g. 10 Tips for Effective Time Management"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Sample Upload */}
      <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-md bg-white/25 dark:bg-gray-800/25 backdrop-blur-sm">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="bg-secondary-100 dark:bg-secondary-900/50 text-secondary-600 dark:text-secondary-300 p-1.5 rounded-md mr-3">
              <i className="fas fa-file-upload text-sm"></i>
            </span>
            Sample Outline
          </h3>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload a sample outline document that we'll use as a template.
            </p>
            
            <FileUpload onChange={handleFileUploaded} />
          </div>
        </CardContent>
      </Card>
      
      {/* Generate Button */}
      <Button
        onClick={handleGenerateOutline}
        disabled={generateMutation.isPending}
        className="w-full py-6 bg-gradient-to-r from-primary to-secondary hover:shadow-glow transition-all transform hover:-translate-y-0.5"
      >
        {generateMutation.isPending ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Generating...
          </>
        ) : (
          <>
            <i className="fas fa-magic mr-2"></i>
            Generate Outline
          </>
        )}
      </Button>
    </div>
  );
}
