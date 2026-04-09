// Disease Detection from Chicken Photos using Gemini Vision API
// Analyzes uploaded images to detect health issues and provide recommendations

export interface DiseaseDetectionResult {
  detected: boolean;
  diseases: DetectedDisease[];
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  recommendations: string[];
}

export interface DetectedDisease {
  name: string;
  confidence: number; // 0-100
  visualSigns: string[];
  immediateActions: string[];
  preventive: string[];
  curative: string[];
  medicineRecommendations: MedicineRecommendation[];
}

export interface MedicineRecommendation {
  type: 'preventive' | 'curative';
  medicine: string;
  dosage: string;
  duration: string;
  notes: string;
}

// Map common chicken diseases with their visual signs
export const DISEASE_DATABASE = {
  'Newcastle Disease': {
    visualSigns: ['kepala bengkak', 'bengkak wajah', 'mata tertutup', 'paruh terbuka', 'bernafas berat'],
    confidence: 0.8,
    preventive: [
      'Vaksinasi Newcastle aktif',
      'Vaksinasi Newcastle inaktif',
      'Jaga ventilasi kandang',
      'Sanitasi rutin',
    ],
    curative: [
      'Isolasi ayam sakit',
      'Antibiotik spektrum luas',
      'Dukungan nutrisi',
    ],
    medicines: [
      {
        type: 'curative' as const,
        name: 'Enrofloxacin',
        dosage: '10 mg/kg berat badan',
        duration: '5-7 hari',
        notes: 'Berikan melalui air minum atau injeksi IM',
      },
      {
        type: 'curative' as const,
        name: 'Oxytetracycline',
        dosage: '20 mg/kg berat badan',
        duration: '5-7 hari',
        notes: 'Broad spectrum antibiotic',
      },
    ],
  },
  'Coccidiosis': {
    visualSigns: ['diare', 'bulu kusam', 'menggembung', 'lemas', 'postur bungkuk', 'diare berdarah'],
    confidence: 0.7,
    preventive: [
      'Hindari kandang lembab',
      'Ganti alas kandang sering',
      'Jangan tumpuk ayam berlebihan',
      'Additive anticoccidial dalam pakan',
    ],
    curative: [
      'Pengobatan anticoccidial',
      'Vitamin K untuk perdarahan',
      'Cairan elektrolit',
    ],
    medicines: [
      {
        type: 'preventive' as const,
        name: 'Amprolium',
        dosage: '0.012% dalam air minum',
        duration: '5-7 hari',
        notes: 'Thiamine perlu ditambah untuk ayam muda',
      },
      {
        type: 'curative' as const,
        name: 'Toltrazuril',
        dosage: '25 mg/kg',
        duration: '2-3 hari',
        notes: 'Lebih efektif untuk Coccidiosis berat',
      },
    ],
  },
  'Respiratory Disease': {
    visualSigns: ['batuk', 'bersin', 'napas berbunyi', 'mata membengkak', 'kepala bengkak', 'sayu'],
    confidence: 0.7,
    preventive: [
      'Jaga suhu 24-28°C',
      'Kelembaban 50-70%',
      'Ventilasi udara baik',
      'Hindari debu dan amonia',
    ],
    curative: [
      'Antibiotik fluoroquinolone',
      'Ventilasi maksimal',
      'Obat pernapasan',
    ],
    medicines: [
      {
        type: 'curative' as const,
        name: 'Enrofloxacin',
        dosage: '10 mg/kg/hari',
        duration: '5 hari',
        notes: 'Efektif untuk mycoplasma dan bakteri gram negatif',
      },
      {
        type: 'preventive' as const,
        name: 'Vitamin A & E',
        dosage: 'Sesuai petunjuk kemasan',
        duration: '10-14 hari',
        notes: 'Meningkatkan sistem imun',
      },
    ],
  },
  'Avian Influenza': {
    visualSigns: ['kematian mendadak', 'kepala bengkak', 'diare', 'sisir biru', 'edema wajah'],
    confidence: 0.9,
    preventive: [
      'Vaksinasi AI (jika diperlukan)',
      'Biosecurity ketat',
      'Hindari kontak unggas liar',
      'Sterilisasi peralatan',
    ],
    curative: [
      'Tidak ada pengobatan efektif',
      'Fokus pada isolasi dan biosecurity',
      'Lapor ke otoritas kesehatan',
    ],
    medicines: [
      {
        type: 'preventive' as const,
        name: 'Vaksin Avian Influenza',
        dosage: 'Sesuai petunjuk kemasan',
        duration: '1x aplikasi',
        notes: 'Vaksin inaktif tersedia, tergantung strain',
      },
    ],
  },
  'Gumboro': {
    visualSigns: ['lemas', 'tremor', 'demam', 'diare putih', 'depresi', 'bulu berdiri'],
    confidence: 0.75,
    preventive: [
      'Vaksinasi Gumboro aktif',
      'Biosecurity ketat',
      'Hygiene pakan dan air',
    ],
    curative: [
      'Tidak ada obat spesifik',
      'Elektrolit dalam air',
      'Vitamin dan mineral',
    ],
    medicines: [
      {
        type: 'preventive' as const,
        name: 'Vaksin Gumboro',
        dosage: 'Sesuai petunjuk kemasan',
        duration: '1x aplikasi',
        notes: 'Live atau inaktif tersedia',
      },
      {
        type: 'curative' as const,
        name: 'Elektrolit & Vitamin',
        dosage: 'Sesuai petunjuk kemasan',
        duration: '7-10 hari',
        notes: 'Dukungan suportif saja',
      },
    ],
  },
  'Tetelo (velogenic)': {
    visualSigns: ['kematian mendadak', 'kepala tertarik', 'lumpuh', 'diare hijau'],
    confidence: 0.85,
    preventive: [
      'Vaksinasi Newcastle aktif dan inaktif',
      'Biosecurity',
      'Jaga kondisi lingkungan',
    ],
    curative: [
      'Antibiotik untuk infeksi sekunder',
      'Vitamin dan mineral',
      'Isolasi',
    ],
    medicines: [
      {
        type: 'curative' as const,
        name: 'Enrofloxacin',
        dosage: '10 mg/kg/hari',
        duration: '5-7 hari',
        notes: 'Untuk infeksi bakteri sekunder',
      },
    ],
  },
  'Defisiensi Nutrisi': {
    visualSigns: ['pertumbuhan lambat', 'bulu kusam', 'lemas', 'tidak aktif', 'bobot badan rendah'],
    confidence: 0.75,
    preventive: [
      'Gunakan pakan berkualitas premium',
      'Sesuaikan nutrisi dengan umur ayam',
      'Berikan pakan berimbang (protein, energi)',
      'Monitor asupan pakan harian',
    ],
    curative: [
      'Tingkatkan kualitas pakan',
      'Berikan suplemen vitamin dan mineral',
      'Pastikan pakan selalu tersedia',
      'Monitor berat badan berkala',
    ],
    medicines: [
      {
        type: 'preventive' as const,
        name: 'Vitamin & Mineral Premium',
        dosage: 'Sesuai petunjuk kemasan',
        duration: '14-21 hari',
        notes: 'Tambahkan ke air minum atau pakan',
      },
      {
        type: 'curative' as const,
        name: 'Suplemen Nutrisi Lengkap',
        dosage: 'Sesuai kebutuhan (protein 18-24%)',
        duration: 'Berkelanjutan hingga normal',
        notes: 'Pakan berkualitas tinggi dengan nutrisi seimbang',
      },
    ],
  },
  'Infestasi Parasit': {
    visualSigns: ['diare', 'pertumbuhan terhambat', 'bulu kusam', 'anus merah/bengkak', 'lemas'],
    confidence: 0.8,
    preventive: [
      'Jaga kebersihan kandang rutin',
      'Ganti alas kandang berkala',
      'Hindari kandang lembab',
      'Berikan obat cacing berkala (setiap 4 minggu)',
    ],
    curative: [
      'Pemberian obat cacing (antihelmintic)',
      'Pembersihan kandang menyeluruh',
      'Disinfeksi peralatan dan kandang',
      'Isolasi ayam yang terinfestasi',
    ],
    medicines: [
      {
        type: 'preventive' as const,
        name: 'Obat Cacing Berkala',
        dosage: 'Sesuai petunjuk kemasan berdasarkan berat badan',
        duration: 'Diberikan setiap 4 minggu',
        notes: 'Dapat berupa oral atau dicampur pakan',
      },
      {
        type: 'curative' as const,
        name: 'Antihelmintic (Albendazole/Levamisole)',
        dosage: '10-20 mg/kg berat badan',
        duration: '1-3 hari',
        notes: 'Berikan melalui pakan atau air minum',
      },
    ],
  },
};

export async function analyzeChickenPhoto(imageBase64: string): Promise<DiseaseDetectionResult> {
  try {
    // Call Gemini Vision API to analyze the image
    const response = await fetch('/api/analyze-chicken-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze photo');
    }

    const result: DiseaseDetectionResult = await response.json();
    return result;
  } catch (error) {
    console.error('Error analyzing chicken photo:', error);
    throw error;
  }
}

// Process Gemini response and match with disease database
export function processGeminiResponse(geminiAnalysis: string): DiseaseDetectionResult {
  const diseases: DetectedDisease[] = [];
  let overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'good';

  // Simple disease matching based on keywords in Gemini response
  const analysisLower = geminiAnalysis.toLowerCase();

  // Check for each disease in the database
  for (const [diseaseName, details] of Object.entries(DISEASE_DATABASE)) {
    let matchCount = 0;
    const detectedSigns: string[] = [];

    // Check how many visual signs are mentioned
    for (const sign of details.visualSigns) {
      if (analysisLower.includes(sign)) {
        matchCount++;
        detectedSigns.push(sign);
      }
    }

    // If multiple signs match or disease is mentioned by name
    if (matchCount >= 2 || analysisLower.includes(diseaseName.toLowerCase())) {
      const confidence = Math.min(50 + matchCount * 15, 95);

      const medicineRecs: MedicineRecommendation[] = details.medicines.map(med => ({
        type: med.type,
        medicine: med.name,
        dosage: med.dosage,
        duration: med.duration,
        notes: med.notes,
      }));

      diseases.push({
        name: diseaseName,
        confidence,
        visualSigns: detectedSigns.length > 0 ? detectedSigns : details.visualSigns.slice(0, 3),
        immediateActions: [
          'Isolasi ayam yang sakit',
          'Cek kondisi kandang dan kebersihan',
          'Tingkatkan ventilasi',
          'Berikan air minum dengan elektrolit',
        ],
        preventive: details.preventive,
        curative: details.curative,
        medicineRecommendations: medicineRecs,
      });
    }
  }

  // Determine overall health
  if (diseases.length === 0) {
    overallHealth = 'excellent';
  } else if (diseases.length === 1) {
    const maxConfidence = diseases[0].confidence;
    if (maxConfidence > 80) overallHealth = 'critical';
    else if (maxConfidence > 60) overallHealth = 'poor';
    else overallHealth = 'fair';
  } else {
    overallHealth = 'poor';
  }

  const recommendations = [
    'Segera konsultasi dengan dokter hewan lokal',
    'Jaga sanitasi kandang dan peralatan',
    'Monitor suhu dan kelembaban kandang',
    'Berikan pakan berkualitas tinggi',
    'Pisahkan ayam sakit dari yang sehat',
    'Catat semua gejala dan perubahan perilaku',
  ];

  return {
    detected: diseases.length > 0,
    diseases,
    overallHealth,
    recommendations,
  };
}
