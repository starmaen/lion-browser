import React from 'react';
import { Plus, X, Globe, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { BrowserTab } from '../types';

interface TabsManagerModalProps {
  tabs: BrowserTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  onClose: () => void;
}

export const TabsManagerModal: React.FC<TabsManagerModalProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4">
      <div
        id="tabs-manager-modal"
        className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-white">التبويبات المفتوحة</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
              {tabs.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="new-tab-manager-btn"
              type="button"
              onClick={onNewTab}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>تبويب جديد</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs Grid */}
        <div className="p-4 flex-1 overflow-y-auto grid grid-cols-2 gap-3">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                id={`tab-card-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`relative rounded-2xl border p-3 cursor-pointer transition-all flex flex-col justify-between h-36 select-none ${
                  isActive
                    ? 'bg-slate-800/90 border-amber-400/80 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/30'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Tab Header inside Card */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-200 truncate">
                      {tab.title || 'صفحة ويب'}
                    </span>
                  </div>

                  {tabs.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id);
                      }}
                      className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Tab URL Preview */}
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800/80 text-[10px] text-slate-400 font-mono truncate">
                  {tab.url}
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>محمي</span>
                  </span>
                  {isActive && (
                    <span className="text-amber-300 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                      نشط حالياً
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>نظام تعليق التبويبات الخاملة مفعّل لتوفير الرام</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
