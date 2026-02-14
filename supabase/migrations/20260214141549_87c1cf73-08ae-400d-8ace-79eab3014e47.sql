
-- Track theme usage (anonymous, no auth required)
CREATE TABLE public.theme_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  theme TEXT NOT NULL,
  is_recommended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow anonymous inserts and public reads
ALTER TABLE public.theme_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert theme usage"
ON public.theme_usage
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view theme usage stats"
ON public.theme_usage
FOR SELECT
USING (true);
