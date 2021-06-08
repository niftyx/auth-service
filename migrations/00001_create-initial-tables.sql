CREATE TABLE IF NOT EXISTS public.refresh_tokens (
    refresh_token character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    PRIMARY KEY ("refresh_token")
);
ALTER TABLE "refresh_tokens"
ADD "user_id" character varying NOT NULL;