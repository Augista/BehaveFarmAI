export const translations = {
  id: {
    // Navigation
    nav: {
      dashboard: 'Dasbor',
      news: 'Berita',
      analytics: 'Analitik',
      settings: 'Pengaturan',
    },
    // Dashboard sections
    dashboard: {
      title: 'Dasbor Pertanian AI',
      subtitle: 'Pantau kesehatan lahan dan prediksi cuaca',
      overview: 'Tinjauan Umum',
      metrics: 'Metrik Panen',
      soilHealth: 'Kesehatan Tanah',
      cropHealth: 'Kesehatan Tanaman',
      waterUsage: 'Penggunaan Air',
      temperature: 'Suhu',
      humidity: 'Kelembapan',
      phLevel: 'Level pH',
      nitrogen: 'Nitrogen',
      phosphorus: 'Fosfor',
      potassium: 'Potasium',
      yield: 'Hasil Panen',
      forecast: 'Prakiraan 7 Hari',
    },
    // News section
    news: {
      title: 'Berita Pertanian Terkini',
      subtitle: 'Analisis berita untuk hasil panen optimal',
      relevantNews: 'Berita Relevan',
      sentiment: 'Sentimen',
      positive: 'Positif',
      negative: 'Negatif',
      neutral: 'Netral',
      impact: 'Dampak Panen',
      readMore: 'Baca Selengkapnya',
      noNews: 'Tidak ada berita saat ini',
    },
    // Charts
    charts: {
      soilComparison: 'Perbandingan Kesehatan Tanah',
      yieldComparison: 'Perbandingan Hasil Panen',
      monthlyTrend: 'Tren Bulanan',
      weeklyMetrics: 'Metrik Mingguan',
      fieldComparison: 'Perbandingan Lahan',
    },
    // Common
    common: {
      loading: 'Memuat...',
      error: 'Kesalahan',
      success: 'Berhasil',
      cancel: 'Batal',
      save: 'Simpan',
      delete: 'Hapus',
      edit: 'Ubah',
      close: 'Tutup',
      month: 'Bulan',
      week: 'Minggu',
      day: 'Hari',
    },
  },
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      news: 'News',
      analytics: 'Analytics',
      settings: 'Settings',
    },
    // Dashboard sections
    dashboard: {
      title: 'AI Farm Dashboard',
      subtitle: 'Monitor land health and weather predictions',
      overview: 'Overview',
      metrics: 'Harvest Metrics',
      soilHealth: 'Soil Health',
      cropHealth: 'Crop Health',
      waterUsage: 'Water Usage',
      temperature: 'Temperature',
      humidity: 'Humidity',
      phLevel: 'pH Level',
      nitrogen: 'Nitrogen',
      phosphorus: 'Phosphorus',
      potassium: 'Potassium',
      yield: 'Yield',
      forecast: '7-Day Forecast',
    },
    // News section
    news: {
      title: 'Latest Agricultural News',
      subtitle: 'Analyze news for optimal harvest results',
      relevantNews: 'Relevant News',
      sentiment: 'Sentiment',
      positive: 'Positive',
      negative: 'Negative',
      neutral: 'Neutral',
      impact: 'Harvest Impact',
      readMore: 'Read More',
      noNews: 'No news available at this moment',
    },
    // Charts
    charts: {
      soilComparison: 'Soil Health Comparison',
      yieldComparison: 'Yield Comparison',
      monthlyTrend: 'Monthly Trend',
      weeklyMetrics: 'Weekly Metrics',
      fieldComparison: 'Field Comparison',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
  },
};

export type Language = 'id' | 'en';

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}
