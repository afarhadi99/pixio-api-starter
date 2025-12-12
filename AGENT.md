# Agent Guide: Adding New Pixio API Models

This guide provides step-by-step instructions for adding new Pixio API models to the application. Follow these steps in order to ensure proper integration.

## Overview

To add a new Pixio model (e.g., another Krea model, FLUX variations, etc.), you need to:
1. Define the model's input types
2. Create the model definition
3. Update environment variables
4. Add to generation modes
5. Update the UI
6. Handle inputs in the backend

---

## Example: Adding "Krea Flux Pro"

Let's walk through adding a hypothetical "Krea Flux Pro" model with the same inputs as Krea Flux but with enhanced quality.

### Step 1: Define Input Types

**File:** [`src/lib/pixio-api.ts`](src/lib/pixio-api.ts)

**Location:** Add after existing input type definitions (~line 49)

```typescript
/**
 * Krea Flux Pro model inputs (same as Krea Flux)
 */
export interface KreaFluxProInputs {
  text: string;
  width?: number;
  height?: number;
  quality?: 'standard' | 'high' | 'ultra'; // New optional parameter
}
```

### Step 2: Create Model Definition

**File:** [`src/lib/pixio-api.ts`](src/lib/pixio-api.ts)

**Location:** Add after existing model definitions (~line 188)

```typescript
/**
 * Krea Flux Pro - Enhanced image generation
 */
export const KREA_FLUX_PRO: PixioModel<KreaFluxProInputs> = {
  id: 'krea-flux-pro',
  name: 'Krea Flux Pro',
  description: 'Enhanced image generation with Flux Pro model. Higher quality outputs with more detail.',
  deploymentId: process.env.DEPLOYMENT_ID_KREA_FLUX_PRO || 'your-deployment-id-here',
  category: 'image',
  creditCost: 20, // Higher cost for pro version
  defaultInputs: {
    width: 1024,
    height: 1024,
    quality: 'high'
  },
  inputSchema: {
    text: {
      type: 'string',
      required: true,
      description: 'Text prompt describing the image to generate'
    },
    width: {
      type: 'number',
      required: false,
      default: 1024,
      description: 'Output image width in pixels'
    },
    height: {
      type: 'number',
      required: false,
      default: 1024,
      description: 'Output image height in pixels'
    },
    quality: {
      type: 'string',
      required: false,
      default: 'high',
      description: 'Generation quality level'
    }
  }
};
```

### Step 3: Add to PIXIO_MODELS Export

**File:** [`src/lib/pixio-api.ts`](src/lib/pixio-api.ts)

**Location:** Update PIXIO_MODELS object (~line 193)

```typescript
/**
 * All available models
 */
export const PIXIO_MODELS = {
  kreaFlux: KREA_FLUX,
  qwenEdit: QWEN_EDIT,
  wanFirstLastFrame: WAN_FIRST_LAST_FRAME,
  kreaFluxPro: KREA_FLUX_PRO, // Add new model here
} as const;
```

### Step 4: Add Environment Variable

**File:** [`env.example`](env.example)

**Location:** Add to Pixio Configuration section (~line 20)

```env
# Krea Flux Pro - Enhanced image generation
DEPLOYMENT_ID_KREA_FLUX_PRO=your_actual_deployment_id_from_pixio
```

**Also add to your `.env.local`** with the actual deployment ID from your Pixio dashboard.

### Step 5: Add Generation Mode

**File:** [`src/lib/constants/media.ts`](src/lib/constants/media.ts)

**Location:** Update generation modes and credit costs

```typescript
// Add to GENERATION_MODES
export const GENERATION_MODES = [
  'image', 
  'video', 
  'firstLastFrameVideo',
  'kreaFluxPro' // Add new mode
] as const;

// Add to CREDIT_COSTS
export const CREDIT_COSTS = {
  image: PIXIO_MODELS.kreaFlux.creditCost,          // 10 credits
  video: PIXIO_MODELS.qwenEdit.creditCost,          // 15 credits
  firstLastFrameVideo: PIXIO_MODELS.wanFirstLastFrame.creditCost, // 100 credits
  kreaFluxPro: PIXIO_MODELS.kreaFluxPro.creditCost, // 20 credits - ADD THIS
} as const;
```

### Step 6: Update Dashboard UI

**File:** [`src/app/(app)/dashboard/page.tsx`](src/app/(app)/dashboard/page.tsx)

#### 6a. Import Icon (if needed)

**Location:** Top of file (~line 12)

```typescript
import { Sparkles, Bot, Image as ImageIconLucide, Film, Wand2, Crown } from 'lucide-react';
// Add Crown icon for Pro version
```

#### 6b. Update TabsList Grid

**Location:** TabsList component (~line 66)

Change `grid-cols-3` to `grid-cols-4` (or use responsive grid):

```tsx
<TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-transparent p-0 gap-4">
```

#### 6c. Add New Tab Trigger

**Location:** After existing TabsTrigger components (~line 100)

```tsx
{/* Krea Flux Pro */}
<TabsTrigger
  value="kreaFluxPro"
  className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-lg border border-white/20 bg-white/5 text-foreground/80 hover:bg-white/10 hover:text-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-secondary/80 data-[state=active]:text-primary-foreground data-[state=active]:border-transparent data-[state=active]:shadow-lg transition-all duration-300 text-sm font-medium"
>
  <Crown className="w-5 h-5" />
  <span className="font-semibold">{PIXIO_MODELS.kreaFluxPro.name}</span>
  <span className="text-xs opacity-70">Pro Quality</span>
</TabsTrigger>
```

#### 6d. Add New TabsContent

**Location:** After existing TabsContent components (~line 130)

```tsx
{/* Krea Flux Pro Tab */}
<TabsContent value="kreaFluxPro" className="mt-0">
  <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
    <p className="text-sm text-muted-foreground">
      {PIXIO_MODELS.kreaFluxPro.description}
    </p>
  </div>
  <MediaGenerationForm
    generationMode="kreaFluxPro"
    creditCost={CREDIT_COSTS.kreaFluxPro}
    userCredits={totalCredits}
  />
</TabsContent>
```

### Step 7: Update Media Generation Form

**File:** [`src/components/dashboard/media-generation-form.tsx`](src/components/dashboard/media-generation-form.tsx)

#### 7a. Add State Variables (if new inputs needed)

**Location:** Component state section (~line 118)

```typescript
// Krea Flux Pro specific (if different from standard)
const [quality, setQuality] = useState<'standard' | 'high' | 'ultra'>('high');
```

#### 7b. Add Input Reset Logic

**Location:** useEffect for input changes (~line 170)

```typescript
useEffect(() => {
  const hasInputs = prompt || /* ... other inputs ... */ || quality;
  // ... rest of logic
}, [prompt, /* other deps */, quality]);
```

#### 7c. Add Form Inputs Section

**Location:** Inside form rendering, add new conditional section (~line 330)

```tsx
{/* Krea Flux Pro Inputs */}
{generationMode === 'kreaFluxPro' && (
  <>
    <div>
      <Label htmlFor="prompt" className="block text-base font-medium mb-2 text-foreground/90">
        Image Description (Pro Quality)
      </Label>
      <Textarea 
        id="prompt" 
        placeholder="Describe your image in detail for best results..." 
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)} 
        disabled={isLoading} 
        rows={5} 
        className="resize-none glass-input bg-white/5 border-white/15 focus:border-primary/60 focus:ring-primary/30 focus:ring-2 transition-all text-base p-3 rounded-lg"
      />
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="width" className="block text-sm font-medium mb-2 text-foreground/90">Width</Label>
        <Input 
          type="number" 
          id="width" 
          value={width} 
          onChange={(e) => setWidth(parseInt(e.target.value) || 1024)} 
          min={512} 
          max={2048} 
          step={64} 
          disabled={isLoading} 
          className="glass-input bg-white/5 border-white/15"
        />
      </div>
      <div>
        <Label htmlFor="height" className="block text-sm font-medium mb-2 text-foreground/90">Height</Label>
        <Input 
          type="number" 
          id="height" 
          value={height} 
          onChange={(e) => setHeight(parseInt(e.target.value) || 1024)} 
          min={512} 
          max={2048} 
          step={64} 
          disabled={isLoading} 
          className="glass-input bg-white/5 border-white/15"
        />
      </div>
    </div>
    
    {/* Quality Selector (if needed) */}
    <div>
      <Label htmlFor="quality" className="block text-sm font-medium mb-2 text-foreground/90">Quality</Label>
      <select 
        id="quality"
        value={quality}
        onChange={(e) => setQuality(e.target.value as any)}
        disabled={isLoading}
        className="w-full glass-input bg-white/5 border-white/15 rounded-lg px-3 py-2"
      >
        <option value="standard">Standard</option>
        <option value="high">High</option>
        <option value="ultra">Ultra</option>
      </select>
    </div>
  </>
)}
```

#### 7d. Update Validation

**Location:** handleSubmit function validation section (~line 220)

```typescript
// Validation based on generation mode
if (generationMode === 'kreaFluxPro') {
  // Krea Flux Pro - needs prompt
  if (!prompt.trim()) { 
    toast.error("Please enter a prompt."); 
    return; 
  }
} else if (generationMode === 'firstLastFrameVideo') {
  // ... existing validation
}
```

#### 7e. Update FormData Preparation

**Location:** Inside handleSubmit, FormData preparation section (~line 275)

```typescript
if (generationMode === 'kreaFluxPro') {
  // Krea Flux Pro
  formData.append('prompt', prompt);
  formData.append('width', width.toString());
  formData.append('height', height.toString());
  formData.append('quality', quality);
} else if (generationMode === 'image') {
  // ... existing Krea Flux logic
}
```

#### 7f. Update Button Validation

**Location:** Button disabled condition (~line 340)

```typescript
disabled={
  isLoading || 
  !userId || 
  userCredits < creditCost || 
  (isKreaFlux && !prompt.trim()) ||
  (generationMode === 'kreaFluxPro' && !prompt.trim()) || // Add this
  (isQwenEdit && !image1File && !image1Url) ||
  (isFirstLastMode && ((!startImageFile && !startImageUrl) || (!endImageFile && !endImageUrl) || !prompt.trim()))
}
```

### Step 8: Update Media Actions

**File:** [`src/lib/actions/media.actions.ts`](src/lib/actions/media.actions.ts)

#### 8a. Import New Type

**Location:** Import section (~line 15)

```typescript
import { 
  PIXIO_MODELS, 
  queuePixioRun, 
  cancelPixioRun,
  createRunRequest,
  type KreaFluxInputs,
  type KreaFluxProInputs, // Add this
  type WanFirstLastFrameInputs
} from '@/lib/pixio-api';
```

#### 8b. Extract FormData

**Location:** generateMedia function, input extraction (~line 40)

```typescript
let quality: 'standard' | 'high' | 'ultra' = 'high'; // Add for Pro model

if (generationMode === 'kreaFluxPro') {
  prompt = formData.get('prompt') as string;
  width = parseInt(formData.get('width') as string) || 1024;
  height = parseInt(formData.get('height') as string) || 1024;
  quality = formData.get('quality') as any || 'high';
  if (!prompt?.trim()) return { success: false, error: 'Missing prompt' };
} else if (generationMode === 'image') {
  // ... existing Krea Flux logic
}
```

#### 8c. Add to Model Selection

**Location:** Model selection switch (~line 125)

```typescript
if (generationMode === 'kreaFluxPro') {
  // Use Krea Flux Pro model
  selectedModel = PIXIO_MODELS.kreaFluxPro;
  const inputs: KreaFluxProInputs = {
    text: prompt,
    width,
    height,
    quality
  };
  const request = createRunRequest(selectedModel, inputs, {
    webhook: webhookUrl,
    webhookIntermediateStatus: false
  });
  
  console.log(`[Action] Calling Pixio API for mediaId: ${mediaId}, model: ${selectedModel.name}`);
  pixioResult = await queuePixioRun(request, apiKey);
  
} else if (generationMode === 'image') {
  // ... existing Krea Flux logic
}
```

#### 8d. Update Metadata Storage

**Location:** Update payload metadata (~line 109)

```typescript
metadata: { 
  generationMode,
  ...(generationMode === 'image' && { width, height }),
  ...(generationMode === 'kreaFluxPro' && { width, height, quality }), // Add this
  ...(positivePrompt && { positivePrompt, negativePrompt })
}
```

---

## Checklist for Adding a New Model

Use this checklist to ensure you've updated all necessary files:

### Backend Configuration
- [ ] Add input type interface in [`src/lib/pixio-api.ts`](src/lib/pixio-api.ts)
- [ ] Create model definition in [`src/lib/pixio-api.ts`](src/lib/pixio-api.ts)
- [ ] Add to `PIXIO_MODELS` export in [`src/lib/pixio-api.ts`](src/lib/pixio-api.ts)
- [ ] Add environment variable in [`env.example`](env.example)
- [ ] Add to `.env.local` with actual deployment ID

### Constants & Types
- [ ] Add to `GENERATION_MODES` in [`src/lib/constants/media.ts`](src/lib/constants/media.ts)
- [ ] Add to `CREDIT_COSTS` in [`src/lib/constants/media.ts`](src/lib/constants/media.ts)

### Frontend - Dashboard
- [ ] Import icon (if needed) in [`src/app/(app)/dashboard/page.tsx`](src/app/(app)/dashboard/page.tsx)
- [ ] Update TabsList grid columns in [`src/app/(app)/dashboard/page.tsx`](src/app/(app)/dashboard/page.tsx)
- [ ] Add TabsTrigger in [`src/app/(app)/dashboard/page.tsx`](src/app/(app)/dashboard/page.tsx)
- [ ] Add TabsContent in [`src/app/(app)/dashboard/page.tsx`](src/app/(app)/dashboard/page.tsx)

### Frontend - Generation Form
- [ ] Add state variables in [`src/components/dashboard/media-generation-form.tsx`](src/components/dashboard/media-generation-form.tsx)
- [ ] Add to input reset useEffect in [`src/components/dashboard/media-generation-form.tsx`](src/components/dashboard/media-generation-form.tsx)
- [ ] Add form input section in [`src/components/dashboard/media-generation-form.tsx`](src/components/dashboard/media-generation-form.tsx)
- [ ] Update validation logic in [`src/components/dashboard/media-generation-form.tsx`](src/components/dashboard/media-generation-form.tsx)
- [ ] Update FormData preparation in [`src/components/dashboard/media-generation-form.tsx`](src/components/dashboard/media-generation-form.tsx)
- [ ] Update button disabled condition in [`src/components/dashboard/media-generation-form.tsx`](src/components/dashboard/media-generation-form.tsx)

### Backend - Actions
- [ ] Import new type in [`src/lib/actions/media.actions.ts`](src/lib/actions/media.actions.ts)
- [ ] Add state variable declarations in [`src/lib/actions/media.actions.ts`](src/lib/actions/media.actions.ts)
- [ ] Add FormData extraction logic in [`src/lib/actions/media.actions.ts`](src/lib/actions/media.actions.ts)
- [ ] Add validation in [`src/lib/actions/media.actions.ts`](src/lib/actions/media.actions.ts)
- [ ] Add to model selection switch in [`src/lib/actions/media.actions.ts`](src/lib/actions/media.actions.ts)
- [ ] Update metadata storage in [`src/lib/actions/media.actions.ts`](src/lib/actions/media.actions.ts)

### Testing
- [ ] Test model in Pixio dashboard first
- [ ] Update `.env.local` with deployment ID
- [ ] Configure webhook URL in Pixio deployment
- [ ] Test generation end-to-end
- [ ] Verify Realtime updates work
- [ ] Test cancel functionality
- [ ] Verify credits deducted correctly

---

## Common Patterns

### Pattern 1: Image Generation Models (like Krea Flux)

**Typical Inputs:**
- `text` or `prompt` (required)
- `width` and `height` (optional with defaults)
- Model-specific parameters (quality, style, etc.)

**Media Type:** `'image'`

**Credit Cost:** Usually 5-20 credits

**Example Models:**
- Krea Flux
- FLUX Schnell
- Stable Diffusion variants

### Pattern 2: Image Editing Models (like Qwen Edit)

**Typical Inputs:**
- `image` or `image1` (required - URL to edit)
- `prompt` or `positive` (what to change)
- `negative` (what to avoid)
- Optional reference images

**Media Type:** `'image'` (editing still produces image)

**Credit Cost:** Usually 10-25 credits

**Example Models:**
- Qwen Edit
- InstructPix2Pix variants
- ControlNet models

### Pattern 3: Video Generation Models (like Wan 2.2)

**Typical Inputs:**
- Images (start/end frames or reference)
- `prompt` (describing motion/transition)
- Duration, FPS parameters

**Media Type:** `'video'`

**Credit Cost:** Usually 50-150 credits (videos are expensive)

**Example Models:**
- Wan 2.2 First/Last Frame
- Text-to-Video models
- Image-to-Video models

---

## File Structure Reference

```
src/
├── lib/
│   ├── pixio-api.ts          # Model definitions & API client
│   ├── constants/media.ts     # Generation modes & credit costs
│   └── actions/media.actions.ts # Server actions for generation
├── app/(app)/dashboard/
│   └── page.tsx               # Dashboard UI with tabs
└── components/dashboard/
    ├── media-generation-form.tsx # Form inputs per model
    └── media-library.tsx      # Display generated media
```

---

## Tips for Agents

1. **Always check the Pixio docs** for the model's exact input schema
2. **Match input names exactly** as shown in Pixio documentation
3. **Use descriptive variable names** that match the model's terminology
4. **Test locally first** before pushing to production
5. **Credit costs** should reflect computational complexity
6. **Update all files** - missing one breaks the flow
7. **Validate inputs** both client and server side
8. **Handle errors gracefully** with user-friendly messages

---

## Debugging New Models

### If generation doesn't start:
1. Check browser console for FormData validation errors
2. Verify deployment ID in `.env.local`
3. Check server logs for API call errors
4. Verify Pixio deployment is active

### If webhook doesn't receive updates:
1. Check ngrok is running (for local)
2. Verify webhook URL configured in Pixio
3. Check webhook endpoint logs
4. Verify run_id was stored in metadata

### If Realtime doesn't update:
1. Check Realtime connection in browser console
2. Verify database update succeeded
3. Check RLS policies allow updates
4. Ensure channel subscription is active

---

## Quick Reference: File Edit Locations

| File | Section | What to Add |
|------|---------|-------------|
| `pixio-api.ts` | Line ~50 | Input type interface |
| `pixio-api.ts` | Line ~190 | Model definition |
| `pixio-api.ts` | Line ~195 | Add to PIXIO_MODELS |
| `env.example` | Line ~25 | Environment variable |
| `constants/media.ts` | Line ~18 | Generation mode |
| `constants/media.ts` | Line ~12 | Credit cost |
| `dashboard/page.tsx` | Line ~12 | Icon import |
| `dashboard/page.tsx` | Line ~66 | Update grid cols |
| `dashboard/page.tsx` | Line ~100 | Tab trigger |
| `dashboard/page.tsx` | Line ~130 | Tab content |
| `media-generation-form.tsx` | Line ~118 | State variables |
| `media-generation-form.tsx` | Line ~170 | Reset useEffect |
| `media-generation-form.tsx` | Line ~330 | Input fields |
| `media-generation-form.tsx` | Line ~220 | Validation |
| `media-generation-form.tsx` | Line ~275 | FormData prep |
| `media-generation-form.tsx` | Line ~340 | Button disabled |
| `media.actions.ts` | Line ~15 | Import type |
| `media.actions.ts` | Line ~40 | Extract inputs |
| `media.actions.ts` | Line ~125 | Model selection |
| `media.actions.ts` | Line ~109 | Metadata storage |

---

## Success Criteria

Your new model is properly integrated when:

✅ Tab appears on dashboard with correct name and icon
✅ Form shows model-specific input fields
✅ Generation starts without errors
✅ Webhook receives and processes updates
✅ Media appears in library with correct status
✅ Credits deducted correctly
✅ Realtime updates work instantly
✅ Cancel button works for the new model

---

This guide ensures consistent, reliable model integration. Follow the checklist for each new model you add!