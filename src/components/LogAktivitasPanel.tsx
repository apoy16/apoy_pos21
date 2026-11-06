import React, { useState } from 'react';
import {
  Clock,
  ArrowRight,
  Pencil,
  Trash2,
  Plus,
  Barcode,
  Printer,
  User,
  CheckCircle2,
  Filter,
  Calendar,
  Store,
} from 'lucide-react';
import { ActivityLog, ActionType } from '../types';
import { getCurrentTimeWIB } from '../utils/formatters';

interface LogAktivitasPanelProps {
  logs: ActivityLog[];
  onOpenFullHistory: () => void;
  selectedDateFilter?: string;
  onFilterDateChange?: (date: string) => void;
  onDeleteLog?: (id: string, title: string) => void;
}

export const LogAktivitasPanel: React.FC<LogAktivitasPanelProps> = ({
  logs,
  onOpenFullHistory,
  selectedDateFilter,
  onFilterDateChange,
  onDeleteLog,
}) => {
  const [filterType, setFilterType] = useState<ActionType | 'all'>('all');

  const filteredLogs = logs.filter((log) => {
    if (filterType !== 'all' && log.type !== filterType) return false;
    if (selectedDateFilter && log.dateStr !== selectedDateFilter) return false;
    return true;
  });

  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case 'edit':
        return <Pencil className="w-3.5 h-3.5 text-cyan-600" />;
      case 'barcode':
        return <Barcode className="w-3.5 h-3.5 text-teal-600" />;
      case 'hapus':
        return <Trash2 className="w-3.5 h-3.5 text-red-500" />;
      case 'tambah':
        return <Plus className="w-3.5 h-3.5 text-emerald-600" />;
      case 'cetak':
        return <Printer className="w-3.5 h-3.5 text-blue-600" />;
      case 'vendor':
        return <Store className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getActionBg = (type: ActionType) => {
    switch (type) {
      case 'edit':
        return 'bg-cyan-50 border-cyan-200';
      case 'barcode':
        return 'bg-teal-50 border-teal-200';
      case 'hapus':
        return 'bg-red-50 border-red-200';
      case 'tambah':
        return 'bg-emerald-50 border-emerald-200';
      case 'cetak':
        return 'bg-blue-50 border-blue-200';
      case 'vendor':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between h-full min-h-[500px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 tracking-tight">
              Riwayat Aktivitas Terbaru
            </h3>
          </div>
          <button
            onClick={onOpenFullHistory}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Quick Filter Pill / Date */}
        <div className="flex items-center gap-1.5 pb-3 mb-2 overflow-x-auto text-[10px] text-slate-600 border-b border-slate-50">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType('tambah')}
            className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
              filterType === 'tambah'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Tambah
          </button>
          <button
            onClick={() => setFilterType('edit')}
            className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
              filterType === 'edit'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setFilterType('hapus')}
            className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
              filterType === 'hapus'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Hapus
          </button>
        </div>

        {/* Activity Log Feed */}
        <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Tidak ada aktivitas yang sesuai filter.
            </div>
          ) : (
            filteredLogs.slice(0, 7).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 text-xs group hover:bg-slate-50/80 p-1.5 rounded-lg transition-colors"
              >
                {/* Circular Icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${getActionBg(
                    log.type
                  )}`}
                >
                  {getActionIcon(log.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-mono text-[11px] font-bold text-slate-700">
                      {log.timeStr}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.dateStr}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-800 leading-snug break-words">
                    {log.description}
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-1 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1 min-w-0">
                      <User className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                      <span className="truncate">{log.user}</span>
                    </div>
                    {onDeleteLog && (
                      <button
                        onClick={() => onDeleteLog(log.id, log.title)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer"
                        title="Hapus log ini"
                        aria-label="Hapus log ini"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom System Status Widget */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-emerald-900 leading-none mb-1">
              Sistem berjalan normal
            </div>
            <div className="text-[10px] text-emerald-700">
              Terakhir update: {getCurrentTimeWIB()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
