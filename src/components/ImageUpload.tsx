import { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const ImageUpload = ({ value, onChange, placeholder, aspectRatio = "16:9" }) => {
  const [isPreview, setIsPreview] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input 
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsPreview(!!e.target.value);
            setImageError(false);
          }}
          placeholder={placeholder}
          className="pr-10"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Upload className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      
      {isPreview && value && (
        <div className="relative">
          <img 
            src={value} 
            alt="Preview" 
            className={cn(
              "w-full rounded-lg border border-border object-cover",
              aspectRatio === "16:9" ? "aspect-video" : "aspect-[2/3]"
            )}
            onError={() => {
              setImageError(true);
            }}
            onLoad={() => {
              setImageError(false);
            }}
          />
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center text-muted-foreground">
                <ImageIcon className="w-8 h-8 mb-2" />
                <p className="text-sm">Image failed to load</p>
                <p className="text-xs">Please check the URL</p>
              </div>
            </div>
          )}
          {!imageError && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {aspectRatio}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
