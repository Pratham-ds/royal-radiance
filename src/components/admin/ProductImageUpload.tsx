import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProductImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

const ProductImageUpload = ({ imageUrl, onImageChange }: ProductImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 5MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      onImageChange(urlData.publicUrl);
      toast({ title: "Image uploaded successfully" });
    } catch (err: any) {
      console.error("Upload error:", err);
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="md:col-span-2">
      <label className="text-xs text-muted-foreground uppercase tracking-wider">Product Image</label>
      <div className="mt-1 flex items-start gap-4">
        {imageUrl ? (
          <div className="relative group">
            <img
              src={imageUrl}
              alt="Product preview"
              className="w-24 h-24 rounded-sm object-cover border border-border/50"
            />
            <button
              type="button"
              onClick={() => onImageChange("")}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : null}

        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full bg-muted/50 border border-dashed border-border/50 rounded-sm px-4 py-6 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors flex flex-col items-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Click to upload image</span>
                <span className="text-xs">PNG, JPG up to 5MB</span>
              </>
            )}
          </button>
          <input
            value={imageUrl}
            onChange={(e) => onImageChange(e.target.value)}
            placeholder="Or paste image URL here..."
            className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2 text-sm text-foreground mt-2 focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductImageUpload;
