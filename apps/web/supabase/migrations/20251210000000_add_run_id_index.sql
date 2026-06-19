-- Add index for faster run_id lookups in webhook handler
-- This improves performance when Pixio webhooks need to find the media record by run_id

CREATE INDEX IF NOT EXISTS idx_generated_media_metadata_run_id 
ON public.generated_media ((metadata->>'run_id'))
WHERE metadata->>'run_id' IS NOT NULL;

-- Add comment for documentation
COMMENT ON INDEX idx_generated_media_metadata_run_id IS 
'Index for fast lookups of media records by run_id stored in metadata JSONB column. Used by Pixio webhook handler.';