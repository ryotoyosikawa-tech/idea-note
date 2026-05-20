-- Neon Auth (Stack) は neon_auth.users_sync テーブルにユーザーを自動同期する
-- 各テーブルの user_id はその id (text) を参照する

CREATE TABLE memos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  content text NOT NULL,
  tag varchar NOT NULL CHECK (tag IN ('苦痛','違和感','欲求','気づき','閃き','兆し','夢')),
  hashtags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_memos_user_created ON memos (user_id, created_at DESC);
CREATE INDEX idx_memos_user_tag_created ON memos (user_id, tag, created_at DESC);
CREATE INDEX idx_memos_hashtags ON memos USING GIN (hashtags);

CREATE TABLE ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  memo_id uuid NOT NULL REFERENCES memos(id) ON DELETE CASCADE,
  generation_batch_id uuid NOT NULL,
  category varchar NOT NULL CHECK (category IN ('saas','product','service')),
  title varchar NOT NULL,
  niche_description text,
  business_model text,
  search_sources text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ideas_user_created ON ideas (user_id, created_at DESC);
CREATE INDEX idx_ideas_memo ON ideas (memo_id);

CREATE TABLE idea_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  idea_id uuid NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  status varchar CHECK (status IN ('interested','meh')),
  interest_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, idea_id)
);

CREATE INDEX idx_evaluations_user_status ON idea_evaluations (user_id, status);
