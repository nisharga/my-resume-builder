import { GEMINI_KEY } from "@/config";
import type { CVData } from "@/types/cv";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_KEY}`;

const PROMPT = `
You are a resume parser. Extract all information from this PDF resume and return ONLY a valid JSON object.

Return exactly this structure (no markdown, no explanation, raw JSON only):
{
  "template": "sidebar",
  "accent": "#2B5F75",
  "personal": {
    "name": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "portfolio": "",
    "linkedin": ""
  },
  "summary": "",
  "experience": [
    {
      "id": "exp1",
      "role": "",
      "company": "",
      "start": "",
      "end": "",
      "desc": "bullet one\nbullet two\nbullet three"
    }
  ],
  "education": [
    {
      "id": "edu1",
      "degree": "",
      "school": "",
      "start": "",
      "end": ""
    }
  ],
  "skills": ["skill1", "skill2"],
  "achievements": [
    {
      "id": "ach1",
      "name": "Achievement & Reward",
      "enabled": false,
      "value": ""
    }
  ]
}

Rules:
- Keep "template" as "sidebar" and "accent" as "#2B5F75"
- experience "desc": write each bullet on a new line separated by \\n
- If a field is not found, leave it as an empty string
- skills: array of plain strings
- Return ONLY the JSON, nothing else
`;

const RETRY_DELAYS_MS = [2000, 5000, 10000]; // 2s, 5s, 10s

async function callGemini(base64Pdf: string): Promise<Response> {
  const body = JSON.stringify({
    contents: [
      {
        parts: [{ inlineData: { mimeType: "application/pdf", data: base64Pdf } }, { text: PROMPT }],
      },
    ],
    generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
  });

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    // Retry only on 503 (overloaded) or 429 (rate limit)
    if ((response.status === 503 || response.status === 429) && attempt < RETRY_DELAYS_MS.length) {
      const delay = RETRY_DELAYS_MS[attempt];
      console.warn(
        `Gemini ${response.status} — retrying in ${delay / 1000}s (attempt ${attempt + 1})`,
      );
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }

    return response;
  }

  // Unreachable but satisfies TypeScript
  throw new Error("Gemini: max retries exceeded");
}

export async function parseResumeWithAI(
  base64Pdf: string,
): Promise<Omit<CVData, "id" | "updatedAt">> {
  const response = await callGemini(base64Pdf);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const json = await response.json();
  const text: string = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  const clean = text
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(clean) as Omit<CVData, "id" | "updatedAt">;
}
