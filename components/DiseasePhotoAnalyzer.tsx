'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertTriangle, Heart, Loader } from 'lucide-react';
import { analyzeChickenPhoto, type DiseaseDetectionResult, type DetectedDisease } from '@/lib/disease-detector';

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
      description: 'Unggah foto ayam untuk deteksi penyakit berbasis AI',
      uploadPhoto: 'Unggah Foto Ayam Anda',
      dragDrop: 'Atau seret dan lepas file di sini',
      analyzing: 'Menganalisis foto...',
      overallHealth: 'Status Kesehatan',
      excellent: 'Sangat Baik',
      good: 'Baik',
      fair: 'Sedang',
      poor: 'Buruk',
      critical: 'Kritis',
      unknown: 'Tidak Diketahui',
      detectedDiseases: 'Penyakit Terdeteksi',
      confidence: 'Tingkat Kepercayaan',
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
      uploadNew: 'Unggah Foto Berbeda',
    },
    en: {
      title: 'Disease Detection from Chicken Photos',
      description: 'Upload a photo to detect diseases using AI',
      uploadPhoto: 'Upload Your Chicken Photo',
      dragDrop: 'Or drag and drop files here',
      analyzing: 'Analyzing photo...',
      overallHealth: 'Health Status',
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor',
      critical: 'Critical',
      unknown: 'Unknown',
      detectedDiseases: 'Detected Diseases',
      confidence: 'Detection Confidence',
      visualSigns: 'Visual Signs',
      immediateActions: 'Immediate Actions',
      preventive: 'Prevention',
      curative: 'Treatment',
      medicines: 'Medicine Recommendations',
      dosage: 'Dosage',
      duration: 'Duration',
      notes: 'Notes',
      recommendations: 'System Recommendations',
      noDiseaseDetected: 'No disease detected',
      healthyChicken: 'Chicken appears healthy',
      uploadNew: 'Upload Different Photo',
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
      console.error('Error analyzing photo:', error);
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
      excellent: 'bg-green-50 border-green-200',
      good: 'bg-blue-50 border-blue-200',
      fair: 'bg-yellow-50 border-yellow-200',
      poor: 'bg-orange-50 border-orange-200',
      critical: 'bg-red-50 border-red-200',
      unknown: 'bg-gray-50 border-gray-200',
    };
    return colors[status] || colors.good;
  };

  const getHealthStatusIcon = (status: string) => {
    if (status === 'excellent' || status === 'good') {
      return <Heart className="w-5 h-5 text-green-600" />;
    }
    return <AlertTriangle className="w-5 h-5 text-red-600" />;
  };

  const getHealthStatusLabel = (status: string) => {
    const labelMap: Record<string, string> = {
      excellent: labels.excellent,
      good: labels.good,
      fair: labels.fair,
      poor: labels.poor,
      critical: labels.critical,
      unknown: labels.unknown,
    };
    return labelMap[status] || status;
  };


  const hasRealDisease =
  analysisResult?.detected &&
  analysisResult?.diseases &&
  analysisResult.diseases.length > 0;


  return (
    <div className="space-y-6 w-full">
      {/* Upload Card */}
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
                  {labels.uploadNew}
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
          {/* Health Status Card */}
          <Card className={`border-2 ${getHealthStatusColor(analysisResult.overallHealth)}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getHealthStatusIcon(analysisResult.overallHealth)}
                {labels.overallHealth}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {getHealthStatusLabel(analysisResult.overallHealth)}
              </p>
            </CardContent>
          </Card>

          {/* Diseases Section */}
            {hasRealDisease ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                {labels.detectedDiseases}
              </h3>

              {analysisResult.diseases.map((disease: DetectedDisease, idx: number) => (
                <Card key={idx} className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{disease.name}</CardTitle>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-semibold">
                        {disease.confidence}%
                      </div>
                    </div>
                    <CardDescription>{labels.confidence}: {disease.confidence}% terdeteksi</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {disease.visualSigns && disease.visualSigns.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">{labels.visualSigns}:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {disease.visualSigns.map((sign: string, i: number) => (
                            <li key={i} className="text-sm">{sign}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {disease.immediateActions && disease.immediateActions.length > 0 && (
                      <div className="bg-red-50 p-3 rounded border border-red-200">
                        <h4 className="font-semibold text-sm mb-2 text-red-900">{labels.immediateActions}:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {disease.immediateActions.map((action: string, i: number) => (
                            <li key={i} className="text-sm text-red-800">{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {disease.preventive && disease.preventive.length > 0 && (
                      <div className="bg-green-50 p-3 rounded border border-green-200">
                        <h4 className="font-semibold text-sm mb-2 text-green-900">{labels.preventive}:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {disease.preventive.slice(0, 4).map((prev: string, i: number) => (
                            <li key={i} className="text-sm text-green-800">{prev}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {disease.curative && disease.curative.length > 0 && (
                      <div className="bg-orange-50 p-3 rounded border border-orange-200">
                        <h4 className="font-semibold text-sm mb-2 text-orange-900">{labels.curative}:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {disease.curative.slice(0, 4).map((cur: string, i: number) => (
                            <li key={i} className="text-sm text-orange-800">{cur}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {disease.medicineRecommendations && disease.medicineRecommendations.length > 0 && (
                      <div className="bg-purple-50 p-3 rounded border border-purple-200">
                        <h4 className="font-semibold text-sm mb-2 text-purple-900">{labels.medicines}:</h4>
                        <div className="space-y-2">
                          {disease.medicineRecommendations.map((med, i: number) => (
                            <div key={i} className="bg-white p-2 rounded border border-purple-200">
                              <p className="font-medium text-sm">{med.medicine}</p>
                              <p className="text-xs text-gray-600">{labels.dosage}: {med.dosage}</p>
                              <p className="text-xs text-gray-600">{labels.duration}: {med.duration}</p>
                              {med.notes && <p className="text-xs text-gray-600 mt-1">{labels.notes}: {med.notes}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert className="bg-green-50 border-green-200">
              <Heart className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>{labels.noDiseaseDetected}</strong> - {labels.healthyChicken}
              </AlertDescription>
            </Alert>
          )}

          {/* Recommendations Section */}
          {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
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
