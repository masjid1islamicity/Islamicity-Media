import React from 'react';
import { Bell, X, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'prayer' | 'kajian' | 'info';
}

interface InAppToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const InAppToast: React.FC<InAppToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-emerald-500/60 rounded-xl shadow-2xl p-4 text-xs transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            {toast.type === 'prayer' ? (
              <Clock className="w-4 h-4 text-emerald-400" />
            ) : (
              <Bell className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-white text-sm">
              <span>{toast.title}</span>
            </div>
            <p className="text-slate-300 mt-1 leading-relaxed">
              {toast.message}
            </p>
            <span className="text-[10px] text-emerald-400/80 font-mono mt-1 block">
              Islamicity Media Notification
            </span>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
