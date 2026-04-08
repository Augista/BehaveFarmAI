// Farm Analytics Engine for Broiler Chicken Operations
// Analyzes behavioral patterns, predicts efficiency, detects anomalies

export interface FarmDataPoint {
  date: string;
  feed_consumed_kg: number;
  water_consumed_liters: number;
  mortality_count: number;
  live_bird_count: number;
  avg_weight_kg: number;
  temperature_celsius: number;
  humidity_percentage: number;
  notes: string;
}

export interface BehavioralMetrics {
  feedConversion: number; // kg feed per kg weight gain
  dailyWeightGain: number; // kg/day
  waterFeedRatio: number; // liters water per kg feed
  mortalityRate: number; // percentage
  estimatedHarvestWeight: number; // kg at 35-42 days
  daysToMarket: number;
  projectedYield: number; // estimated total kg at harvest
  efficiency: number; // 0-100 score
}

export interface AnomalyAlert {
  type: 'mortality' | 'weight' | 'consumption' | 'environment' | 'behavior';
  severity: 'low' | 'medium' | 'high';
  message: string;
  recommendation: string;
}

export interface DiseaseRisk {
  disease: string;
  riskLevel: number; // 0-100
  symptoms: string[];
  preventive: string[];
  curative: string[];
}

// Calculate behavioral metrics from farm data
export function calculateBehavioralMetrics(
  dataHistory: FarmDataPoint[],
  flockAge: number = 21, // days old
  initialBirdCount: number = 10000
): BehavioralMetrics {
  if (dataHistory.length === 0) {
    return getDefaultMetrics();
  }

  const latest = dataHistory[dataHistory.length - 1];
  const previousData = dataHistory.length > 1 ? dataHistory[dataHistory.length - 2] : null;

  // Feed Conversion Ratio (kg feed per kg weight gain)
  const totalFeedConsumed = dataHistory.reduce((sum, d) => sum + d.feed_consumed_kg, 0);
  const currentBiomass = latest.live_bird_count * latest.avg_weight_kg;
  const feedConversion = currentBiomass > 0 ? totalFeedConsumed / currentBiomass : 0;

  // Daily Weight Gain
  const dailyWeightGain = flockAge > 0 ? latest.avg_weight_kg / flockAge : 0;

  // Water to Feed Ratio
  const totalWater = dataHistory.reduce((sum, d) => sum + d.water_consumed_liters, 0);
  const waterFeedRatio = totalFeedConsumed > 0 ? totalWater / totalFeedConsumed : 0;

  // Mortality Rate
  const totalMortality = dataHistory.reduce((sum, d) => sum + d.mortality_count, 0);
  const mortalityRate = initialBirdCount > 0 ? (totalMortality / initialBirdCount) * 100 : 0;

  // Estimate harvest weight at day 35-42 (typical broiler age)
  const daysToMarket = 35;
  const projectedWeightGain = (daysToMarket - flockAge) * dailyWeightGain;
  const estimatedHarvestWeight = latest.avg_weight_kg + projectedWeightGain;

  // Projected total yield
  const projectedBirdCount = latest.live_bird_count * ((100 - mortalityRate) / 100);
  const projectedYield = estimatedHarvestWeight * projectedBirdCount;

  // Efficiency score (0-100)
  // Based on: FCR (lower better), weight gain (higher better), mortality (lower better)
  const fcrScore = Math.max(0, 100 - Math.min(feedConversion * 20, 50));
  const weightGainScore = Math.min(dailyWeightGain * 100, 50);
  const mortalityScore = Math.max(0, 100 - (mortalityRate * 2));
  const efficiency = (fcrScore + weightGainScore + (mortalityScore / 2)) / 2;

  return {
    feedConversion: Math.round(feedConversion * 100) / 100,
    dailyWeightGain: Math.round(dailyWeightGain * 1000) / 1000,
    waterFeedRatio: Math.round(waterFeedRatio * 100) / 100,
    mortalityRate: Math.round(mortalityRate * 10) / 10,
    estimatedHarvestWeight: Math.round(estimatedHarvestWeight * 100) / 100,
    daysToMarket,
    projectedYield: Math.round(projectedYield * 100) / 100,
    efficiency: Math.round(efficiency * 10) / 10,
  };
}

// Detect anomalies in farm data
export function detectAnomalies(
  dataHistory: FarmDataPoint[],
  metrics: BehavioralMetrics
): AnomalyAlert[] {
  const alerts: AnomalyAlert[] = [];
  const latest = dataHistory[dataHistory.length - 1];

  // Mortality anomaly
  if (latest.mortality_count > 50) {
    alerts.push({
      type: 'mortality',
      severity: 'high',
      message: `Tingkat kematian tinggi: ${latest.mortality_count} ekor dalam sehari`,
      recommendation: 'Periksa kondisi kandang, kualitas pakan, dan tanda-tanda penyakit. Konsultasi dengan veteriner.',
    });
  } else if (latest.mortality_count > 20) {
    alerts.push({
      type: 'mortality',
      severity: 'medium',
      message: `Kematian meningkat: ${latest.mortality_count} ekor`,
      recommendation: 'Monitor kesehatan ayam lebih sering. Periksa ventilasi dan kebersihan kandang.',
    });
  }

  // Weight anomaly
  if (dataHistory.length > 1) {
    const previousWeight = dataHistory[dataHistory.length - 2].avg_weight_kg;
    const weightChange = latest.avg_weight_kg - previousWeight;

    if (weightChange < 0.05 && latest.avg_weight_kg > 1) {
      alerts.push({
        type: 'weight',
        severity: 'medium',
        message: `Pertumbuhan berat lambat: hanya ${(weightChange * 1000).toFixed(0)}g per hari`,
        recommendation: 'Tingkatkan kualitas dan jumlah pakan. Periksa nutrisi (protein, energi).',
      });
    }
  }

  // Feed consumption anomaly
  if (latest.feed_consumed_kg < 1 && latest.live_bird_count > 1000) {
    alerts.push({
      type: 'consumption',
      severity: 'high',
      message: 'Konsumsi pakan sangat rendah',
      recommendation: 'Periksa ketersediaan pakan, peralatan makan, dan tanda-tanda penyakit.',
    });
  }

  // Water consumption anomaly
  if (latest.water_consumed_liters < 2 && latest.live_bird_count > 1000) {
    alerts.push({
      type: 'consumption',
      severity: 'high',
      message: 'Konsumsi air sangat rendah',
      recommendation: 'Periksa sistem air minum, kebersihan, dan suhu lingkungan.',
    });
  }

  // Temperature anomaly
  if (latest.temperature_celsius < 20 || latest.temperature_celsius > 35) {
    alerts.push({
      type: 'environment',
      severity: 'high',
      message: `Suhu kandang tidak ideal: ${latest.temperature_celsius}°C`,
      recommendation: `Atur sistem ventilasi dan pemanas/pendingin. Suhu ideal: 24-28°C`,
    });
  }

  // Humidity anomaly
  if (latest.humidity_percentage < 40 || latest.humidity_percentage > 85) {
    alerts.push({
      type: 'environment',
      severity: 'medium',
      message: `Kelembaban tidak optimal: ${latest.humidity_percentage}%`,
      recommendation: 'Kelembaban ideal: 50-70%. Sesuaikan ventilasi.',
    });
  }

  // Feed conversion anomaly
  if (metrics.feedConversion > 2.5) {
    alerts.push({
      type: 'behavior',
      severity: 'medium',
      message: `Feed Conversion Ratio tinggi: ${metrics.feedConversion}`,
      recommendation: 'Ini menunjukkan efisiensi pakan rendah. Periksa kualitas pakan dan kesehatan ayam.',
    });
  }

  return alerts;
}

// Predict disease risk based on environmental conditions and data patterns
export function predictDiseaseRisk(
  dataHistory: FarmDataPoint[],
  metrics: BehavioralMetrics
): DiseaseRisk[] {
  const risks: DiseaseRisk[] = [];
  const latest = dataHistory[dataHistory.length - 1];

  // Newcastle Disease (Tetelo)
  if (latest.mortality_count > 30 || (latest.temperature_celsius > 30 && latest.humidity_percentage > 75)) {
    risks.push({
      disease: 'Newcastle Disease (Tetelo)',
      riskLevel: Math.min(latest.mortality_count * 2 + 40, 100),
      symptoms: ['Kepala bengkak', 'Kesulitan bernafas', 'Diare hijau', 'Lumpuh', 'Kematian mendadak'],
      preventive: [
        'Vaksinasi Newcastle aktif dan inaktif',
        'Jaga ventilasi dan sanitasi',
        'Karantina ayam baru',
        'Hindari stress lingkungan',
      ],
      curative: [
        'Isolasi ayam sakit',
        'Antibiotik untuk infeksi sekunder: Enrofloxacin 10 mg/kg/hari',
        'Vitamin B kompleks untuk pemulihan',
        'Perawatan suportif dan nutrisi',
      ],
    });
  }

  // Coccidiosis
  if (latest.humidity_percentage > 70 || latest.mortality_count > 20) {
    risks.push({
      disease: 'Coccidiosis',
      riskLevel: Math.min((latest.humidity_percentage - 50) * 2 + latest.mortality_count, 100),
      symptoms: ['Diare berdarah', 'Ayam menggembung', 'Bulu kusam', 'Pertumbuhan terhambat'],
      preventive: [
        'Hindari tempat lembab',
        'Ganti alas kandang secara rutin',
        'Tidak menumpuk ayam terlalu banyak',
        'Amprolium atau Thiamine dalam air minum',
      ],
      curative: [
        'Amprolium 0.012% dalam air minum selama 5-7 hari',
        'Atau Toltrazuril 25 mg/kg selama 2-3 hari',
        'Vitamin K untuk perdarahan',
        'Hindari stres selama pengobatan',
      ],
    });
  }

  // Respiratory Disease (CRD)
  if ((latest.temperature_celsius < 22 && latest.humidity_percentage < 50) || 
      (latest.temperature_celsius > 32 && latest.humidity_percentage > 75)) {
    risks.push({
      disease: 'Chronic Respiratory Disease (CRD)',
      riskLevel: Math.min(Math.abs(latest.temperature_celsius - 26) * 5 + 30, 100),
      symptoms: ['Batuk dan bersin', 'Napas berbunyi', 'Mata membengkak', 'Kepala bengkak'],
      preventive: [
        'Jaga suhu 24-28°C dan kelembaban 50-70%',
        'Ventilasi berkualitas',
        'Hindari debu dan amonia',
        'Jarak sosial yang cukup',
      ],
      curative: [
        'Enrofloxacin 10 mg/kg/hari selama 5 hari',
        'Atau Oxytetracycline 20 mg/kg/hari',
        'Ventilasi maksimal',
        'Kurangi kepadatan ayam jika perlu',
      ],
    });
  }

  // Avian Influenza (AI)
  if (latest.mortality_count > 50) {
    risks.push({
      disease: 'Avian Influenza (AI)',
      riskLevel: Math.min(latest.mortality_count + 40, 100),
      symptoms: [
        'Kematian mendadak tanpa gejala',
        'Kepala membengkak',
        'Diare',
        'Gagal telur pada petelur',
      ],
      preventive: [
        'Vaksinasi AI jika diperlukan',
        'Biosecurity ketat',
        'Hindari kontak dengan unggas liar',
        'Cuci tangan dan pakaian kerja',
      ],
      curative: [
        'Tidak ada obat efektif - fokus pada pencegahan',
        'Isolasi ayam sakit',
        'Lapor ke otoritas kesehatan hewan',
        'Disinfeksi kandang jika terkonfirmasi',
      ],
    });
  }

  // Gumboro (IBD)
  if (metrics.mortalityRate > 5 && latest.live_bird_count < 9000) {
    risks.push({
      disease: 'Gumboro (Infectious Bursal Disease)',
      riskLevel: Math.min(metrics.mortalityRate * 10 + 30, 100),
      symptoms: ['Ayam lesu dan demam', 'Diare putih', 'Dehidrasi', 'Tremor'],
      preventive: [
        'Vaksinasi Gumboro aktif',
        'Biosecurity ketat',
        'Hygiene pakan dan air',
      ],
      curative: [
        'Tidak ada obat spesifik',
        'Cairan elektrolit dalam air minum',
        'Vitamin A, D, E dan mineral',
        'Hindari stress sekunder',
      ],
    });
  }

  return risks.filter(r => r.riskLevel > 0);
}

function getDefaultMetrics(): BehavioralMetrics {
  return {
    feedConversion: 0,
    dailyWeightGain: 0,
    waterFeedRatio: 0,
    mortalityRate: 0,
    estimatedHarvestWeight: 0,
    daysToMarket: 35,
    projectedYield: 0,
    efficiency: 0,
  };
}
