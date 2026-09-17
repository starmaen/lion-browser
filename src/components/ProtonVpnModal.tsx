import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Globe,
  Radio,
  Power,
  Zap,
  Lock,
  ArrowDown,
  ArrowUp,
  X,
  CheckCircle2,
  AlertCircle,
  Sliders,
} from 'lucide-react';
import { VpnServer, VpnState } from '../types';
import { PROTON_VPN_SERVERS } from '../data/initialData';

interface ProtonVpnModalProps {
  vpnState: VpnState;
  onToggleConnect: () => void;
  onSelectServer: (server: VpnServer) => void;
  onToggleKillSwitch: () => void;
  onClose: () => void;
}

export const ProtonVpnModal: React.FC<ProtonVpnModalProps> = ({
  vpnState,
  onToggleConnect,
  onSelectServer,
  onToggleKillSwitch,
  onClose,
}) => {
  const [sessionTime, setSessionTime] = useState<string>('00:00:00');

  useEffect(() => {
    let interval: any;
    if (vpnState.isConnected && vpnState.connectedSince) {
      interval = setInterval(() => {
        const diff = Math.floor((Date.now() - vpnState.connectedSince!) / 1000);
        const hours = Math.floor(diff / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const seconds = (diff % 60).toString().padStart(2, '0');
        setSessionTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    } else {
      setSessionTime('00:00:00');
    }
    return () => clearInterval(interval);
  }, [vpnState.isConnected, vpnState.connectedSince]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4">
      <div
        id="proton-vpn-modal"
        className="bg-slate-900 border border-purple-500/30 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Header with Proton Branding */}
        <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 p-4 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Proton VPN Free</h3>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                  مجاني 100%
                </span>
              </div>
              <p className="text-[11px] text-purple-300/80 font-medium">
                حماية وتشفير عسكري من سويسرا داخل Lion Browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card & Power Toggle */}
        <div className="p-5 flex flex-col items-center justify-center border-b border-slate-800/80 bg-slate-950/50">
          <div className="relative mb-3">
            {/* Pulsing ring when connected */}
            {vpnState.isConnected && (
              <div className="absolute -inset-3 rounded-full bg-purple-500/20 animate-ping duration-1000"></div>
            )}
            
            <button
              id="proton-vpn-toggle-btn"
              type="button"
              onClick={onToggleConnect}
              className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 cursor-pointer ${
                vpnState.isConnected
                  ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-purple-500/30 scale-105 ring-4 ring-purple-400/30'
                  : 'bg-slate-800 text-slate-400 hover:text-purple-300 hover:bg-slate-700'
              }`}
            >
              <Power className="w-8 h-8" />
            </button>
          </div>

          <div className="text-center">
            <span
              className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                vpnState.isConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {vpnState.isConnected ? 'متصل ومحمي بنجاح' : 'غير متصل (انقر للتشغيل)'}
            </span>

            {vpnState.isConnected && (
              <div className="mt-2 text-xs font-mono text-purple-300 font-bold">
                مدة الاتصال: {sessionTime}
              </div>
            )}
          </div>

          {/* Current IP & Protocol */}
          <div className="grid grid-cols-2 gap-2 w-full mt-4 text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">عنوان IP الظاهر</span>
              <span className="font-mono font-bold text-slate-200">
                {vpnState.isConnected ? vpnState.activeServer.ip : 'عنوانك الحقيقي (مكشوف)'}
              </span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">البروتوكول والتشفير</span>
              <span className="font-mono font-bold text-purple-300">WireGuard • AES-256</span>
            </div>
          </div>
        </div>

        {/* Server Selection List */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300">سيرفرات بروتون المجانية المتاحة:</span>
            <span className="text-[10px] text-emerald-400 font-mono">سريعة وبدون قيود بيانات</span>
          </div>

          <div className="space-y-2">
            {PROTON_VPN_SERVERS.map((server) => {
              const isCurrent = vpnState.activeServer.id === server.id;
              return (
                <button
                  key={server.id}
                  id={`server-btn-${server.id}`}
                  type="button"
                  onClick={() => onSelectServer(server)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition text-right cursor-pointer ${
                    isCurrent
                      ? 'bg-purple-950/40 border-purple-500/50 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{server.flag}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        <span>{server.countryAr}</span>
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {server.city} • IP: {server.ip}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <div className="text-right">
                      <span className="text-[10px] block font-mono text-slate-400">
                        الضغط: {server.load}%
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400 font-mono">
                        {server.ping} ms
                      </span>
                    </div>
                    {isCurrent && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Kill Switch Toggle */}
          <div className="mt-4 p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  مفتاح الإيقاف التلقائي (Kill Switch)
                </span>
                <span className="text-[10px] text-slate-400">
                  حظر الإنترنت فوراً في حال انقطاع اتصال VPN لمنع أي تسريب للبيانات
                </span>
              </div>
            </div>
            <button
              id="vpn-killswitch-toggle"
              type="button"
              onClick={onToggleKillSwitch}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                vpnState.killSwitchEnabled ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  vpnState.killSwitchEnabled ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <Zap className="w-3.5 h-3.5" />
            <span>لا توجد حدود للسرعة أو سعة الاستهلاك</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
