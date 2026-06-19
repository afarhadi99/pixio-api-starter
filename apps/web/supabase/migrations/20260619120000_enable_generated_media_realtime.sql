-- Enable Supabase Realtime for generated_media (INSERT/UPDATE/DELETE).
-- Without this, the dashboard library only updates after a manual refresh.

ALTER TABLE public.generated_media REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'generated_media'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.generated_media;
  END IF;
END $$;
