export type TagType =
  | '苦痛'
  | '違和感'
  | '欲求'
  | '気づき'
  | '閃き'
  | '兆し'
  | '夢';

export type IdeaCategory = 'saas' | 'product' | 'service';

export type Temperature = 'rising' | 'building' | 'sleeping';

export interface Memo {
  id: string;
  user_id: string;
  content: string;
  tag: TagType;
  hashtags: string[];
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  user_id: string;
  memo_id: string;
  generation_batch_id: string;
  category: IdeaCategory;
  title: string;
  niche_description: string;
  business_model: string;
  search_sources: string[];
  created_at: string;
}

export interface IdeaEvaluation {
  id: string;
  user_id: string;
  idea_id: string;
  status: 'interested' | 'meh' | null;
  interest_count: number;
  created_at: string;
  updated_at: string;
}

export interface ThemeCard {
  tag: TagType;
  memo_count: number;
  latest_at: string;
  excerpts: string[];
  temperature: Temperature;
  ideated_memo_count: number;
}
