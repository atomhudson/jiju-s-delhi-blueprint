import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
    onUpload: (urls: string[]) => void;
    maxFiles?: number;
    bucketName?: string;
    folderPath?: string;
}

export function MultiImageUpload({
    onUpload,
    maxFiles = 10,
    bucketName = "project-images",
    folderPath = ""
}: ImageUploadProps) {
    const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newPreviews = files.slice(0, maxFiles - previews.length).map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setPreviews(prev => [...prev, ...newPreviews].slice(0, maxFiles));
    }, [previews.length, maxFiles]);

    const removePreview = (index: number) => {
        setPreviews(prev => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index].preview);
            newPreviews.splice(index, 1);
            return newPreviews;
        });
    };

    const handleUpload = async () => {
        if (previews.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);
        const uploadedUrls: string[] = [];

        try {
            for (let i = 0; i < previews.length; i++) {
                const { file } = previews[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

                const { data, error } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) throw error;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(data.path);

                uploadedUrls.push(publicUrl);
                setUploadProgress(((i + 1) / previews.length) * 100);
            }

            onUpload(uploadedUrls);
            toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);

            // Clear previews
            previews.forEach(p => URL.revokeObjectURL(p.preview));
            setPreviews([]);
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "Failed to upload images");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));

        const newPreviews = files.slice(0, maxFiles - previews.length).map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setPreviews(prev => [...prev, ...newPreviews].slice(0, maxFiles));
    }, [previews.length, maxFiles]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-accent/50 hover:bg-secondary/30 transition-all"
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm font-medium">Drop images here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Upload up to {maxFiles} images at once (PNG, JPG, WebP)
                </p>
            </div>

            {/* Preview Grid */}
            {previews.length > 0 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-secondary">
                                <img
                                    src={preview.preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removePreview(index); }}
                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    {isUploading && (
                        <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 bg-accent transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}

                    {/* Upload Button */}
                    <Button
                        type="button"
                        onClick={handleUpload}
                        disabled={isUploading || previews.length === 0}
                        className="w-full"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading... {Math.round(uploadProgress)}%
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload {previews.length} Image{previews.length > 1 ? 's' : ''}
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
