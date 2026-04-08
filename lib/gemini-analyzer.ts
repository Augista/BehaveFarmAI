// Gemini AI Analyzer for agricultural news
// This utility provides interfaces for Gemini API integration
// In production, you would need to add your Gemini API key to environment variables

export interface NewsAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number; // -1 to 1
  relevanceScore: number; // 0 to 1
  keyTopics: string[];
  harvestImpact: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface GeminiAnalyzerConfig {
  apiKey?: string;
  model?: string;
}

export class GeminiNewsAnalyzer {
  private apiKey: string | undefined;
  private model: string;

  constructor(config?: GeminiAnalyzerConfig) {
    this.apiKey = config?.apiKey || process.env.GEMINI_API_KEY;
    this.model = config?.model || 'gemini-2.5-flash';
  }

  /**
   * Analyze a news article for sentiment and relevance to agriculture
   */
  async analyzeArticle(
    title: string,
    content: string,
    summary?: string
  ): Promise<NewsAnalysisResult> {
    // Local analysis - no API call needed for basic functionality
    return this.localAnalyze(title, content, summary);
  }

  /**
   * Local sentiment and relevance analysis without API calls
   * Useful for demo purposes without API keys
   */
  private localAnalyze(
    title: string,
    content: string,
    summary?: string
  ): NewsAnalysisResult {
    const fullText = `${title} ${content} ${summary || ''}`.toLowerCase();

    // Keywords for sentiment analysis
    const positiveKeywords = [
      'meningkat',
      'naik',
      'sukses',
      'bagus',
      'baik',
      'untung',
      'keuntungan',
      'berkembang',
      'maju',
      'positif',
      'inovasi',
      'teknologi',
    ];
    const negativeKeywords = [
      'menurun',
      'turun',
      'rugi',
      'kerugian',
      'gagal',
      'masalah',
      'krisis',
      'bencana',
      'negatif',
      'ancaman',
      'bahaya',
      'hama',
      'penyakit',
    ];

    // Keywords for agricultural relevance
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
      'sayuran',
      'padi',
      'jagung',
      'kedelai',
      'gandum',
      'tebu',
      'irigasi',
      'musim',
      'hujan',
      'suhu',
      'kelembapan',
    ];

    // Count sentiment indicators
    const positiveCount = positiveKeywords.filter((word) =>
      fullText.includes(word)
    ).length;
    const negativeCount = negativeKeywords.filter((word) =>
      fullText.includes(word)
    ).length;

    // Determine sentiment
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let sentimentScore = 0;

    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      sentimentScore = Math.min(positiveCount / 5, 1);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      sentimentScore = -Math.min(negativeCount / 5, 1);
    } else if (positiveCount > 0 || negativeCount > 0) {
      sentimentScore = (positiveCount - negativeCount) / 10;
    }

    // Calculate farming relevance
    const relevantKeywordCount = farmingKeywords.filter((word) =>
      fullText.includes(word)
    ).length;
    const relevanceScore = Math.min(relevantKeywordCount / 5, 1);

    // Extract key topics
    const keyTopics: string[] = [];
    if (fullText.includes('cuaca') || fullText.includes('hujan')) {
      keyTopics.push('Cuaca');
    }
    if (fullText.includes('hama') || fullText.includes('penyakit')) {
      keyTopics.push('Kesehatan Tanaman');
    }
    if (fullText.includes('pupuk') || fullText.includes('nutrisi')) {
      keyTopics.push('Nutrisi Tanah');
    }
    if (fullText.includes('harga') || fullText.includes('pasar')) {
      keyTopics.push('Pasar');
    }
    if (
      fullText.includes('teknologi') ||
      fullText.includes('ai') ||
      fullText.includes('robot')
    ) {
      keyTopics.push('Teknologi');
    }

    // Determine harvest impact
    const impactScore = Math.abs(sentimentScore) * relevanceScore;
    let harvestImpact: 'high' | 'medium' | 'low' = 'low';
    if (impactScore > 0.6) {
      harvestImpact = 'high';
    } else if (impactScore > 0.3) {
      harvestImpact = 'medium';
    }

    // Generate recommendation
    const recommendation = this.generateRecommendation(
      sentiment,
      keyTopics,
      harvestImpact
    );

    return {
      sentiment,
      sentimentScore,
      relevanceScore,
      keyTopics: keyTopics.length > 0 ? keyTopics : ['Umum'],
      harvestImpact,
      recommendation,
    };
  }

  /**
   * Generate farming recommendation based on analysis
   */
  private generateRecommendation(
    sentiment: string,
    topics: string[],
    impact: string
  ): string {
    if (sentiment === 'positive') {
      return 'Kondisi positif terdeteksi. Pertahankan praktik saat ini dan manfaatkan peluang ini.';
    } else if (sentiment === 'negative') {
      if (topics.includes('Cuaca')) {
        return 'Persiapkan sistem irigasi dan lindungi tanaman dari cuaca ekstrem.';
      } else if (topics.includes('Kesehatan Tanaman')) {
        return 'Lakukan inspeksi lahan segera dan terapkan pengendalian hama preventif.';
      } else {
        return 'Pantau situasi dengan cermat dan siapkan rencana contingency.';
      }
    } else {
      return 'Informasi netral. Lanjutkan monitoring kesehatan lahan secara rutin.';
    }
  }

  /**
   * Batch analyze multiple articles
   */
  async batchAnalyze(
    articles: Array<{ title: string; content: string; summary?: string }>
  ): Promise<NewsAnalysisResult[]> {
    return Promise.all(
      articles.map((article) =>
        this.analyzeArticle(article.title, article.content, article.summary)
      )
    );
  }

  /**
   * Generate farming insights from multiple articles
   */
  generateInsights(analyses: NewsAnalysisResult[]) {
    const sentimentStats = {
      positive: analyses.filter((a) => a.sentiment === 'positive').length,
      negative: analyses.filter((a) => a.sentiment === 'negative').length,
      neutral: analyses.filter((a) => a.sentiment === 'neutral').length,
    };

    const topTopics: Record<string, number> = {};
    analyses.forEach((analysis) => {
      analysis.keyTopics.forEach((topic) => {
        topTopics[topic] = (topTopics[topic] || 0) + 1;
      });
    });

    const averageRelevance =
      analyses.reduce((sum, a) => sum + a.relevanceScore, 0) /
      analyses.length;

    return {
      sentimentStats,
      topTopics,
      averageRelevance,
      overallOutlook:
        sentimentStats.positive > sentimentStats.negative ? 'Positif' : 'Negatif',
    };
  }
}

// Export singleton instance
export const geminiAnalyzer = new GeminiNewsAnalyzer();
