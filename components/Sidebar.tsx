'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { translations, Language } from '@/lib/translations';
import {
  LayoutDashboard,
  Newspaper,
  BarChart3,
  Settings,
  Menu,
  X,
  Globe,
} from 'lucide-react';

interface SidebarProps {
  currentPage?: string;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function Sidebar({
  currentPage = 'dashboard',
  language = 'id',
  onLanguageChange,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[language];

  const menuItems = [
    {
      id: 'dashboard',
      label: t.nav.dashboard,
      icon: LayoutDashboard,
      href: '/',
    },
    {
      id: 'berita',
      label: t.nav.news,
      icon: Newspaper,
      href: '/berita',
    },
    {
      id: 'analisis',
      label: t.nav.analytics,
      icon: BarChart3,
      href: '/analisis',
    },
    {
      id: 'settings',
      label: t.nav.settings,
      icon: Settings,
      href: '/',
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-emerald-600 text-white p-2 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          sticky overflow-y-auto top-0 h-screen w-64 
          bg-linear-to-b from-emerald-700 to-emerald-900 text-white
          transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:translate-x-0 flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-emerald-600 shrink-0">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-full" />
            AI Farm
          </h1>
          <p className="text-emerald-100 text-sm mt-1">Smart Agriculture</p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                      ${
                        isActive
                          ? 'bg-yellow-400 text-emerald-900 font-semibold'
                          : 'text-emerald-100 hover:bg-emerald-600'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Language Switcher */}
        <div className="p-4 border-t border-emerald-600 shrink-0">
          <div className="flex items-center gap-2 mb-3 text-sm text-emerald-100">
            <Globe size={16} />
            <span>Bahasa</span>
          </div>
          <div className="flex gap-2">
            {(['id', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange?.(lang)}
                className={`
                  flex-1 py-2 rounded text-sm font-medium transition-colors
                  ${
                    language === lang
                      ? 'bg-yellow-400 text-emerald-900'
                      : 'bg-emerald-600 text-emerald-100 hover:bg-emerald-500'
                  }
                `}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
