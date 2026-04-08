import { useState, useEffect, useCallback } from 'react';

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  relevanceScore: number;
  date: string;
  category: string;
  content?: string;
}

interface UseNewsOptions {
  category?: string;
  sentiment?: string;
  autoFetch?: boolean;
}

export function useNews(options: UseNewsOptions = {}) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(
    async (query?: string) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (options.category) {
          params.append('category', options.category);
        }
        if (options.sentiment) {
          params.append('sentiment', options.sentiment);
        }

        const endpoint = query
          ? `/api/news?${params.toString()}`
          : `/api/news?${params.toString()}`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const result = await response.json();
        setNews(result.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
        setNews([]);
      } finally {
        setLoading(false);
      }
    },
    [options.category, options.sentiment]
  );

  const searchNews = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to search news');
      }

      const result = await response.json();
      setNews(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeSentiment = (article: NewsArticle) => {
    // Helper function to determine if news is relevant to farming
    const farmingKeywords = [
      'panen',
      'tanaman',
      'petani',
      'pertanian',
      'lahan',
      'cuaca',
      'hasil',
      'pupuk',
      'air',
      'hama',
    ];

    const isRelevant = farmingKeywords.some((keyword) =>
      article.title.toLowerCase().includes(keyword) ||
      article.summary.toLowerCase().includes(keyword)
    );

    return isRelevant
      ? article.relevanceScore
      : article.relevanceScore * 0.5;
  };

  const getSentimentStats = useCallback(() => {
    return {
      positive: news.filter((n) => n.sentiment === 'positive').length,
      negative: news.filter((n) => n.sentiment === 'negative').length,
      neutral: news.filter((n) => n.sentiment === 'neutral').length,
    };
  }, [news]);

  const getImpactStats = useCallback(() => {
    return {
      high: news.filter((n) => n.impact === 'high').length,
      medium: news.filter((n) => n.impact === 'medium').length,
      low: news.filter((n) => n.impact === 'low').length,
    };
  }, [news]);

  // Auto-fetch on component mount or when options change
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchNews();
    }
  }, [fetchNews, options.autoFetch]);

  return {
    news,
    loading,
    error,
    fetchNews,
    searchNews,
    analyzeSentiment,
    getSentimentStats,
    getImpactStats,
  };
}
