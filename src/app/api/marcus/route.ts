import { NextRequest, NextResponse } from 'next/server';
import { MarcusApiRequest } from '@/types';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';

export async function POST(request: NextRequest) {
  try {
    const body: MarcusApiRequest = await request.json();
    const { history, systemInstruction } = body;

    if (!history || !Array.isArray(history)) {
      return NextResponse.json(
        { error: 'History array is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // CRITICAL DEBUGGING: Log model and history length
    console.log(`[Marcus API] Model: ${GEMINI_MODEL}`);
    console.log(`[Marcus API] History length: ${history.length} messages`);

    // Build contents array with system instruction prepended
    const contents = [
      {
        role: 'user',
        parts: [{ text: systemInstruction }],
      },
      {
        role: 'model',
        parts: [
          {
            text: 'I understand. I am Marcus Omega, ready to engage in philosophical discourse.',
          },
        ],
      },
      ...history,
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 400,
            topP: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Marcus API] Gemini API Error: ${response.status}`, errorText);
      throw new Error(`Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I find myself in contemplative silence...';

    console.log(`[Marcus API] Response received successfully`);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('[Marcus API] Error:', error);
    return NextResponse.json(
      { reply: 'The philosophical networks seem clouded at the moment...' },
      { status: 500 }
    );
  }
}
