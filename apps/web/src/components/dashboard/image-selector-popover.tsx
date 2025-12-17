// src/components/dashboard/image-selector-popover.tsx
'use client';

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@repo/ui/utils";
import { Button } from "@repo/ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui";
// Import the NEW server action
import { listUserImagesForSelection } from "@/lib/actions/media.actions";
import NextImage from "next/image";
import { toast } from "sonner"; // Import toast for error handling

interface ImageOption {
  value: string; // URL
  label: string; // Filename or prompt
  type: 'generated' | 'input';
}

interface ImageSelectorPopoverProps {
  selectedUrl: string | null;
  onImageSelect: (url: string | null) => void;
  triggerText?: string;
  disabled?: boolean;
}

export function ImageSelectorPopover({
  selectedUrl,
  onImageSelect,
  triggerText = "Select Image",
  disabled = false,
}: ImageSelectorPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [images, setImages] = React.useState<ImageOption[]>([]);
  const hasFetched = React.useRef(false); // Track if fetch has been attempted

  // Fetch images when popover opens
  React.useEffect(() => {
    // Only fetch if popover is open AND fetch hasn't been attempted yet
    if (open && !hasFetched.current) {
      const fetchImages = async () => {
        setLoading(true);
        hasFetched.current = true; // Mark fetch as attempted
        try {
          // Call the SERVER ACTION
          const result = await listUserImagesForSelection();

          if (result.success) {
            setImages(result.images);
          } else {
            console.error("Failed to fetch images:", result.error);
            toast.error("Could not load existing images.");
            setImages([]); // Clear images on error
          }
        } catch (error) {
          console.error("Error calling listUserImagesForSelection:", error);
          toast.error("An error occurred while loading images.");
          setImages([]); // Clear images on error
        } finally {
          setLoading(false);
        }
      };
      fetchImages();
    } else if (!open) {
        // Reset fetch tracker when popover closes, allowing refetch next time
        hasFetched.current = false;
    }
  }, [open]); // Depend only on open state

  const selectedLabel = images.find((image) => image.value === selectedUrl)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-1/2 justify-between glass-input bg-white/5 border-white/15 hover:bg-white/10 text-foreground/80"
          disabled={disabled}
          title={selectedLabel ?? triggerText}
        >
          <span className="truncate">
            {selectedUrl && selectedLabel
              ? selectedLabel
              : triggerText}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0 glass-card">
        <Command>
          <CommandInput placeholder="Search images..." />
          <CommandList>
            {loading ? (
              <div className="py-6 text-center text-sm flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading images...
              </div>
            ) : (
              <>
                <CommandEmpty>No images found.</CommandEmpty>
                {/* Group for Input Images */}
                {images.some(img => img.type === 'input') && (
                    <CommandGroup heading="Uploaded Inputs">
                      {images.filter(img => img.type === 'input').map((image) => (
                        <CommandItem
                          key={image.value}
                          value={image.label}
                          onSelect={() => {
                            onImageSelect(image.value === selectedUrl ? null : image.value);
                            setOpen(false);
                          }}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <NextImage src={image.value} alt={image.label} width={24} height={24} className="h-6 w-6 rounded object-cover flex-shrink-0 border border-white/10" />
                          <span className="truncate flex-grow">{image.label}</span>
                          <Check className={cn("ml-auto h-4 w-4", selectedUrl === image.value ? "opacity-100" : "opacity-0")} />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                )}
                {/* Separator if both groups exist */}
                {images.some(img => img.type === 'input') && images.some(img => img.type === 'generated') && (
                    <CommandSeparator />
                )}
                {/* Group for Generated Images */}
                {images.some(img => img.type === 'generated') && (
                    <CommandGroup heading="Generated Images">
                      {images.filter(img => img.type === 'generated').map((image) => (
                        <CommandItem
                          key={image.value}
                          value={image.label}
                          onSelect={() => {
                            onImageSelect(image.value === selectedUrl ? null : image.value);
                            setOpen(false);
                          }}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <NextImage src={image.value} alt={image.label} width={24} height={24} className="h-6 w-6 rounded object-cover flex-shrink-0 border border-white/10" />
                          <span className="truncate flex-grow">{image.label}</span>
                          <Check className={cn("ml-auto h-4 w-4", selectedUrl === image.value ? "opacity-100" : "opacity-0")} />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
