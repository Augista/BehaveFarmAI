'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, TrendingUp, AlertCircle, Heart } from 'lucide-react';
import { calculateBehavioralMetrics, detectAnomalies, predictDiseaseRisk, type FarmDataPoint, type BehavioralMetrics, type AnomalyAlert, type DiseaseRisk } from '@/lib/farm-analytics';

interface Props {
  language?: 'id' | 'en';
}

export function BroilerAnalytics({ language = 'id' }: Props) {
  const [farmData, setFarmData] = useState<FarmDataPoint[]>([]);
  const [metrics, setMetrics] = useState<BehavioralMetrics | null>(null);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);
  const [diseaseRisks, setDiseaseRisks] = useState<DiseaseRisk[]>([]);
  const [loading, setLoading] = useState(true);

  const t = {
    id: {
      title: 'Analitik Peternakan Ayam',
      description: 'Behavioral Modeling & Predictive Analytics',
      efficiency: 'Efisiensi Peternakan',
      fcr: 'Feed Conversion Ratio',
      dailyGain: 'Pertumbuhan Harian',
      mortalityRate: 'Tingkat Kematian',
      projectedYield: 'Estimasi Hasil Panen',
      harvestWeight: 'Berat Panen Estimasi',
      anomalies: 'Peringatan Anomali',
      diseaseRisks: 'Risiko Penyakit',
      noAlerts: 'Tidak ada anomali terdeteksi',
      metrics: 'Metrik Behavioral',
      alerts: 'Peringatan Sistem',
      kg: 'kg',
      pcs: 'ekor',
      percent: '%',
      days: 'hari',
    },
    en: {
      title: 'Broiler Analytics',
      description: 'Behavioral Modeling & Predictive Analytics',
      efficiency: 'Farm Efficiency',
      fcr: 'Feed Conversion Ratio',
      dailyGain: 'Daily Weight Gain',
      mortalityRate: 'Mortality Rate',
      projectedYield: 'Projected Harvest',
      harvestWeight: 'Estimated Harvest Weight',
      anomalies: 'Anomaly Alerts',
      diseaseRisks: 'Disease Risks',
      noAlerts: 'No anomalies detected',
      metrics: 'Behavioral Metrics',
      alerts: 'System Alerts',
      kg: 'kg',
      pcs: 'birds',
      percent: '%',
      days: 'days',
    },
  };

  const labels = t[language];

  useEffect(() => {
    // Fetch farm data from API
    const fetchData = async () => {
      try {
        const response = await fetch('/api/farm-data');
        if (response.ok) {
          const data = await response.json();
          setFarmData(data);

          // Calculate metrics
          const calculatedMetrics = calculateBehavioralMetrics(data);
          setMetrics(calculatedMetrics);

          // Detect anomalies
          const detectedAnomalies = detectAnomalies(data, calculatedMetrics);
          setAnomalies(detectedAnomalies);

          // Predict disease risks
          const risks = predictDiseaseRisk(data, calculatedMetrics);
          setDiseaseRisks(risks);
        }
      } catch (error) {
        console.error(' Error fetching farm data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">{language === 'id' ? 'Memuat data...' : 'Loading data...'}</p>
        </CardContent>
      </Card>
    );
  }

  if (farmData.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            {language === 'id' ? 'Belum ada data untuk dianalisis' : 'No data to analyze yet'}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const chartData = farmData.map(d => ({
    date: d.date,
    weight: d.avg_weight_kg,
    feed: d.feed_consumed_kg,
    water: d.water_consumed_liters,
    mortality: d.mortality_count,
    temp: d.temperature_celsius,
    humidity: d.humidity_percentage,
  }));

  return (
    <div className="space-y-6 w-full">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{labels.efficiency}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics?.efficiency.toFixed(1) || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Score: 0-100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{labels.fcr}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics?.feedConversion.toFixed(2) || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{labels.kg} pakan per {labels.kg} berat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{labels.dailyGain}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(metrics?.dailyWeightGain.toFixed(3) || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">{labels.kg}/hari</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{labels.mortalityRate}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{metrics?.mortalityRate.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">Kematian Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">{language === 'id' ? 'Tren' : 'Trends'}</TabsTrigger>
          <TabsTrigger value="metrics">{labels.metrics}</TabsTrigger>
          <TabsTrigger value="alerts" className="relative">
            {labels.alerts}
            {anomalies.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {anomalies.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="diseases" className="relative">
            {language === 'id' ? 'Penyakit' : 'Diseases'}
            {diseaseRisks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full text-white text-xs flex items-center justify-center">
                {diseaseRisks.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          {/* Weight Gain Trend */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'id' ? 'Tren Pertumbuhan Berat Badan' : 'Weight Gain Trend'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="weight" stroke="#3b82f6" name={language === 'id' ? 'Berat Rata-rata (kg)' : 'Avg Weight (kg)'} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Feed & Water Consumption */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'id' ? 'Konsumsi Pakan & Air' : 'Feed & Water Consumption'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="feed" fill="#ef4444" name={language === 'id' ? 'Pakan (kg)' : 'Feed (kg)'} />
                  <Bar dataKey="water" fill="#3b82f6" name={language === 'id' ? 'Air (liter)' : 'Water (L)'} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Environment Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'id' ? 'Kondisi Lingkungan' : 'Environmental Conditions'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temp" stroke="#f59e0b" name={language === 'id' ? 'Suhu (°C)' : 'Temperature (°C)'} />
                  <Line type="monotone" dataKey="humidity" stroke="#06b6d4" name={language === 'id' ? 'Kelembaban (%)' : 'Humidity (%)'} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'id' ? 'Metrik Behavioral Peternakan' : 'Behavioral Metrics'}</CardTitle>
              <CardDescription>
                {language === 'id' ? 'Analisis performance dan prediksi hasil panen' : 'Performance analysis and harvest predictions'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">{labels.fcr}</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics?.feedConversion.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === 'id'
                      ? 'Ideal: 1.5-1.8 (lebih rendah lebih baik)'
                      : 'Ideal: 1.5-1.8 (lower is better)'}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">{labels.dailyGain}</p>
                  <p className="text-2xl font-bold text-green-600">{metrics?.dailyWeightGain.toFixed(3)} kg</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === 'id' ? 'Optimal pertumbuhan harian' : 'Optimal daily growth'}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">{language === 'id' ? 'Rasio Air-Pakan' : 'Water-Feed Ratio'}</p>
                  <p className="text-2xl font-bold text-purple-600">{metrics?.waterFeedRatio.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === 'id' ? 'Ideal: 1.5-2.0 liter/kg' : 'Ideal: 1.5-2.0 L/kg'}
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">{language === 'id' ? 'Estimasi Berat Panen' : 'Harvest Weight Est.'}</p>
                  <p className="text-2xl font-bold text-orange-600">{metrics?.estimatedHarvestWeight.toFixed(2)} kg</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === 'id' ? 'Di hari ke-35-42' : 'At day 35-42'}
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg col-span-1 md:col-span-2">
                  <p className="text-sm text-muted-foreground">{language === 'id' ? 'Estimasi Total Hasil Panen' : 'Total Projected Yield'}</p>
                  <p className="text-3xl font-bold text-red-600">{(metrics?.projectedYield || 0).toFixed(0)} kg</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === 'id'
                      ? 'Total kg ayam siap jual pada panen'
                      : 'Total kg of ready-to-sell birds at harvest'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          {anomalies.length === 0 ? (
            <Alert className="bg-green-50 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{labels.noAlerts}</AlertDescription>
            </Alert>
          ) : (
            anomalies.map((alert, idx) => (
              <Alert
                key={idx}
                className={
                  alert.severity === 'high'
                    ? 'bg-red-50 border-red-200'
                    : alert.severity === 'medium'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-blue-50 border-blue-200'
                }
              >
                <AlertTriangle
                  className={`h-4 w-4 ${
                    alert.severity === 'high'
                      ? 'text-red-600'
                      : alert.severity === 'medium'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                  }`}
                />
                <AlertDescription
                  className={
                    alert.severity === 'high'
                      ? 'text-red-800'
                      : alert.severity === 'medium'
                        ? 'text-yellow-800'
                        : 'text-blue-800'
                  }
                >
                  <strong>{alert.message}</strong>
                  <p className="mt-2 text-sm">{alert.recommendation}</p>
                </AlertDescription>
              </Alert>
            ))
          )}
        </TabsContent>

        {/* Disease Risks Tab */}
        <TabsContent value="diseases" className="space-y-4">
          {diseaseRisks.length === 0 ? (
            <Alert className="bg-green-50 border-green-200">
              <Heart className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {language === 'id'
                  ? 'Risiko penyakit rendah saat ini'
                  : 'Current disease risk is low'}
              </AlertDescription>
            </Alert>
          ) : (
            diseaseRisks.map((risk, idx) => (
              <Card key={idx} className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <CardTitle className="text-lg">{risk.disease}</CardTitle>
                  <CardDescription>
                    {language === 'id' ? 'Tingkat Risiko' : 'Risk Level'}: {risk.riskLevel}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">
                      {language === 'id' ? 'Gejala Visual' : 'Visual Symptoms'}:
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {risk.symptoms.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">
                      {language === 'id' ? 'Tindakan Pencegahan' : 'Preventive Actions'}:
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {risk.preventive.slice(0, 3).map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">
                      {language === 'id' ? 'Pengobatan (Obat)' : 'Curative Treatment'}:
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {risk.curative.slice(0, 3).map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
