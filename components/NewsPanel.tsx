'use client';

import React, { useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';
import { useNews } from '@/hooks/useNews';
import { geminiAnalyzer } from '@/lib/gemini-analyzer';
import { Newspaper, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  relevanceScore: number;
  date: string;
  category: string;
}

interface NewsPanelProps {
  language?: Language;
}

export function NewsPanel({ language = 'id' }: NewsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [analyzedNews, setAnalyzedNews] = useState<NewsArticle[]>([]);
  const t = translations[language];

  // Use the news hook to fetch and manage news
  const { news, loading, fetchNews } = useNews({
    autoFetch: true,
  });

  // Sample news data for fallback
  const sampleNews: NewsArticle[] = [
    {
      id: '1',
      title: 'Teknologi AI Tingkatkan Hasil Panen hingga 40%',
      source: 'Pertanian Indonesia',
      summary:
        'Penelitian terbaru menunjukkan bahwa penggunaan AI dalam pertanian dapat meningkatkan produktivitas lahan secara signifikan.',
      sentiment: 'positive',
      impact: 'high',
      relevanceScore: 0.95,
      date: '2024-04-08',
      category: 'teknologi',
    },
    {
      id: '2',
      title: 'Perubahan Cuaca Ekstrem Mempengaruhi Panen Musim Ini',
      source: 'Badan Meteorologi',
      summary:
        'Prakiraan cuaca menunjukkan potensi hujan lebat yang dapat mempengaruhi jadwal panen di beberapa wilayah.',
      sentiment: 'negative',
      impact: 'high',
      relevanceScore: 0.88,
      date: '2024-04-07',
      category: 'cuaca',
    },
    {
      id: '3',
      title: 'Harga Pupuk Organik Turun 15% di Pasar',
      source: 'Pusat Informasi Pertanian',
      summary:
        'Ketersediaan pupuk organik lokal meningkat, menyebabkan penurunan harga yang menguntungkan petani.',
      sentiment: 'positive',
      impact: 'medium',
      relevanceScore: 0.82,
      date: '2024-04-06',
      category: 'pasar',
    },
    {
      id: '4',
      title: 'Serangan Hama Padi Dilaporkan di 3 Provinsi',
      source: 'Dinas Pertanian',
      summary:
        'Deteksi dini serangan hama padi memungkinkan pengendalian lebih cepat dan pencegahan kerugian lebih besar.',
      sentiment: 'negative',
      impact: 'high',
      relevanceScore: 0.85,
      date: '2024-04-05',
      category: 'kesehatan',
    },
  ];

  useEffect(() => {
    // Analyze news with Gemini analyzer if we have news data
    const analyzeNews = async () => {
      const newsToAnalyze = news.length > 0 ? news : sampleNews;
      
      // Batch analyze all articles
      const analyses = await Promise.all(
        newsToAnalyze.map((article) =>
          geminiAnalyzer.analyzeArticle(
            article.title,
            article.summary,
            article.title
          )
        )
      );

      // Merge analysis results with news articles
      const enrichedNews = newsToAnalyze.map((article, index) => ({
        ...article,
        sentiment: analyses[index]?.sentiment || article.sentiment,
        impact: analyses[index]?.harvestImpact || article.impact,
        relevanceScore: analyses[index]?.relevanceScore || article.relevanceScore,
      }));

      setAnalyzedNews(enrichedNews);
    };

    if (news.length > 0 || sampleNews.length > 0) {
      analyzeNews();
    }
  }, [news]);

  const displayNews = analyzedNews.length > 0 ? analyzedNews : sampleNews;
  const filteredNews =
    selectedCategory === 'all'
      ? displayNews
      : displayNews.filter((item) => item.category === selectedCategory);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="text-green-500" size={16} />;
      case 'negative':
        return <TrendingDown className="text-red-500" size={16} />;
      default:
        return <AlertCircle className="text-yellow-500" size={16} />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    const colors = {
      positive: 'bg-green-100 text-green-800',
      negative: 'bg-red-100 text-red-800',
      neutral: 'bg-yellow-100 text-yellow-800',
    };
    return colors[sentiment as keyof typeof colors] || colors.neutral;
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[impact as keyof typeof colors] || colors.low;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Newspaper className="text-emerald-600" size={24} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {t.news.title}
            </h2>
            <p className="text-gray-600 text-sm">{t.news.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'teknologi', label: 'Teknologi' },
          { id: 'cuaca', label: 'Cuaca' },
          { id: 'pasar', label: 'Pasar' },
          { id: 'kesehatan', label: 'Kesehatan' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* News List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t.common.loading}</p>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t.news.noNews}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNews.map((article) => (
            <div
              key={article.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Article Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Sumber: {article.source} • {new Date(article.date).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {getSentimentIcon(article.sentiment)}
                </div>
              </div>

              {/* Article Summary */}
              <p className="text-gray-700 text-sm mb-3">{article.summary}</p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 items-center">
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${getSentimentBadge(article.sentiment)}
                  `}
                >
                  {article.sentiment === 'positive'
                    ? t.news.positive
                    : article.sentiment === 'negative'
                      ? t.news.negative
                      : t.news.neutral}
                </span>
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${getImpactBadge(article.impact)}
                  `}
                >
                  Dampak {article.impact.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {t.news.relevantNews}: {(article.relevanceScore * 100).toFixed(0)}%
                </span>
              </div>

              {/* Read More Button */}
              <button className="mt-3 text-emerald-600 font-medium text-sm hover:text-emerald-700">
                {t.news.readMore} →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {displayNews.filter((n) => n.sentiment === 'positive').length}
          </p>
          <p className="text-xs text-gray-600 mt-1">{t.news.positive}</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">
            {displayNews.filter((n) => n.sentiment === 'negative').length}
          </p>
          <p className="text-xs text-gray-600 mt-1">{t.news.negative}</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {displayNews.filter((n) => n.sentiment === 'neutral').length}
          </p>
          <p className="text-xs text-gray-600 mt-1">{t.news.neutral}</p>
        </div>
      </div>
    </div>
  );
}
