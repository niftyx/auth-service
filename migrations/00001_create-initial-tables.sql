CREATE TABLE IF NOT EXISTS public.users (
    "id" character varying NOT NULL,
    "address" character varying NOT NULL,
    "name" character varying NOT NULL,
    "custom_url" character varying NOT NULL,
    "image_url" character varying NOT NULL,
    "header_image_url" character varying NOT NULL,
    "bio" character varying NOT NULL,
    "twitter_username" character varying NOT NULL,
    "twitter_verified" boolean NOT NULL,
    "twitch_username" character varying NOT NULL,
    "facebook_username" character varying NOT NULL,
    "youtube_username" character varying NOT NULL,
    "instagram_username" character varying NOT NULL,
    "tiktok_username" character varying NOT NULL,
    "personal_site" character varying NOT NULL,
    "create_time_stamp" integer NOT NULL,
    "update_time_stamp" integer NOT NULL,
    PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS public.refresh_tokens (
    refresh_token character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    PRIMARY KEY ("refresh_token")
);
ALTER TABLE "refresh_tokens"
ADD "user_id" character varying NOT NULL;
ALTER TABLE "refresh_tokens"
ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");