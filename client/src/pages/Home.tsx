import { useState } from "react";
import { InputSection } from "@/components/InputSection";
import { OutlinePreview } from "@/components/OutlinePreview";
import { OutlineContent } from "@shared/schema";

export default function Home() {
  const [outline, setOutline] = useState<OutlineContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleOutlineGenerated = (newOutline: OutlineContent) => {
    setIsGenerating(false);
    setOutline(newOutline);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* App Introduction */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Intelligent Blog Outline Generator</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Create professional blog outlines based on your sample templates. 
          Input your topic, upload a sample, and get a perfectly structured outline in seconds.
        </p>
      </div>
      
      {/* Main App UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <InputSection 
          onOutlineGenerated={handleOutlineGenerated} 
        />
        <OutlinePreview 
          outline={outline}
          isLoading={isGenerating}
        />
      </div>
    </div>
  );
}
