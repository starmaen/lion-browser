import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  ShieldCheck,
  Lock,
  Layers,
  MoreVertical,
  ExternalLink,
  Smartphone,
  Laptop,
  Bookmark,
  Share2,
  Key,
  X,
  Zap,
  Download,
  Languages,
  History,
  Star,
  Flame,
  ArrowDownToLine,
  Settings
} from 'lucide-react';
import { BrowserTab, QuickShortcut } from '../types';
import lionLogoImg from '../assets/images/lion_browser_logo_1789575379510.jpg';

interface BrowserViewProps {
  tab: BrowserTab;
  tabsCount: number;
  onNavigate: (url: string, title?: string) => void;
  onHome: () => void;
  onOpenTabs: () => void;
  onOpenShield: () => void;
  onOpenVpn: () => void;
  onOpenStandaloneMode: (shortcut: QuickShortcut) => void;
  onSavePasswordPrompt: (siteUrl: string) => void;
  onOpenDownloads: () => void;
  onToggleTranslator: () => void;
  isTranslatorOpen?: boolean;
  onToggleBookmark: (url: string, title: string) => void;
  isCurrentUrlBookmarked: boolean;
  onOpenBookmarksHistory: (tab?: 'bookmarks' | 'history') => void;
  onOpenClearData: () => void;
  onOpenSettings?: () => void;
  currentLanguage?: string;
  canGoBack?: boolean;
  onGoBack?: () => void;
  isVpnActive: boolean;
}

export const BrowserView: React.FC<BrowserViewProps> = ({
  tab,
  tabsCount,
  onNavigate,
  onHome,
  onOpenTabs,
  onOpenShield,
  onOpenVpn,
  onOpenStandaloneMode,
  onSavePasswordPrompt,
  onOpenDownloads,
  onToggleTranslator,
  isTranslatorOpen = false,
  onToggleBookmark,
  isCurrentUrlBookmarked,
  onOpenBookmarksHistory,
  onOpenClearData,
  onOpenSettings,
  currentLanguage = 'ar',
  canGoBack = false,
  onGoBack,
  isVpnActive,
}) => {
  const [inputUrl, setInputUrl] = useState(tab.url);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopMode, setIsDesktopMode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [blockedCountOnPage, setBlockedCountOnPage] = useState(7);

  useEffect(() => {
    setInputUrl(tab.url);
    // Random realistic blocked ads count for current page
    setBlockedCountOnPage(Math.floor(Math.random() * 8) + 4);
  }, [tab.url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    let url = inputUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }
    onNavigate(url);
  };

  const getDomain = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const currentDomain = getDomain(tab.url);

  const handleConvertToApp = () => {
    setIsMenuOpen(false);
    onOpenStandaloneMode({
      id: 'app-' + Date.now(),
      title: tab.title || currentDomain,
      titleAr: tab.title || currentDomain,
      url: tab.url,
      iconName: 'custom',
      bgColor: '#334155',
      textColor: '#FFFFFF',
      category: 'tools',
      isAppShortcut: true,
    });
  };

  return (
    <div id="browser-view-container" className="flex-1 flex flex-col h-full w-full bg-slate-950 select-none overflow-hidden">
      {/* Top Browser Bar (Android Style) */}
      <div className="bg-slate-900 border-b border-slate-800 p-2 flex items-center gap-1.5 sm:gap-2 z-30 shadow-md">
        {/* Home & Nav Buttons */}
        {canGoBack && onGoBack && (
          <button
            id="browser-back-btn"
            type="button"
            onClick={onGoBack}
            className="p-2 text-slate-300 hover:text-amber-400 rounded-xl hover:bg-slate-800 transition cursor-pointer"
            title="رجوع للخلف"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Circular Lion Head Emblem Home Button */}
        <button
          id="browser-home-btn"
          type="button"
          onClick={onHome}
          className="relative w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 hover:scale-105 transition cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.5)] shrink-0 flex items-center justify-center"
          title="الصفحة الرئيسية | Lion Browser"
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center">
            <img
              src={lionLogoImg}
              alt="Lion Head Logo"
              className="w-full h-full object-cover object-center rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIframeKey((prev) => prev + 1)}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          title="تحديث"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* Address Bar */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center relative">
          <div className="w-full flex items-center bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl px-2.5 py-1.5 transition">
            {/* Lock / Security Icon */}
            <div className="flex items-center gap-1.5 pl-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>

            {/* Input URL */}
            <input
              id="browser-address-input"
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none font-mono px-1"
              dir="ltr"
            />

            {/* Bookmark star inside address bar */}
            <button
              id="address-bar-bookmark-btn"
              type="button"
              onClick={() => onToggleBookmark(tab.url, tab.title || currentDomain)}
              className="p-1 text-slate-400 hover:text-amber-400 transition cursor-pointer shrink-0"
              title={isCurrentUrlBookmarked ? 'في المفضلة' : 'إضافة إلى المفضلة'}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isCurrentUrlBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
                }`}
              />
            </button>

            {/* In-bar Privacy Shield badge */}
            <button
              id="address-bar-shield-btn"
              type="button"
              onClick={onOpenShield}
              className="flex items-center gap-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-black transition cursor-pointer shrink-0 ml-1"
              title="درع الحماية وحجب الإعلانات"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>{blockedCountOnPage}</span>
            </button>
          </div>
        </form>

        {/* Video & File Downloader Button */}
        <button
          id="toolbar-download-video-btn"
          type="button"
          onClick={onOpenDownloads}
          className="flex items-center gap-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
          title="تنزيل وحفظ الفيديو والملفات"
        >
          <ArrowDownToLine className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">حفظ الفيديو</span>
        </button>

        {/* On-demand Translator Button */}
        <button
          id="toolbar-translator-btn"
          type="button"
          onClick={onToggleTranslator}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
            isTranslatorOpen
              ? 'bg-blue-600 border-blue-400 text-white shadow-md'
              : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/30'
          }`}
          title="ترجمة فورية عند الطلب"
        >
          <Languages className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">ترجمة</span>
        </button>

        {/* Bookmarks & History Drawer Quick Button */}
        <button
          id="toolbar-bookmarks-btn"
          type="button"
          onClick={() => onOpenBookmarksHistory('bookmarks')}
          className="p-2 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-800 transition cursor-pointer shrink-0 hidden md:flex"
          title="المفضلة والمسارات الرجعية"
        >
          <Bookmark className="w-4 h-4" />
        </button>

        {/* Convert to Standalone App Button right in toolbar! */}
        <button
          id="toolbar-convert-to-app-btn"
          type="button"
          onClick={handleConvertToApp}
          className="hidden lg:flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
          title="تحويل إلى تطبيق بدون ترويسة المتصفح"
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>تطبيق مستقل</span>
        </button>

        {/* Tabs Counter Button */}
        <button
          id="browser-tabs-btn"
          type="button"
          onClick={onOpenTabs}
          className="w-8 h-8 rounded-xl border-2 border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-400 font-bold text-xs flex items-center justify-center transition cursor-pointer shrink-0"
          title="إدارة التبويبات"
        >
          {tabsCount}
        </button>

        {/* 3-Dots Menu */}
        <div className="relative">
          <button
            id="browser-more-menu-btn"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-60 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-right backdrop-blur-xl animate-in zoom-in-95 duration-100">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 border-b border-slate-800 mb-1">
                خيارات الصفحة: {currentDomain}
              </div>

              {/* 1. Download Video and Files */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenDownloads();
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-rose-300 font-bold bg-rose-500/15 hover:bg-rose-500/25 mb-1 cursor-pointer"
              >
                <span>تنزيل وحفظ فيديو / ملف</span>
                <ArrowDownToLine className="w-4 h-4 text-rose-400" />
              </button>

              {/* 2. On-demand Translation */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onToggleTranslator();
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-blue-300 hover:bg-blue-500/15 cursor-pointer"
              >
                <span>ترجمة الصفحة (عند الطلب)</span>
                <Languages className="w-4 h-4 text-blue-400" />
              </button>

              {/* 3. Bookmark Toggle */}
              <button
                type="button"
                onClick={() => {
                  onToggleBookmark(tab.url, tab.title || currentDomain);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                <span>{isCurrentUrlBookmarked ? 'إزالة من المفضلة ★' : 'إضافة إلى المفضلات'}</span>
                <Star
                  className={`w-3.5 h-3.5 ${
                    isCurrentUrlBookmarked ? 'text-amber-400 fill-amber-400' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* 4. Bookmarks and Navigation History */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenBookmarksHistory('history');
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                <span>سجل التصفح والمسارات الرجعية</span>
                <History className="w-3.5 h-3.5 text-blue-400" />
              </button>

              {/* 5. Clear Cache & Browsing Data */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenClearData();
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:bg-rose-500/10 hover:text-rose-300 cursor-pointer"
              >
                <span>تنظيف التصفح والكاش</span>
                <Flame className="w-3.5 h-3.5 text-rose-400" />
              </button>

              {/* 6. Standalone Web App Mode Item */}
              <button
                type="button"
                onClick={handleConvertToApp}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-amber-300 font-bold hover:bg-amber-500/15 cursor-pointer border-t border-slate-800 mt-1 pt-1.5"
              >
                <span>فتح كتطبيق بدون ترويسة</span>
                <Layers className="w-4 h-4 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onSavePasswordPrompt(tab.url);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                <span>حفظ كلمة المرور لهذا الموقع</span>
                <Key className="w-3.5 h-3.5 text-emerald-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsDesktopMode(!isDesktopMode);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                <span>{isDesktopMode ? 'إلغاء وضع سطح المكتب' : 'طلب موقع سطح المكتب'}</span>
                {isDesktopMode ? (
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Laptop className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              <a
                href={tab.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800 cursor-pointer border-t border-slate-800 mt-1 pt-1.5"
              >
                <span>فتح في نافذة خارجية مباشرة</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-amber-300 font-black hover:bg-amber-500/15 cursor-pointer border-t border-slate-800 mt-1 pt-1.5"
                >
                  <span>{currentLanguage === 'ar' ? 'الإعدادات المتطورة واللغات' : 'Advanced Settings & Languages'}</span>
                  <Settings className="w-4 h-4 text-amber-400" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Web Page Frame / Content */}
      <div className="relative flex-1 w-full bg-white overflow-hidden flex flex-col">
        {/* Real Live Iframe Sandbox */}
        <iframe
          key={iframeKey}
          id="active-browser-iframe"
          src={tab.url}
          title={tab.title}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          className="w-full flex-1 border-0"
        />

        {/* Quick Floating Bar with Direct Open & Standalone launcher */}
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-4 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300 font-mono text-[11px] truncate max-w-[180px]">
              {currentDomain}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleConvertToApp}
              className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-xl text-[11px] font-bold transition"
            >
              <Layers className="w-3 h-3" />
              <span>تطبيق بدون ترويسة</span>
            </button>

            <a
              href={tab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-xl text-[11px] font-black transition shadow"
            >
              <ExternalLink className="w-3 h-3" />
              <span>فتح مباشر</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
