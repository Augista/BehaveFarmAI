'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, AlertTriangle, Heart, Loader } from 'lucide-react';
import { analyzeChickenPhoto, type DiseaseDetectionResult } from '@/lib/disease-detector';

interface Props {
  language?: 'id' | 'en';
}

export function DiseasePhotoAnalyzer({ language = 'id' }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DiseaseDetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    id: {
      title: 'Analisis Penyakit Ayam dari Foto',
      description: 'Unggah foto ayam untuk deteksi penyakit berbasis AI (maks 2MB)',
      uploadButton: 'Unggah Foto',
      analyze: 'Analisis Sekarang',
      uploadPhoto: 'Unggah Foto Ayam Anda',
      dragDrop: 'Atau seret dan lepas file di sini',
      analyzing: 'Menganalisis foto...',
      overallHealth: 'Status Kesehatan Keseluruhan',
      excellent: 'Sangat Baik',
      good: 'Baik',
      fair: 'Sedang',
      poor: 'Buruk',
      critical: 'Kritis',
      detectedDiseases: 'Penyakit Terdeteksi',
      visualSigns: 'Tanda-tanda Visual',
      immediateActions: 'Tindakan Segera',
      preventive: 'Pencegahan',
      curative: 'Pengobatan',
      medicines: 'Rekomendasi Obat',
      dosage: 'Dosis',
      duration: 'Durasi',
      notes: 'Catatan',
      recommendations: 'Rekomendasi Sistem',
      noDiseaseDetected: 'Tidak ada penyakit terdeteksi',
      healthyChicken: 'Ayam terlihat sehat',
    },
    en: {
      title: 'Disease Detection from Chicken Photos',
      description: 'Upload a photo to detect diseases using AI',
      uploadButton: 'Upload Photo',
      analyze: 'Analyze Now',
      uploadPhoto: 'Upload Your Chicken Photo',
      dragDrop: 'Or drag and drop files here',
      analyzing: 'Analyzing photo...',
      overallHealth: 'Overall Health Status',
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor',
      critical: 'Critical',
      detectedDiseases: 'Detected Diseases',
      visualSigns: 'Visual Signs',
      immediateActions: 'Immediate Actions',
      preventive: 'Preventive Care',
      curative: 'Curative Treatment',
      medicines: 'Medicine Recommendations',
      dosage: 'Dosage',
      duration: 'Duration',
      notes: 'Notes',
      recommendations: 'System Recommendations',
      noDiseaseDetected: 'No disease detected',
      healthyChicken: 'Chicken appears healthy',
    },
  };

  const labels = t[language];

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(language === 'id' ? 'Harap pilih file gambar' : 'Please select an image file');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);

    // Analyze
    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await analyzeChickenPhoto(base64);
      setAnalysisResult(result);
    } catch (error) {
      console.error(' Error analyzing photo:', error);
      alert(language === 'id' ? 'Gagal menganalisis foto' : 'Failed to analyze photo');
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const getHealthStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      excellent: 'bg-green-100 border-green-300 text-green-800',
      good: 'bg-blue-100 border-blue-300 text-blue-800',
      fair: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      poor: 'bg-orange-100 border-orange-300 text-orange-800',
      critical: 'bg-red-100 border-red-300 text-red-800',
    };
    return colors[status] || colors.good;
  };

  const getHealthStatusLabel = (status: string) => {
    const labelMap: Record<string, string> = {
      excellent: labels.excellent,
      good: labels.good,
      fair: labels.fair,
      poor: labels.poor,
      critical: labels.critical,
    };
    return labelMap[status] || status;
  };

  return (
    <div className="space-y-6 w-full">
      <Card>
        <CardHeader>
          <CardTitle>{labels.title}</CardTitle>
          <CardDescription>{labels.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!imagePreview ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="font-medium text-gray-700">{labels.uploadPhoto}</p>
              <p className="text-sm text-gray-500">{labels.dragDrop}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-gray-100 max-h-96">
                <img src={imagePreview} alt="Chicken" className="w-full h-auto object-cover" />
              </div>

              {!loading && analysisResult && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setImagePreview(null);
                    setAnalysisResult(null);
                  }}
                  className="w-full"
                >
                  {language === 'id' ? 'Unggah Foto Berbeda' : 'Upload Different Photo'}
                </Button>
              )}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
              <p>{labels.analyzing}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && !loading && (
        <div className="space-y-6">
          {/* Health Status */}
          <Card
            className={`border-2 ${getHealthStatusColor(analysisResult.overallHealth)}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {analysisResult.overallHealth === 'excellent' || analysisResult.overallHealth === 'good' ? (
                  <Heart className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                {labels.overallHealth}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                {getHealthStatusLabel(analysisResult.overallHealth)}
              </p>
            </CardContent>
          </Card>

          {/* Diseases Detected */}
          {analysisResult.diseases.length > 0 ? (
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle>{labels.detectedDiseases}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="0" className="w-full">
                  <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(analysisResult.diseases.length, 3)}, 1fr)` }}>
                    {analysisResult.diseases.map((disease, idx) => (
                      <TabsTrigger key={idx} value={idx.toString()} className="text-xs">
                        {disease.name.split('(')[0].trim()}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {analysisResult.diseases.map((disease, idx) => (
                    <TabsContent key={idx} value={idx.toString()} className="space-y-4 mt-4">
                      <div className="bg-blue-50 p-4 rounded">
                        <p className="text-sm text-muted-foreground">{language === 'id' ? 'Kepercayaan Deteksi' : 'Detection Confidence'}</p>
                        <p className="text-2xl font-bold text-blue-600">{disease.confidence}%</p>
                      </div>

                      {disease.visualSigns.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">{labels.visualSigns}:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {disease.visualSigns.map((sign, i) => (
                              <li key={i} className="text-sm">{sign}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {disease.immediateActions.length > 0 && (
                        <div className="bg-orange-50 p-3 rounded">
                          <h4 className="font-semibold text-sm mb-2">{labels.immediateActions}:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {disease.immediateActions.map((action, i) => (
                              <li key={i} className="text-sm">{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {disease.preventive.length > 0 && (
                        <div className="bg-green-50 p-3 rounded">
                          <h4 className="font-semibold text-sm mb-2">{labels.preventive}:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {disease.preventive.map((prev, i) => (
                              <li key={i} className="text-sm">{prev}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {disease.curative.length > 0 && (
                        <div className="bg-red-50 p-3 rounded">
                          <h4 className="font-semibold text-sm mb-2">{labels.curative}:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {disease.curative.map((cur, i) => (
                              <li key={i} className="text-sm">{cur}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {disease.medicineRecommendations.length > 0 && (
                        <div className="bg-purple-50 p-3 rounded">
                          <h4 className="font-semibold text-sm mb-2">{labels.medicines}:</h4>
                          <div className="space-y-3">
                            {disease.medicineRecommendations.map((med, i) => (
                              <div key={i} className="bg-white p-2 rounded border border-purple-200">
                                <p className="font-medium text-sm">{med.medicine}</p>
                                <p className="text-xs text-gray-600">{labels.dosage}: {med.dosage}</p>
                                <p className="text-xs text-gray-600">{labels.duration}: {med.duration}</p>
                                {med.notes && <p className="text-xs text-gray-600 mt-1">{med.notes}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Alert className="bg-green-50 border-green-200">
              <Heart className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>{labels.noDiseaseDetected}</strong> - {labels.healthyChicken}
              </AlertDescription>
            </Alert>
          )}

          {/* System Recommendations */}
          {analysisResult.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{labels.recommendations}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex gap-2 text-sm">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
