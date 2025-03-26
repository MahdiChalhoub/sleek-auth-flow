
import React from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';

interface UploadButtonProps {
  endpoint: string;
  onClientUploadComplete?: (res: any[]) => void;
  onUploadError?: (error: Error) => void;
}

// Temporary implementation until the real uploadthing integration
export const UploadButton: React.FC<UploadButtonProps> = ({ 
  endpoint, 
  onClientUploadComplete, 
  onUploadError 
}) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // In a real implementation, this would upload to uploadthing
      // For now, we'll mock a successful upload
      const mockRes = [{
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        key: Math.random().toString(36).substring(2)
      }];
      
      if (onClientUploadComplete) {
        onClientUploadComplete(mockRes);
      }
    } catch (error) {
      if (onUploadError) {
        onUploadError(error as Error);
      }
    }
  };

  return (
    <div>
      <input 
        type="file" 
        id="file-upload" 
        className="sr-only"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button type="button" variant="outline" asChild>
          <span>
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload Image
          </span>
        </Button>
      </label>
    </div>
  );
};
