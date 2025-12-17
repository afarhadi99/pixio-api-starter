// src/components/dashboard/media-generation-form.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@repo/ui';
import { Textarea } from '@repo/ui';
import { Input } from '@repo/ui';
import { Label } from '@repo/ui';
import { Loader2, AlertCircle, Image as LucideImage, Film, Sparkles, Upload, X } from 'lucide-react';
import { generateMedia } from '@/lib/actions/media.actions';
import { toast } from 'sonner';
import Image from 'next/image';
import { MediaType, MediaStatus, GenerationMode, CREDIT_COSTS } from '@/lib/constants/media';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageSelectorPopover } from './image-selector-popover';
import imageCompression from 'browser-image-compression';
// Import Supabase client
import { createClient } from '@repo/supabase/client';
import { v4 as uuidv4 } from 'uuid'; // For unique filenames

interface MediaGenerationFormProps {
  generationMode: GenerationMode;
  creditCost: number;
  userCredits: number;
  onGenerationStart?: (mediaId: string) => void;
}

// Import Pixio models for proper handling
import { PIXIO_MODELS } from '@repo/pixio-api';

// Helper function for direct Supabase upload
async function uploadDirectlyToSupabase(
    file: File,
    userId: string,
    type: 'start' | 'end' | 'image1'
): Promise<{ success: boolean; url?: string; error?: string }> {
    if (!file || !userId) {
        return { success: false, error: 'User ID and file are required.' };
    }

    const supabase = createClient(); // Initialize Supabase client

    try {
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'bin';
        // Use UUID for more robust uniqueness
        const fileName = `${type}-${uuidv4()}.${fileExtension}`;
        const storagePath = `${userId}/inputs/${fileName}`; // Store in user-specific inputs folder

        console.log(`Uploading input image directly to: ${storagePath}`);
        const uploadToastId = toast.info(`Uploading ${type} image...`, { duration: 60000 }); // Show toast with longer duration

        const { data, error: uploadError } = await supabase.storage
            .from('generated-media') // Your bucket name
            .upload(storagePath, file, {
                cacheControl: '3600',
                upsert: false, // Don't upsert, use unique names
                contentType: file.type,
            });

        toast.dismiss(uploadToastId); // Dismiss upload toast immediately after attempt

        if (uploadError) {
            console.error(`Direct upload error (${type}):`, uploadError);
            throw new Error(`Direct upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('generated-media')
            .getPublicUrl(storagePath);

        if (!publicUrlData?.publicUrl) {
            throw new Error('Failed to get public URL for uploaded input image.');
        }

        console.log(`Direct upload success (${type}): ${publicUrlData.publicUrl}`);
        // toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded.`); // Optional success toast

        return { success: true, url: publicUrlData.publicUrl };

    } catch (error: any) {
        console.error(`Error in uploadDirectlyToSupabase (${type}):`, error);
        // toast.dismiss(); // Ensure any related toasts are dismissed
        toast.error(`Failed to upload ${type} image.`);
        return { success: false, error: error.message };
    }
}


export function MediaGenerationForm({
  generationMode,
  creditCost,
  userCredits,
  onGenerationStart
}: MediaGenerationFormProps) {
  const [prompt, setPrompt] = useState('');
  const [startImageFile, setStartImageFile] = useState<File | null>(null);
  const [endImageFile, setEndImageFile] = useState<File | null>(null);
  const [startImageUrl, setStartImageUrl] = useState<string | null>(null);
  const [endImageUrl, setEndImageUrl] = useState<string | null>(null);
  const [startImagePreview, setStartImagePreview] = useState<string | null>(null);
  const [endImagePreview, setEndImagePreview] = useState<string | null>(null);
  
  // Qwen Edit specific states
  const [image1File, setImage1File] = useState<File | null>(null);
  const [image1Url, setImage1Url] = useState<string | null>(null);
  const [image1Preview, setImage1Preview] = useState<string | null>(null);
  const [image2File, setImage2File] = useState<File | null>(null);
  const [image2Url, setImage2Url] = useState<string | null>(null);
  const [image2Preview, setImage2Preview] = useState<string | null>(null);
  const [image3File, setImage3File] = useState<File | null>(null);
  const [image3Url, setImage3Url] = useState<string | null>(null);
  const [image3Preview, setImage3Preview] = useState<string | null>(null);
  const [positivePrompt, setPositivePrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');

  // Krea Flux specific states
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);

  // Wan 2.2 specific states
  const [videoWidth, setVideoWidth] = useState(512);
  const [videoHeight, setVideoHeight] = useState(512);
  const [videoLength, setVideoLength] = useState(81);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMediaId, setCurrentMediaId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewStatus, setPreviewStatus] = useState<MediaStatus | 'idle'>('idle');
  const startFileInputRef = useRef<HTMLInputElement>(null);
  const endFileInputRef = useRef<HTMLInputElement>(null);
  const image1FileInputRef = useRef<HTMLInputElement>(null);
  const image2FileInputRef = useRef<HTMLInputElement>(null);
  const image3FileInputRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient(); // Initialize client for user ID and Realtime

  // Get user ID on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      if (!user) console.warn("MediaGenerationForm: User not found on mount.");
    };
    getUser();
  }, [supabase]);

  // Determine actual media type based on model category
  const getMediaType = (): MediaType => {
    if (generationMode === 'image') return 'image'; // Krea Flux → image
    if (generationMode === 'video') return 'image';  // Qwen Edit → image (it's editing, not video generation)
    if (generationMode === 'firstLastFrameVideo') return 'video'; // Wan 2.2 → video
    return 'image'; // Default
  };
  const generatedMediaType: MediaType = getMediaType();

  // Realtime subscription for media status updates
  useEffect(() => {
    if (!currentMediaId) return;

    console.log(`[MediaGenerationForm] Setting up Realtime for media: ${currentMediaId}`);
    
    const channel = supabase
      .channel(`generation-${currentMediaId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'generated_media',
          filter: `id=eq.${currentMediaId}`
        },
        (payload) => {
          console.log('[MediaGenerationForm] Realtime update:', payload);
          const updated = payload.new as any;
          
          setPreviewStatus(updated.status);

          if (updated.status === 'completed') {
            setPreviewUrl(updated.media_url);
            toast.success(`${generatedMediaType} generation complete!`);
          } else if (updated.status === 'failed') {
            const errorMsg = updated.metadata?.error || 'Generation failed';
            toast.error(`Generation failed: ${errorMsg}`);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[MediaGenerationForm] Realtime SUBSCRIBED for ${currentMediaId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[MediaGenerationForm] Realtime CHANNEL_ERROR');
          toast.error('Connection error. Please refresh if status doesn\'t update.');
        }
      });

    // Cleanup on unmount or when currentMediaId changes
    return () => {
      console.log(`[MediaGenerationForm] Unsubscribing from Realtime for ${currentMediaId}`);
      supabase.removeChannel(channel);
    };
  }, [currentMediaId, supabase, generatedMediaType]);

  // --- Image Handling ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end' | 'image1' | 'image2' | 'image3') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'start') { setStartImageFile(file); setStartImageUrl(null); setStartImagePreview(result); }
        else if (type === 'end') { setEndImageFile(file); setEndImageUrl(null); setEndImagePreview(result); }
        else if (type === 'image1') { setImage1File(file); setImage1Url(null); setImage1Preview(result); }
        else if (type === 'image2') { setImage2File(file); setImage2Url(null); setImage2Preview(result); }
        else if (type === 'image3') { setImage3File(file); setImage3Url(null); setImage3Preview(result); }
      };
      reader.readAsDataURL(file);
    } else {
         if (type === 'start') { setStartImageFile(null); setStartImagePreview(null); }
         else if (type === 'end') { setEndImageFile(null); setEndImagePreview(null); }
         else if (type === 'image1') { setImage1File(null); setImage1Preview(null); }
         else if (type === 'image2') { setImage2File(null); setImage2Preview(null); }
         else if (type === 'image3') { setImage3File(null); setImage3Preview(null); }
    }
  };
  const handleImageSelection = useCallback((url: string | null, type: 'start' | 'end' | 'image1' | 'image2' | 'image3') => {
    if (type === 'start') { setStartImageUrl(url); setStartImageFile(null); setStartImagePreview(url); }
    else if (type === 'end') { setEndImageUrl(url); setEndImageFile(null); setEndImagePreview(url); }
    else if (type === 'image1') { setImage1Url(url); setImage1File(null); setImage1Preview(url); }
    else if (type === 'image2') { setImage2Url(url); setImage2File(null); setImage2Preview(url); }
    else if (type === 'image3') { setImage3Url(url); setImage3File(null); setImage3Preview(url); }
  }, []);
  const clearImage = (type: 'start' | 'end' | 'image1' | 'image2' | 'image3') => {
    if (type === 'start') { setStartImageFile(null); setStartImageUrl(null); setStartImagePreview(null); if (startFileInputRef.current) startFileInputRef.current.value = ""; }
    else if (type === 'end') { setEndImageFile(null); setEndImageUrl(null); setEndImagePreview(null); if (endFileInputRef.current) endFileInputRef.current.value = ""; }
    else if (type === 'image1') { setImage1File(null); setImage1Url(null); setImage1Preview(null); if (image1FileInputRef.current) image1FileInputRef.current.value = ""; }
    else if (type === 'image2') { setImage2File(null); setImage2Url(null); setImage2Preview(null); if (image2FileInputRef.current) image2FileInputRef.current.value = ""; }
    else if (type === 'image3') { setImage3File(null); setImage3Url(null); setImage3Preview(null); if (image3FileInputRef.current) image3FileInputRef.current.value = ""; }
  };

  // Effect to reset preview if inputs change while generating
  useEffect(() => {
    const hasInputs = prompt || startImageFile || endImageFile || startImageUrl || endImageUrl ||
                      image1File || image1Url || image2File || image2Url || image3File || image3Url ||
                      positivePrompt || negativePrompt;
    if (hasInputs && currentMediaId) {
      console.log("MediaGenerationForm: Inputs changed during generation, resetting preview.");
      setCurrentMediaId(null);
      setPreviewStatus('idle');
      setPreviewUrl(null);
    }
  }, [prompt, startImageFile, endImageFile, startImageUrl, endImageUrl, image1File, image1Url, image2File, image2Url, image3File, image3Url, positivePrompt, negativePrompt, currentMediaId]);

  // --- Submission Logic ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) { toast.error("User not identified. Please refresh."); return; }

    // Validation based on generation mode
    if (generationMode === 'firstLastFrameVideo') {
      // Wan 2.2 - needs start/end images and prompt
      if (!startImageFile && !startImageUrl) { toast.error("Please provide a start image."); return; }
      if (!endImageFile && !endImageUrl) { toast.error("Please provide an end image."); return; }
      if (!prompt.trim()) { toast.error("Please enter a prompt."); return; }
    } else if (generationMode === 'video') {
      // Qwen Edit - needs at least image1
      if (!image1File && !image1Url) { toast.error("Please provide an image to edit."); return; }
    } else if (generationMode === 'image') {
      // Krea Flux - needs prompt only (width/height have defaults)
      if (!prompt.trim()) { toast.error("Please enter a prompt."); return; }
    }
    
    if (userCredits < creditCost) { toast.error("Not enough credits to generate."); return; }

    setIsSubmitting(true);
    setPreviewUrl(null);
    setPreviewStatus('pending');

    // Clear any existing generation tracking
    setCurrentMediaId(null);

    let finalStartImageUrl = startImageUrl;
    let finalEndImageUrl = endImageUrl;

    try {
      // Image Compression & Direct Upload
      if (generationMode === 'firstLastFrameVideo') {
        const compressionOptions = { maxSizeMB: 0.95, maxWidthOrHeight: 1920, useWebWorker: true };

        if (startImageFile) {
          let compressedStartFile = startImageFile;
          try {
            const compressToastId = toast.loading("Compressing start image...");
            compressedStartFile = await imageCompression(startImageFile, compressionOptions);
            toast.dismiss(compressToastId);
          } catch (compressionError) { console.error("Start image compression failed:", compressionError); toast.error("Failed to compress start image. Using original."); }
          const uploadResult = await uploadDirectlyToSupabase(compressedStartFile, userId, 'start');
          if (!uploadResult.success || !uploadResult.url) throw new Error(uploadResult.error || "Failed to upload start image.");
          finalStartImageUrl = uploadResult.url;
        }

        if (endImageFile) {
          let compressedEndFile = endImageFile;
           try {
            const compressToastId = toast.loading("Compressing end image...");
            compressedEndFile = await imageCompression(endImageFile, compressionOptions);
            toast.dismiss(compressToastId);
          } catch (compressionError) { console.error("End image compression failed:", compressionError); toast.error("Failed to compress end image. Using original."); }
          const uploadResult = await uploadDirectlyToSupabase(compressedEndFile, userId, 'end');
           if (!uploadResult.success || !uploadResult.url) throw new Error(uploadResult.error || "Failed to upload end image.");
          finalEndImageUrl = uploadResult.url;
        }

        if (!finalStartImageUrl || !finalEndImageUrl) throw new Error("Missing required image URLs after processing uploads.");
      }

      // Handle Qwen Edit image uploads
      let finalImage1Url = image1Url;
      let finalImage2Url = image2Url;
      let finalImage3Url = image3Url;
      
      if (generationMode === 'video') {
        const compressionOptions = { maxSizeMB: 0.95, maxWidthOrHeight: 1920, useWebWorker: true };
        
        if (image1File) {
          let compressedFile = image1File;
          try {
            const compressToastId = toast.loading("Compressing image 1...");
            compressedFile = await imageCompression(image1File, compressionOptions);
            toast.dismiss(compressToastId);
          } catch (error) {
            console.error("Image 1 compression failed:", error);
          }
          const uploadResult = await uploadDirectlyToSupabase(compressedFile, userId, 'image1');
          if (!uploadResult.success || !uploadResult.url) throw new Error("Failed to upload image 1.");
          finalImage1Url = uploadResult.url;
        }
        
        if (image2File) {
          let compressedFile = image2File;
          try {
            const compressToastId = toast.loading("Compressing image 2...");
            compressedFile = await imageCompression(image2File, compressionOptions);
            toast.dismiss(compressToastId);
          } catch (error) {
            console.error("Image 2 compression failed:", error);
          }
          const uploadResult = await uploadDirectlyToSupabase(compressedFile, userId, 'image1');
          if (!uploadResult.success || !uploadResult.url) throw new Error("Failed to upload image 2.");
          finalImage2Url = uploadResult.url;
        }
        
        if (image3File) {
          let compressedFile = image3File;
          try {
            const compressToastId = toast.loading("Compressing image 3...");
            compressedFile = await imageCompression(image3File, compressionOptions);
            toast.dismiss(compressToastId);
          } catch (error) {
            console.error("Image 3 compression failed:", error);
          }
          const uploadResult = await uploadDirectlyToSupabase(compressedFile, userId, 'image1');
          if (!uploadResult.success || !uploadResult.url) throw new Error("Failed to upload image 3.");
          finalImage3Url = uploadResult.url;
        }
      }

      // Prepare FormData with mode-specific data
      const formData = new FormData();
      formData.append('generationMode', generationMode);
      formData.append('mediaType', generatedMediaType);
      
      if (generationMode === 'image') {
        // Krea Flux
        formData.append('prompt', prompt);
        formData.append('width', width.toString());
        formData.append('height', height.toString());
      } else if (generationMode === 'video') {
        // Qwen Edit
        formData.append('image1Url', finalImage1Url!);
        formData.append('positivePrompt', positivePrompt);
        formData.append('negativePrompt', negativePrompt);
        if (finalImage2Url) formData.append('image2Url', finalImage2Url);
        if (finalImage3Url) formData.append('image3Url', finalImage3Url);
      } else if (generationMode === 'firstLastFrameVideo') {
        // Wan 2.2
        formData.append('prompt', prompt);
        formData.append('startImageUrl', finalStartImageUrl!);
        formData.append('endImageUrl', finalEndImageUrl!);
        formData.append('width', videoWidth.toString());
        formData.append('height', videoHeight.toString());
        formData.append('length', videoLength.toString());
      }

      // Call server action
      const result = await generateMedia(formData);

      if (!result.success || !result.mediaId) {
        toast.error(result.error || 'Failed to start generation');
        setPreviewStatus('failed');
      } else {
        toast.info(`Your ${generatedMediaType} generation has started!`);
        setCurrentMediaId(result.mediaId); // This will trigger Realtime subscription
        if (onGenerationStart) onGenerationStart(result.mediaId);
      }
    } catch (error: any) {
      console.error(`Submission error:`, error);
      toast.error(error.message || 'An unexpected error occurred during submission.');
      setPreviewStatus('failed');
      setCurrentMediaId(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLoading = isSubmitting || (currentMediaId !== null && previewStatus === 'processing');
  const isFirstLastMode = generationMode === 'firstLastFrameVideo';
  const isQwenEdit = generationMode === 'video';
  const isKreaFlux = generationMode === 'image';

  // --- Render Image Input Helper ---
  const renderImageInput = (type: 'start' | 'end' | 'image1' | 'image2' | 'image3', required: boolean = true) => {
    let previewSrc, fileInputRef, selectedUrl, label;
    
    switch(type) {
      case 'start':
        previewSrc = startImagePreview;
        fileInputRef = startFileInputRef;
        selectedUrl = startImageUrl;
        label = 'Start Image';
        break;
      case 'end':
        previewSrc = endImagePreview;
        fileInputRef = endFileInputRef;
        selectedUrl = endImageUrl;
        label = 'End Image';
        break;
      case 'image1':
        previewSrc = image1Preview;
        fileInputRef = image1FileInputRef;
        selectedUrl = image1Url;
        label = 'Primary Image';
        break;
      case 'image2':
        previewSrc = image2Preview;
        fileInputRef = image2FileInputRef;
        selectedUrl = image2Url;
        label = 'Reference Image 2 (Optional)';
        break;
      case 'image3':
        previewSrc = image3Preview;
        fileInputRef = image3FileInputRef;
        selectedUrl = image3Url;
        label = 'Reference Image 3 (Optional)';
        break;
    }
    
    return (
      <div className="space-y-2">
        <Label htmlFor={`${type}-image-input`} className="text-base font-medium text-foreground/90">{label}</Label>
        <div className="flex items-center gap-2">
           <Input id={`${type}-image-input`} ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/webp, image/gif" onChange={(e) => handleFileChange(e, type)} className="hidden" disabled={isLoading}/>
           <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="glass-input bg-white/5 border-white/15 hover:bg-white/10 text-foreground/80 flex-grow"> <Upload className="mr-2 h-4 w-4" /> Upload </Button>
           <span className="text-xs text-muted-foreground mx-1">OR</span>
           <ImageSelectorPopover selectedUrl={selectedUrl} onImageSelect={(url) => handleImageSelection(url, type)} triggerText="Select Existing" disabled={isLoading}/>
        </div>
        <div className="mt-2" style={{ minHeight: '100px' }}>
            <AnimatePresence>
              {previewSrc && (
                <motion.div key={`${type}-preview`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: '100px' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="relative border border-white/15 rounded-md overflow-hidden p-1 bg-black/10" style={{ width: '100px' }}>
                  <Image src={previewSrc} alt={`${type} image preview`} fill sizes="100px" className="object-contain" onError={(e) => console.error(`Error loading ${type} preview image:`, e)}/>
                  <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-6 w-6 bg-black/50 text-white hover:bg-black/70 hover:text-destructive rounded-full m-1 z-10" onClick={() => clearImage(type)} disabled={isLoading} title={`Remove ${type} image`}> <X className="h-4 w-4" /> </Button>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </div>
    );
  };

  // --- Main Return JSX ---
  return (
     <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* Form Section */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Krea Flux Inputs (Image Generation) */}
          {isKreaFlux && (
            <>
              <div>
                <Label htmlFor="prompt" className="block text-base font-medium mb-2 text-foreground/90">Image Description</Label>
                <Textarea id="prompt" placeholder="Describe the image you want to create..." value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isLoading} rows={5} className="resize-none glass-input bg-white/5 border-white/15 focus:border-primary/60 focus:ring-primary/30 focus:ring-2 transition-all text-base p-3 rounded-lg"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width" className="block text-sm font-medium mb-2 text-foreground/90">Width</Label>
                  <Input type="number" id="width" value={width} onChange={(e) => setWidth(parseInt(e.target.value) || 1024)} min={512} max={2048} step={64} disabled={isLoading} className="glass-input bg-white/5 border-white/15"/>
                </div>
                <div>
                  <Label htmlFor="height" className="block text-sm font-medium mb-2 text-foreground/90">Height</Label>
                  <Input type="number" id="height" value={height} onChange={(e) => setHeight(parseInt(e.target.value) || 1024)} min={512} max={2048} step={64} disabled={isLoading} className="glass-input bg-white/5 border-white/15"/>
                </div>
              </div>
            </>
          )}

          {/* Qwen Edit Inputs (Image Editing) */}
          {isQwenEdit && (
            <>
              {renderImageInput('image1', true)}
              {renderImageInput('image2', false)}
              {renderImageInput('image3', false)}
              <div>
                <Label htmlFor="positive" className="block text-base font-medium mb-2 text-foreground/90">Positive Prompt (Optional)</Label>
                <Textarea id="positive" placeholder="Describe what you want to see or enhance..." value={positivePrompt} onChange={(e) => setPositivePrompt(e.target.value)} disabled={isLoading} rows={3} className="resize-none glass-input bg-white/5 border-white/15 focus:border-primary/60 focus:ring-primary/30 focus:ring-2 transition-all text-base p-3 rounded-lg"/>
              </div>
              <div>
                <Label htmlFor="negative" className="block text-base font-medium mb-2 text-foreground/90">Negative Prompt (Optional)</Label>
                <Textarea id="negative" placeholder="Describe what to avoid..." value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} disabled={isLoading} rows={2} className="resize-none glass-input bg-white/5 border-white/15 focus:border-primary/60 focus:ring-primary/30 focus:ring-2 transition-all text-base p-3 rounded-lg"/>
              </div>
            </>
          )}

          {/* Wan 2.2 Inputs (First/Last Frame Video) */}
          {isFirstLastMode && (
            <>
              {renderImageInput('start', true)}
              {renderImageInput('end', true)}
              <div>
                <Label htmlFor="prompt" className="block text-base font-medium mb-2 text-foreground/90">Positive Prompt</Label>
                <Textarea id="prompt" placeholder="e.g., 'car crashes through the wall and man comes into the frame screaming'" value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isLoading} rows={3} className="resize-none glass-input bg-white/5 border-white/15 focus:border-primary/60 focus:ring-primary/30 focus:ring-2 transition-all text-base p-3 rounded-lg"/>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="videoWidth" className="block text-sm font-medium mb-2 text-foreground/90">Width</Label>
                  <Input type="number" id="videoWidth" value={videoWidth} onChange={(e) => setVideoWidth(parseInt(e.target.value) || 512)} min={256} max={1024} step={64} disabled={isLoading} className="glass-input bg-white/5 border-white/15"/>
                </div>
                <div>
                  <Label htmlFor="videoHeight" className="block text-sm font-medium mb-2 text-foreground/90">Height</Label>
                  <Input type="number" id="videoHeight" value={videoHeight} onChange={(e) => setVideoHeight(parseInt(e.target.value) || 512)} min={256} max={1024} step={64} disabled={isLoading} className="glass-input bg-white/5 border-white/15"/>
                </div>
                <div>
                  <Label htmlFor="videoLength" className="block text-sm font-medium mb-2 text-foreground/90">Length (frames)</Label>
                  <Input type="number" id="videoLength" value={videoLength} onChange={(e) => setVideoLength(parseInt(e.target.value) || 81)} min={25} max={200} step={1} disabled={isLoading} className="glass-input bg-white/5 border-white/15"/>
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={
              isLoading ||
              !userId ||
              userCredits < creditCost ||
              (isKreaFlux && !prompt.trim()) ||
              (isQwenEdit && !image1File && !image1Url) ||
              (isFirstLastMode && ((!startImageFile && !startImageUrl) || (!endImageFile && !endImageUrl) || !prompt.trim()))
            }
            className="w-full glass-button bg-gradient-to-r from-primary to-secondary text-white hover:opacity-95 hover:shadow-lg transition-all duration-300 shadow-md text-lg py-3 font-semibold"
          >
            {isLoading ? ( <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {isSubmitting ? 'Starting...' : 'Generating...'}</> ) : ( <><Sparkles className="mr-2 h-5 w-5" /> Generate ({creditCost} credits)</> )}
          </Button>
        </form>
        <div className="text-base text-muted-foreground border-t border-white/15 pt-4 space-y-1 bg-white/5 p-4 rounded-lg shadow-inner">
          <p><span className="font-semibold text-foreground/95">Cost:</span> <span className="text-primary font-medium">{creditCost}</span> credits</p>
          <p><span className="font-semibold text-foreground/95">Available:</span> <span className="text-primary font-medium">{userCredits.toLocaleString()}</span> credits</p>
          {userCredits < creditCost && !isLoading && ( <p className="text-destructive text-sm flex items-center gap-1 pt-1"><AlertCircle className="w-4 h-4"/> Not enough credits.</p> )}
        </div>
      </motion.div>

      {/* Preview Section */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col">
        <label className="block text-base font-medium mb-2 text-foreground/90"> Result preview </label>
        <div className="relative glass-card bg-black/10 border border-white/15 rounded-lg aspect-video md:aspect-square flex items-center justify-center overflow-hidden shadow-inner p-2">
          <AnimatePresence mode="wait">
            {/* Loading State */}
            {isLoading && (previewStatus === 'pending' || previewStatus === 'processing') && (
              <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className="text-center p-4 flex flex-col items-center justify-center absolute inset-0 bg-black/40 backdrop-blur-md rounded-lg"> <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" /> <p className="text-base font-medium text-foreground">Generating your {generatedMediaType}...</p> <p className="text-sm text-muted-foreground mt-1">Checking status...</p> </motion.div>
            )}
            {/* Completed State */}
            {previewStatus === 'completed' && previewUrl && (
              <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative w-full h-full">
                {generatedMediaType === 'video' ? ( <video src={previewUrl} controls className="w-full h-full object-contain rounded-md" preload="metadata" /> ) : ( <Image src={previewUrl} alt={prompt || "Generated Media"} fill className="object-contain rounded-md" unoptimized={true} /> )}
              </motion.div>
            )}
            {/* Failed State */}
            {previewStatus === 'failed' && !isLoading && ( // Only show failed if not actively loading/polling
              <motion.div key="failed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }} className="text-center p-4 flex flex-col items-center justify-center absolute inset-0 bg-destructive/20 backdrop-blur-sm rounded-lg"> <AlertCircle className="h-12 w-12 text-destructive-foreground mb-4" /> <p className="text-base font-medium text-destructive-foreground">Generation failed.</p> <p className="text-sm text-destructive-foreground/80 mt-1">Check library or try again.</p> </motion.div>
            )}
            {/* Idle State */}
            {previewStatus === 'idle' && !isLoading && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="text-center p-4 flex flex-col items-center justify-center text-muted-foreground"> <div className="rounded-full bg-primary/10 p-5 w-fit mx-auto mb-5 border border-primary/20 shadow-sm"> {generatedMediaType === 'image' ? <LucideImage className="h-10 w-10 text-primary/80" /> : <Film className="h-10 w-10 text-primary/80" />} </div> <p className="text-base"> Your {generatedMediaType} preview will appear here </p> </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
