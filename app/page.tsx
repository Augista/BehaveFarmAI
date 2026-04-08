'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { BroilerAnalytics } from '@/components/BroilerAnalytics';
import { DiseasePhotoAnalyzer } from '@/components/DiseasePhotoAnalyzer';
import Dashboard from '@/components/Dashboard';
import DataInputForm from '@/components/DataInputForm';
import { Language } from '@/lib/translations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePathname } from 'next/navigation';

export default function Home() {
  const [language, setLanguage] = useState<Language>('id');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const pathname = usePathname();

  const getCurrentPage = (path: string) => {
    switch (path) {
      case '/': return 'dashboard';
      case '/berita': return 'berita';
      case '/analisis': return 'analisis';
      default: return 'dashboard';
    }
  };

  const currentPage = getCurrentPage(pathname);

  const handleDataSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-0">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {language === 'id' ? 'Dasbor Pertanian AI' : 'AI Farm Dashboard'}
            </h1>
            <p className="text-gray-600 text-lg">
              {language === 'id'
                ? 'Pantau kesehatan lahan dan prediksi cuaca'
                : 'Monitor land health and weather predictions'}
            </p>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 lg:grid-cols-5">
              <TabsTrigger value="dashboard" onClick={() => getCurrentPage('dashboard')}>
                {language === 'id' ? 'Dasbor' : 'Dashboard'}
              </TabsTrigger>
              <TabsTrigger value="analytics" onClick={() => getCurrentPage('analytics')}>
                {language === 'id' ? 'Analitik' : 'Analytics'}
              </TabsTrigger>
              <TabsTrigger value="disease" onClick={() => getCurrentPage('disease')}>
                {language === 'id' ? 'Deteksi Penyakit' : 'Disease Detection'}
              </TabsTrigger>
              <TabsTrigger value="input" onClick={() => getCurrentPage('input')}>
                {language === 'id' ? 'Input Data' : 'Input Data'}
              </TabsTrigger>
              <TabsTrigger value="help" onClick={() => getCurrentPage('help')}>
                {language === 'id' ? 'Bantuan' : 'Help'}
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <Dashboard key={refreshTrigger} />
            </TabsContent>

            {/* Analytics Tab - Behavioral Metrics & Predictions */}
            <TabsContent value="analytics" className="space-y-6">
              <BroilerAnalytics language={language} />
            </TabsContent>

            {/* Disease Detection Tab - Photo Analysis */}
            <TabsContent value="disease" className="space-y-6">
              <DiseasePhotoAnalyzer language={language} />
            </TabsContent>

            {/* Data Input Tab */}
            <TabsContent value="input">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'id' ? 'Input Data Harian Peternakan' : 'Daily Broiler Farm Data Entry'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'id'
                      ? 'Catat pengamatan dan pengukuran harian untuk peternakan ayam broiler Anda'
                      : 'Record daily observations and measurements for your broiler flock'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataInputForm onSubmit={handleDataSubmitted} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Help Tab */}
            <TabsContent value="help" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'id' ? 'Panduan Penggunaan Sistem' : 'System User Guide'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{language === 'id' ? '1. Input Data Harian' : '1. Daily Data Input'}</h3>
                    <p className="text-sm text-gray-600">
                      {language === 'id'
                        ? 'Catat semua metrik harian: konsumsi pakan/air, berat ayam, suhu/kelembaban, kematian'
                        : 'Record all daily metrics: feed/water consumption, bird weight, temperature/humidity, mortality'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{language === 'id' ? '2. Analitik Behavioral' : '2. Behavioral Analytics'}</h3>
                    <p className="text-sm text-gray-600">
                      {language === 'id'
                        ? 'Sistem akan menghitung FCR, estimasi panen, deteksi anomali, dan prediksi risiko penyakit'
                        : 'System calculates FCR, harvest estimates, anomaly detection, and disease risk predictions'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{language === 'id' ? '3. Deteksi Penyakit dari Foto' : '3. Disease Detection from Photos'}</h3>
                    <p className="text-sm text-gray-600">
                      {language === 'id'
                        ? 'Unggah foto ayam untuk analisis AI berbasis visi - dapatkan diagnosis dan rekomendasi obat'
                        : 'Upload chicken photos for AI vision-based analysis - get diagnosis and medicine recommendations'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
