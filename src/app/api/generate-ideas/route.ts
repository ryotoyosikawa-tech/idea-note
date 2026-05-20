import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { memo } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL ?? 'gemini-2.5-pro',
      tools: [{ googleSearch: {} } as never],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 3000,
        responseMimeType: 'application/json',
      },
    });

    const prompt = `あなたは熟練の事業コンサルタントです。
以下のメモを起点に、3つのカテゴリで各2案ずつ、計6案の事業アイデアを生成してください。

【メモ】
タグ: #${memo.tag}
本文: ${memo.content}

【出力形式】
JSON形式で以下の構造で出力してください:

{
  "ideas": [
    {
      "category": "saas",
      "title": "アイデア名(1行で簡潔・キャッチー)",
      "niche_description": "既存サービスの固有名を1つ以上挙げ、それと差別化する穴場ポジションを2行で説明",
      "business_model": "単価×ユーザー数=月収推定を具体的数字で2行で記述"
    }
  ]
}

【カテゴリ(必ずこの順序で各2案ずつ)】
- "saas": アプリ・Web開発による解決(2案)
- "product": 物販・ハードウェア・IoTによる解決(2案)
- "service": コンサル・代行・コーチング等のサービスによる解決(2案)

【条件】
- Google検索を最低1回使用して、既存サービスの固有名を確認すること
- 既存サービスの社名・サービス名は必ず固有名で挙げる
- 試算は具体的な数字(月収◯円、ユーザー◯人、客単価◯円など)
- 各案のテキストは5〜7行で簡潔に
- 日本国内のサービスを中心に考えるが、海外事例も適宜参照`;

    const result = await model.generateContent(prompt);
    const ideas = JSON.parse(result.response.text()).ideas;

    return NextResponse.json({ ideas });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
