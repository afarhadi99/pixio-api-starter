-- Create the generated-media storage bucket used for:
--   - AI output files (webhook uploads via service role)
--   - User input images (client uploads to {user_id}/inputs/...)
--   - Generated images/videos at {user_id}/images|videos/...

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'generated-media',
  'generated-media',
  true,
  52428800, -- 50 MiB
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies (idempotent)
DROP POLICY IF EXISTS "generated_media_public_read" ON storage.objects;
DROP POLICY IF EXISTS "generated_media_user_insert" ON storage.objects;
DROP POLICY IF EXISTS "generated_media_user_update" ON storage.objects;
DROP POLICY IF EXISTS "generated_media_user_delete" ON storage.objects;

-- Public bucket: anyone can read objects (matches public = true)
CREATE POLICY "generated_media_public_read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'generated-media');

-- Authenticated users can upload only under their own top-level folder (auth.uid())
CREATE POLICY "generated_media_user_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'generated-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "generated_media_user_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'generated-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'generated-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "generated_media_user_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'generated-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
