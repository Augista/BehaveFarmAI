import { NextRequest, NextResponse } from 'next/server';

// Mock news data - in production, this would fetch from real news APIs
const mockNews = [
  {
    id: '1',
    title: 'Teknologi AI Tingkatkan Hasil Panen hingga 40%',
    source: 'Pertanian Indonesia',
    summary:
      'Penelitian terbaru menunjukkan bahwa penggunaan AI dalam pertanian dapat meningkatkan produktivitas lahan secara signifikan.',
    sentiment: 'positive' as const,
    impact: 'high' as const,
    relevanceScore: 0.95,
    date: new Date().toISOString(),
    category: 'teknologi',
    content:
      'Dengan memanfaatkan machine learning dan computer vision, petani dapat memonitor kesehatan tanaman secara real-time dan mengambil tindakan preventif yang lebih cepat dan akurat.',
  },
  {
    id: '2',
    title: 'Perubahan Cuaca Ekstrem Mempengaruhi Panen Musim Ini',
    source: 'Badan Meteorologi',
    summary:
      'Prakiraan cuaca menunjukkan potensi hujan lebat yang dapat mempengaruhi jadwal panen di beberapa wilayah.',
    sentiment: 'negative' as const,
    impact: 'high' as const,
    relevanceScore: 0.88,
    date: new Date(Date.now() - 86400000).toISOString(),
    category: 'cuaca',
    content:
      'BMKG telah mengeluarkan peringatan cuaca ekstrem untuk wilayah Jawa Timur dan Bali dengan potensi curah hujan hingga 250mm.',
  },
  {
    id: '3',
    title: 'Harga Pupuk Organik Turun 15% di Pasar',
    source: 'Pusat Informasi Pertanian',
    summary:
      'Ketersediaan pupuk organik lokal meningkat, menyebabkan penurunan harga yang menguntungkan petani.',
    sentiment: 'positive' as const,
    impact: 'medium' as const,
    relevanceScore: 0.82,
    date: new Date(Date.now() - 172800000).toISOString(),
    category: 'pasar',
    content:
      'Produksi pupuk organik lokal dari limbah pertanian meningkat drastis seiring dengan program subsidi pemerintah.',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const sentiment = searchParams.get('sentiment');

    let filteredNews = [...mockNews];

    // Filter by category if provided
    if (category && category !== 'all') {
      filteredNews = filteredNews.filter((item) => item.category === category);
    }

    // Filter by sentiment if provided
    if (sentiment && sentiment !== 'all') {
      filteredNews = filteredNews.filter(
        (item) => item.sentiment === sentiment
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredNews,
      count: filteredNews.length,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Fetch news from multiple sources (NewsAPI, RSS feeds, etc.)
    // 2. Use Gemini API to analyze sentiment and relevance
    // 3. Store results in Supabase
    // 4. Return structured data

    // For now, return mock data based on query
    const analyzedNews = mockNews.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.summary.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json({
      success: true,
      query,
      data: analyzedNews,
      count: analyzedNews.length,
    });
  } catch (error) {
    console.error('Error analyzing news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze news' },
      { status: 500 }
    );
  }
}
