'use client';

import { NewsPanel } from "@/components/NewsPanel";
import { Sidebar } from "@/components/Sidebar";
import { Language } from "@/lib/translations";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Berita() {
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
          <NewsPanel key={refreshTrigger} />
        </div>
      </main>
        </div>
    );
}