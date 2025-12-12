// src/components/dashboard/media-library.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react'; // Added useRef
import { fetchUserMedia, deleteMedia, cancelGeneration } from '@/lib/actions/media.actions';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon, VideoIcon, Loader2, Calendar, Download, Copy, Check, AlertCircle, Trash2, Library, Film, XCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { GeneratedMedia } from '@/types/db_types';
import { MediaType } from '@/lib/constants/media';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from 'framer-motion';

interface MediaLibraryProps {
  initialMedia?: GeneratedMedia[];
}

export function MediaLibrary({ initialMedia = [] }: MediaLibraryProps) {
  const [media, setMedia] = useState<GeneratedMedia[]>(initialMedia);
  const [activeTab, setActiveTab] = useState<'all' | MediaType>('all');
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Get user ID on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, [supabase]);

  useEffect(() => {
    if (!userId || channelRef.current) return; // Don't subscribe if no user or already subscribed

    console.log(`MediaLibrary: Setting up Realtime for user ${userId}`);
    const channel = supabase
      .channel(`media-updates-for-${userId}`)
      .on<GeneratedMedia>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'generated_media', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log('MediaLibrary: Realtime payload:', payload);
          const newMedia = payload.new as GeneratedMedia;
          const oldMedia = payload.old as GeneratedMedia & { id: string };
          setMedia((currentMedia) => {
            let updatedMedia = [...currentMedia];
            if (payload.eventType === 'INSERT') {
              if (!updatedMedia.some(item => item.id === newMedia.id)) {
                updatedMedia.unshift(newMedia); // Add to beginning
                console.log(`MediaLibrary: Inserted ${newMedia.id}`);
              }
            } else if (payload.eventType === 'UPDATE') {
              const index = updatedMedia.findIndex(item => item.id === newMedia.id);
              if (index !== -1) {
                updatedMedia[index] = newMedia;
                console.log(`MediaLibrary: Updated ${newMedia.id}`);
              } else {
                 updatedMedia.unshift(newMedia); // Insert if not found (edge case)
                 console.log(`MediaLibrary: Inserted updated ${newMedia.id}`);
              }
            } else if (payload.eventType === 'DELETE' && oldMedia?.id) {
              updatedMedia = updatedMedia.filter(item => item.id !== oldMedia.id);
              console.log(`MediaLibrary: Deleted ${oldMedia.id}`);
            }
            // Ensure sorting remains consistent
            return updatedMedia.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          });
        }
      )
      .subscribe((status, err) => {
        // --- MODIFIED ERROR HANDLING ---
        if (status === 'SUBSCRIBED') {
          console.log(`MediaLibrary: Realtime SUBSCRIBED for user ${userId}`);
        } else if (status === 'CHANNEL_ERROR') {
          // Log more details, specifically handling undefined 'err'
          console.error(`MediaLibrary: Realtime CHANNEL_ERROR. Status: ${status}, Error:`, err ?? 'Error object is undefined');
          toast.error("Realtime connection error. Updates might be delayed.", { duration: 10000 });
        } else if (status === 'TIMED_OUT') {
          console.warn(`MediaLibrary: Realtime TIMED_OUT. Status: ${status}`);
          toast.warning("Realtime connection timed out. Attempting to reconnect.", { duration: 10000 });
        } else if (status === 'CLOSED') {
           console.log(`MediaLibrary: Realtime channel CLOSED for user ${userId}. Status: ${status}`);
           // Optionally attempt to resubscribe or notify user if closure was unexpected
        } else {
          // Log any other status updates
           console.log(`MediaLibrary: Realtime status update: ${status}`);
        }
        // --- END MODIFIED ERROR HANDLING ---
      });

    channelRef.current = channel; // Store channel in ref

    // Cleanup function
    return () => {
      if (channelRef.current) {
        console.log(`MediaLibrary: Unsubscribing from Realtime for ${userId}`);
        supabase.removeChannel(channelRef.current).catch(err => console.error("Error removing channel:", err));
        channelRef.current = null; // Clear ref on cleanup
      }
    };
  }, [supabase, userId]); // Depend only on supabase and userId

  const handleItemDeleted = useCallback((deletedMediaId: string) => {
    setMedia((prevMedia) => prevMedia.filter(item => item.id !== deletedMediaId));
    toast.info("Media removed.");
  }, []);

  const filteredMedia = activeTab === 'all'
    ? media
    : media.filter(item => item.media_type === activeTab);

  return (
    <div className="mt-10 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Library className="w-6 h-6 text-primary/80" /> Media Library
        </h2>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | MediaType)} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 p-1 rounded-lg backdrop-blur-sm">
             <TabsTrigger value="all" className="data-[state=active]:bg-white/10 data-[state=active]:text-foreground data-[state=active]:shadow-md rounded-md transition-all">All</TabsTrigger>
             <TabsTrigger value="image" className="data-[state=active]:bg-white/10 data-[state=active]:text-foreground data-[state=active]:shadow-md rounded-md transition-all">Images</TabsTrigger>
             <TabsTrigger value="video" className="data-[state=active]:bg-white/10 data-[state=active]:text-foreground data-[state=active]:shadow-md rounded-md transition-all">Videos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <AnimatePresence>
          {filteredMedia.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <Card className="glass-card border-dashed border-white/20">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center px-6">
                  {/* Icon */}
                  <div className="p-6 mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 shadow-lg">
                    {activeTab === 'image' ? <ImageIcon className="h-12 w-12 text-primary" /> : activeTab === 'video' ? <Film className="h-12 w-12 text-primary" /> : <Library className="h-12 w-12 text-primary" />}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 text-foreground">
                    {activeTab === 'all' ? 'Your Media Library is Empty' : `No ${activeTab}s Yet`}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground max-w-md mb-6 text-base">
                    {activeTab === 'all'
                      ? 'Start generating AI-powered images and videos. Your creations will appear here.'
                      : `Generate your first ${activeTab} using one of our AI models above.`
                    }
                  </p>

                  {/* Features List */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mb-6 text-left">
                    <div className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ImageIcon className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground/90">Krea Flux</p>
                        <p className="text-xs text-muted-foreground">High-quality images</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ImageIcon className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground/90">Qwen Edit</p>
                        <p className="text-xs text-muted-foreground">AI image editing</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Film className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground/90">Wan 2.2</p>
                        <p className="text-xs text-muted-foreground">Video transitions</p>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="glass-button bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                  >
                    Start Creating
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredMedia.map((item, index) => (
                 <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                    <MediaCard item={item} onDeleted={() => handleItemDeleted(item.id)} />
                 </motion.div>
              ))}
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

// --- MediaCard Component (Updated) ---
interface MediaCardProps {
  item: GeneratedMedia;
  onDeleted: () => void;
}

function MediaCard({ item, onDeleted }: MediaCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const downloadMedia = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.media_url) { toast.error("Media URL not available."); return; }
    toast.info("Starting download...");
    try {
      const response = await fetch(item.media_url, { mode: 'cors' });
      if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none'; a.href = url;
      // Determine extension based on URL or media_type
      const urlExtension = item.media_url.split('.').pop()?.toLowerCase();
      const defaultExtension = item.media_type === 'image' ? 'png' : 'mp4'; // Default to mp4 for video
      const extension = urlExtension && ['png', 'jpg', 'jpeg', 'webp', 'gif', 'mp4'].includes(urlExtension) ? `.${urlExtension}` : `.${defaultExtension}`;
      a.download = `${item.media_type}-${item.id.substring(0, 8)}${extension}`;
      document.body.appendChild(a); a.click();
      window.URL.revokeObjectURL(url); document.body.removeChild(a);
      toast.success(`${item.media_type} downloaded`);
    } catch (error: any) { console.error('Download failed:', error); toast.error(`Download failed: ${error.message}`); }
  };

  const copyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.prompt) { toast.error("No prompt available."); return; }
    navigator.clipboard.writeText(item.prompt).then(() => {
        setIsCopied(true); toast.success('Prompt copied!'); setTimeout(() => setIsCopied(false), 2000);
    }).catch((error) => { console.error('Copy failed:', error); toast.error('Failed to copy prompt'); });
  };

  const handleDeleteConfirm = async () => {
    if (!item.id) { toast.error("Cannot delete: Missing ID."); return; }
    setIsDeleting(true);
    console.log(`Deleting media: ${item.id}, path: ${item.storage_path || 'N/A'}`);
    try {
      const result = await deleteMedia(item.id, item.storage_path);
      if (result.success) onDeleted(); // Parent handles UI update and success toast
      else { toast.error(`Delete failed: ${result.error}`); setIsDeleting(false); }
    } catch (error: any) { toast.error(`Error deleting: ${error.message}`); setIsDeleting(false); }
  };

  const handleCancelConfirm = async () => {
    if (!item.id) { toast.error("Cannot cancel: Missing ID."); return; }
    setIsCancelling(true);
    console.log(`Cancelling media generation: ${item.id}`);
    try {
      const result = await cancelGeneration(item.id);
      if (result.success) {
        toast.success('Generation cancelled');
        // No need to call onDeleted - Realtime will update the UI
      } else {
        toast.error(`Cancel failed: ${result.error}`);
      }
    } catch (error: any) {
      toast.error(`Error cancelling: ${error.message}`);
    } finally {
      setIsCancelling(false);
    }
  };

  const isLoading = item.status === 'pending' || item.status === 'processing';
  const isFailed = item.status === 'failed';
  const isCompleted = item.status === 'completed';
  const showActions = isCompleted || isFailed;
  const showCancel = isLoading && !isCancelling;
  const isMp4Video = item.media_type === 'video' && item.media_url?.toLowerCase().endsWith('.mp4');

  return (
    <motion.div
        whileHover={{ y: -5, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`glass-card group relative overflow-hidden rounded-lg border border-white/10 shadow-md transition-all duration-300 flex flex-col h-full ${isLoading ? 'opacity-60 animate-pulse' : ''} ${isFailed ? 'border-destructive/50' : ''}`}
    >
      {/* Media Area */}
      <div className="relative aspect-square overflow-hidden bg-black/10">
        {/* Status Overlays */}
        <AnimatePresence>
          {isLoading && ( <motion.div key="loading-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-10 p-4 text-center"> <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" /> <span className="text-xs font-medium text-primary-foreground">{item.status}...</span> </motion.div> )}
          {isFailed && ( <motion.div key="failed-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/40 backdrop-blur-sm z-10 p-4 text-center"> <AlertCircle className="h-8 w-8 text-destructive-foreground mb-2" /> <span className="text-xs font-medium text-destructive-foreground">Failed</span> {typeof item.metadata === 'object' && item.metadata !== null && 'error' in item.metadata && ( <p className="text-[10px] text-destructive-foreground/80 mt-1 line-clamp-2" title={String(item.metadata.error)}> {String(item.metadata.error)} </p> )} </motion.div> )}
        </AnimatePresence>

        {/* Media display */}
        {isCompleted && item.media_url ? (
            isMp4Video ? (
                <video
                    src={item.media_url}
                    controls
                    preload="metadata"
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} // Hide video element on error
                />
            ) : item.media_type === 'video' ? (
                 // Assume webp video if not mp4
                 <Image src={item.media_url} alt={item.prompt || 'Generated video'} fill className="object-contain transition-transform duration-300 group-hover:scale-105" unoptimized={true} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            ) : (
                 // Image
                 <Image src={item.media_url} alt={item.prompt || 'Generated image'} fill className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized={true} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            )
        ) : (
          !isFailed && !isLoading && ( <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"> {item.media_type === 'image' ? <ImageIcon className="h-16 w-16" /> : <VideoIcon className="h-16 w-16" />} </div> )
        )}

         {/* Media type badge */}
         <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-md px-2 py-1 text-xs font-medium flex items-center gap-1 z-20 text-white/90 border border-white/10">
           {item.media_type === 'image' ? <ImageIcon className="h-3 w-3" /> : <VideoIcon className="h-3 w-3" />}
           <span className="capitalize">{item.media_type}</span>
         </div>
      </div>

      {/* Content Area */}
      <CardContent className="p-3 flex flex-col flex-grow">
        <p className="text-xs text-muted-foreground line-clamp-2 h-8 flex-grow mb-2" title={item.prompt}> {item.prompt || 'No prompt'} </p>
        <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground"> <Calendar className="h-3 w-3" /> <span>{formattedDate}</span> </div>
          <AnimatePresence>
            {showCancel && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-1">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-orange-500/70 hover:text-orange-500 hover:bg-orange-500/10" title="Cancel generation" disabled={isCancelling}> {isCancelling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />} </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-card border-orange-500/30">
                    <AlertDialogHeader> <AlertDialogTitle>Cancel Generation?</AlertDialogTitle> <AlertDialogDescription> This will stop the generation process. Credits will not be refunded. </AlertDialogDescription> </AlertDialogHeader>
                    <AlertDialogFooter> <AlertDialogCancel disabled={isCancelling}>Keep Running</AlertDialogCancel> <AlertDialogAction onClick={handleCancelConfirm} disabled={isCancelling} className="bg-orange-500 text-white hover:bg-orange-600"> {isCancelling ? "Cancelling..." : "Cancel Generation"} </AlertDialogAction> </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </motion.div>
            )}
            {showActions && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-1">
                {isCompleted && item.media_url && ( <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={downloadMedia} title="Download" disabled={isDeleting}> <Download className="h-3.5 w-3.5" /> </Button> )}
                {item.prompt && ( <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={copyPrompt} title="Copy prompt" disabled={isDeleting}> {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />} </Button> )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive/70 hover:text-destructive hover:bg-destructive/10" title="Delete" disabled={isDeleting}> {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-card border-destructive/30">
                    <AlertDialogHeader> <AlertDialogTitle>Delete Media?</AlertDialogTitle> <AlertDialogDescription> This action cannot be undone. The media record and file will be permanently deleted. </AlertDialogDescription> </AlertDialogHeader>
                    <AlertDialogFooter> <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel> <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90"> {isDeleting ? "Deleting..." : "Delete"} </AlertDialogAction> </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </motion.div>
  );
}
