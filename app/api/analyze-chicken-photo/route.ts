import { NextRequest, NextResponse } from 'next/server';
import { processGeminiResponse } from '@/lib/disease-detector';

async function fetchWithRetry(url: string, options: RequestInit, retries = 4, delay = 500): Promise<Response> {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      // Retry only for 503 / 429
      if ((res.status === 503 || res.status === 429) && retries > 0) {
        await new Promise(res => setTimeout(res, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
    }

    return res;
  } catch (err) {
    if (retries > 0) {
      await new Promise(res => setTimeout(res, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw err;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // ⚡ OPTIONAL: batasi ukuran base64 (biar gak berat)
    if (image.length > 2_000_000) {
      return NextResponse.json(
        { error: 'Image terlalu besar, max ~1.5MB' },
        { status: 400 }
      );
    }

    const geminiResponse = await fetchWithRetry(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GOOGLE_API_KEY || '',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Anda adalah dokter hewan ahli ayam.

Analisis gambar ayam ini secara singkat dan jelas:

Output WAJIB JSON:
{
  "detected": boolean,
  "diseases": ["nama penyakit"],
  "symptoms": ["gejala visual"],
  "overallHealth": "good | warning | critical",
  "recommendations": ["saran"]
}`
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4, // 🔥 lebih stabil (kurangi halusinasi)
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);

      return NextResponse.json({
        detected: false,
        diseases: [],
        overallHealth: 'unknown',
        recommendations: [
          'AI sedang sibuk, coba lagi dalam beberapa detik',
        ],
      });
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    console.log('Gemini RAW:', rawText);

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // fallback kalau JSON gagal
      parsed = processGeminiResponse(rawText);
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Error analyzing photo:', error);

    return NextResponse.json({
      detected: false,
      diseases: [],
      overallHealth: 'unknown',
      recommendations: [
        'Terjadi error sistem',
        'Coba upload ulang gambar',
      ],
    });
  }
}