-- profiles
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name varchar,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own profile"
  ON profiles FOR ALL
  USING (auth.uid() = id);

-- memos
CREATE TABLE memos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  tag varchar NOT NULL CHECK (tag IN ('苦痛','違和感','欲求','気づき','閃き','兆し','夢')),
  hashtags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_memos_user_created ON memos (user_id, created_at DESC);
CREATE INDEX idx_memos_user_tag_created ON memos (user_id, tag, created_at DESC);
CREATE INDEX idx_memos_hashtags ON memos USING GIN (hashtags);

ALTER TABLE memos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own memos"
  ON memos FOR ALL
  USING (auth.uid() = user_id);

-- ideas
CREATE TABLE ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  memo_id uuid NOT NULL REFERENCES memos(id) ON DELETE CASCADE,
  generation_batch_id uuid NOT NULL,
  category varchar NOT NULL CHECK (category IN ('saas','product','service')),
  title varchar NOT NULL,
  niche_description text,
  business_model text,
  search_sources text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_ideas_user_created ON ideas (user_id, created_at DESC);
CREATE INDEX idx_ideas_memo ON ideas (memo_id);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own ideas"
  ON ideas FOR ALL
  USING (auth.uid() = user_id);

-- idea_evaluations
CREATE TABLE idea_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  idea_id uuid NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  status varchar CHECK (status IN ('interested','meh')),
  interest_count int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, idea_id)
);

ALTER TABLE idea_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own evaluations"
  ON idea_evaluations FOR ALL
  USING (auth.uid() = user_id);

-- profiles の自動作成 trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
