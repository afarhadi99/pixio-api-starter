// src/app/(app)/dashboard/page.tsx
import { createClient } from '@repo/supabase/server';
import { getUserCredits } from '@/lib/credits';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';
import { MediaGenerationForm } from '@/components/dashboard/media-generation-form';
import { MediaLibrary } from '@/components/dashboard/media-library';
import { fetchUserMedia } from '@/lib/actions/media.actions';
// Import Pixio models
import { PIXIO_MODELS } from '@repo/pixio-api';
import { CREDIT_COSTS, GENERATION_MODES } from '@/lib/constants/media';
import { Sparkles, Bot, Image as ImageIconLucide, Film, Wand2 } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch profile and credits concurrently
  const [profileResult, creditsResult, initialMediaResult] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    getUserCredits(),
    fetchUserMedia() // Fetch initial media data on the server
  ]);

  const profile = profileResult.data;
  const { total: totalCredits } = creditsResult;

  // Default active tab
  const defaultTab = GENERATION_MODES[0]; // Default to the first mode ('image')

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">

      {/* Welcome Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent inline-block">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Creator'}!
        </h1>
        <p className="text-xl text-muted-foreground">
          Let's create something amazing with AI.
        </p>
      </div>

      {/* AI Media Generator Card */}
      <Card className="glass-card border border-white/15 shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-white/15 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-white/15 shadow-inner">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
             </div>
             <div>
                <CardTitle className="text-2xl md:text-3xl text-foreground/95">AI Media Generator</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Generate images and videos using state-of-the-art Pixio API models.
                </CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-transparent p-0 gap-4">
              {/* Krea Flux - Image Generation */}
              <TabsTrigger
                value="image"
                className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-lg border border-white/20 bg-white/5 text-foreground/80 hover:bg-white/10 hover:text-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-secondary/80 data-[state=active]:text-primary-foreground data-[state=active]:border-transparent data-[state=active]:shadow-lg transition-all duration-300 text-sm font-medium"
              >
                <ImageIconLucide className="w-5 h-5" />
                <span className="font-semibold">{PIXIO_MODELS.kreaFlux.name}</span>
                <span className="text-xs opacity-70">Image Generation</span>
              </TabsTrigger>

              {/* Qwen Edit - Image Editing */}
              <TabsTrigger
                value="video"
                className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-lg border border-white/20 bg-white/5 text-foreground/80 hover:bg-white/10 hover:text-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-secondary/80 data-[state=active]:text-primary-foreground data-[state=active]:border-transparent data-[state=active]:shadow-lg transition-all duration-300 text-sm font-medium"
              >
                <Wand2 className="w-5 h-5" />
                <span className="font-semibold">{PIXIO_MODELS.qwenEdit.name}</span>
                <span className="text-xs opacity-70">Image Editing</span>
              </TabsTrigger>

              {/* Wan 2.2 - Video from Keyframes */}
              <TabsTrigger
                value="firstLastFrameVideo"
                className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-lg border border-white/20 bg-white/5 text-foreground/80 hover:bg-white/10 hover:text-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-secondary/80 data-[state=active]:text-primary-foreground data-[state=active]:border-transparent data-[state=active]:shadow-lg transition-all duration-300 text-sm font-medium"
              >
                 <Film className="w-5 h-5" />
                <span className="font-semibold">{PIXIO_MODELS.wanFirstLastFrame.name}</span>
                <span className="text-xs opacity-70">Video Generation</span>
              </TabsTrigger>
            </TabsList>

            {/* Krea Flux Tab */}
            <TabsContent value="image" className="mt-4">
              <MediaGenerationForm
                generationMode="image"
                creditCost={CREDIT_COSTS.image}
                userCredits={totalCredits}
              />
            </TabsContent>

            {/* Qwen Edit Tab */}
            <TabsContent value="video" className="mt-4">
              <MediaGenerationForm
                generationMode="video"
                creditCost={CREDIT_COSTS.video}
                userCredits={totalCredits}
              />
            </TabsContent>

            {/* Wan 2.2 First/Last Frame Tab */}
            <TabsContent value="firstLastFrameVideo" className="mt-4">
              <MediaGenerationForm
                generationMode="firstLastFrameVideo"
                creditCost={CREDIT_COSTS.firstLastFrameVideo}
                userCredits={totalCredits}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Media Library Section */}
      <MediaLibrary initialMedia={initialMediaResult.success ? initialMediaResult.media : []} />
    </div>
  );
}
