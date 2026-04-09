import { NextRequest, NextResponse } from 'next/server';
import { processGeminiResponse, DISEASE_DATABASE } from '@/lib/disease-detector';

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 4,
  delay = 500
): Promise<Response> {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      if ((res.status === 503 || res.status === 429) && retries > 0) {
        await new Promise(r => setTimeout(r, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
    }

    return res;
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw err;
  }
}

function extractPartialJSON(text: string) {
  try {
    let cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const start = cleaned.indexOf('{');
    if (start === -1) return null;

    let jsonString = cleaned.substring(start);

    while (jsonString.length > 0) {
      try {
        return JSON.parse(jsonString);
      } catch (e) {
        jsonString = jsonString.slice(0, -1); 
      }
    }

    return null;
  } catch (err) {
    console.error('Partial JSON parse failed:', err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, '');

    if (cleanBase64.length > 2_000_000) {
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
                  text: `Anda adalah dokter hewan ahli ayam indonesia.

WAJIB OUTPUT JSON VALID TANPA PENJELASAN TAMBAHAN:
WAJIB:
- Output HARUS JSON VALID
- TANPA markdown
- TANPA penjelasan
- JANGAN TERPOTONG
JANGAN LEBIH DARI 3 ITEM PER ARRAY
OUTPUT HARUS KURANG DARI 500 TOKEN

FORMAT:
{
  "detected": true | false
  "diseases": ["nama penyakit"]
  "symptoms": ["gejala"]
  "overallHealth": "good | warning | critical"
  "recommendations": ["saran"]
}`              },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: cleanBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
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
        recommendations: ['AI sedang sibuk, coba lagi'],
      });
    }

    const geminiData = await geminiResponse.json();

    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    console.log('Gemini RAW:', rawText);

    let parsed = extractPartialJSON(rawText);

    // if (!parsed) {
    //   parsed = processGeminiResponse(rawText);
    // }
    if (!parsed) {
  // 🚨 fallback cerdas dari raw text
  parsed = {
    detected: rawText.toLowerCase().includes('penyakit') || rawText.toLowerCase().includes('infeksi'),
    diseases: [],
    symptoms: [],
    overallHealth: 'warning',
    recommendations: [
      'Hasil AI tidak lengkap, ulangi analisis',
      'Pastikan gambar jelas dan fokus',
    ],
  };
}

    if (parsed?.diseases && Array.isArray(parsed.diseases)) {
      parsed.diseases = parsed.diseases.map((diseaseName: string) => {
        const dbDisease = (DISEASE_DATABASE as any)[diseaseName];

        if (dbDisease) {
          return {
            name: diseaseName,
            confidence: 75,
            visualSigns: dbDisease.visualSigns.slice(0, 4),
            immediateActions: [
              'Isolasi ayam',
              'Cek kandang',
              'Hubungi dokter hewan',
            ],
            preventive: dbDisease.preventive,
            curative: dbDisease.curative,
            medicineRecommendations: dbDisease.medicines.map((med: any) => ({
              type: med.type,
              medicine: med.name,
              dosage: med.dosage,
              duration: med.duration,
              notes: med.notes,
            })),
          };
        }

        return {
          name: diseaseName,
          confidence: 70,
          visualSigns: parsed.symptoms || [],
          immediateActions: [
            'Konsultasi dokter hewan',
            'Isolasi ayam',
          ],
          preventive: ['Jaga kebersihan kandang'],
          curative: ['Ikuti saran dokter'],
          medicineRecommendations: [],
        };
      });
    }

    const validHealth = ['good', 'warning', 'critical', 'unknown'];
    if (!validHealth.includes(parsed?.overallHealth)) {
      parsed.overallHealth = parsed?.detected ? 'warning' : 'good';
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error analyzing photo:', error);

    return NextResponse.json({
      detected: false,
      diseases: [],
      overallHealth: 'unknown',
      recommendations: ['Terjadi error sistem'],
    });
  }
}

function extractJSON(rawText: any) {
  throw new Error('Function not implemented.');
}
