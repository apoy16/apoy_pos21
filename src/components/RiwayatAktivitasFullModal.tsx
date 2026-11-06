import React, { useState, useMemo } from 'react';
import {
  X,
  History,
  Calendar,
  Filter,
  Search,
  Download,
  Trash2,
  User,
  Clock,
  Pencil,
  Barcode,
  Plus,
  Printer,
  ChevronRight,
  FileSpreadsheet,
  Store,
} from 'lucide-react';
import { ActivityLog, ActionType, UserRole } from '../types';
import { formatShortDate } from '../utils/formatters';
import { UnikmaLogo } from './UnikmaLogo';

interface RiwayatAktivitasFullModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLog[];
  onClearLogs: () => void;
  onDeleteSingleLog?: (id: string, title: string) => void;
  onDeleteFilteredLogs?: (ids: string[]) => void;
  userRole?: UserRole;
}

export const RiwayatAktivitasFullModal: React.FC<RiwayatAktivitasFullModalProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
  onDeleteSingleLog,
  onDeleteFilteredLogs,
  userRole = 'admin',
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<ActionType | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'custom'>('all');

  const todayStr = formatShortDate();

  const handleDatePreset = (preset: 'all' | 'today' | 'custom') => {
    setDatePreset(preset);
    if (preset === 'today') {
      setSelectedDate(todayStr);
    } else if (preset === 'all') {
      setSelectedDate('');
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Type filter
      if (selectedType !== 'all' && log.type !== selectedType) return false;

      // Date filter
      if (selectedDate && log.dateStr !== selectedDate) return false;

      // Search keyword
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesDesc = log.description.toLowerCase().includes(query);
        const matchesUser = log.user.toLowerCase().includes(query);
        const matchesTitle = log.title.toLowerCase().includes(query);
        if (!matchesDesc && !matchesUser && !matchesTitle) return false;
      }

      return true;
    });
  }, [logs, selectedType, selectedDate, search]);

  if (!isOpen) return null;

  const exportToCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['ID', 'Tanggal', 'Waktu', 'Tipe', 'Judul', 'Deskripsi', 'Pengguna'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.dateStr,
      l.timeStr,
      l.type,
      `"${l.title.replace(/"/g, '""')}"`,
      `"${l.description.replace(/"/g, '""')}"`,
      `"${l.user.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Log_Pengadaan_UNIKMA_Cilacap_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (type: ActionType) => {
    switch (type) {
      case 'tambah':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <Plus className="w-3 h-3 text-emerald-600" />,
          label: 'Tambah',
        };
      case 'edit':
        return {
          bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          icon: <Pencil className="w-3 h-3 text-cyan-600" />,
          label: 'Edit',
        };
      case 'hapus':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          icon: <Trash2 className="w-3 h-3 text-red-500" />,
          label: 'Hapus',
        };
      case 'cetak':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Printer className="w-3 h-3 text-blue-600" />,
          label: 'Cetak PO',
        };
      case 'barcode':
        return {
          bg: 'bg-teal-50 text-teal-700 border-teal-200',
          icon: <Barcode className="w-3 h-3 text-teal-600" />,
          label: 'Barcode',
        };
      case 'vendor':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Store className="w-3 h-3 text-amber-600" />,
          label: 'Vendor',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: <Clock className="w-3 h-3 text-slate-500" />,
          label: 'Sistem',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0b1f42] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 p-1 border border-blue-400/40 flex items-center justify-center shrink-0">
              <UnikmaLogo size={30} />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide">
                Log Audit & Riwayat Perubahan Data Pengadaan
              </h2>
              <p className="text-[11px] text-blue-200/80">
                Pencatatan transparan seluruh aktivitas pengadaan barang & jasa Universitas Komputama Cilacap (UNIKMA)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-900/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          {/* Keyword Search */}
          <div className="sm:col-span-4 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari deskripsi atau pengguna..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          {/* Action Type Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ActionType | 'all')}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              <option value="all">Semua Jenis Aksi</option>
              <option value="tambah">Penambahan Item</option>
              <option value="edit">Perubahan (Edit)</option>
              <option value="hapus">Penghapusan</option>
              <option value="cetak">Pencetakan PO</option>
              <option value="barcode">Pencetakan Barcode</option>
              <option value="vendor">Manajemen Rekanan (Vendor)</option>
            </select>
          </div>

          {/* Date Range / Specific Date Filter */}
          <div className="sm:col-span-5 flex items-center gap-2">
            <div className="flex bg-slate-200/80 rounded-lg p-0.5 text-[11px] font-medium">
              <button
                type="button"
                onClick={() => handleDatePreset('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  datePreset === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Tanggal
              </button>
              <button
                type="button"
                onClick={() => handleDatePreset('today')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  datePreset === 'today' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hari Ini
              </button>
            </div>

            <div className="relative flex-1">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setDatePreset('custom');
                }}
                className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {selectedDate && (
              <button
                onClick={() => {
                  setSelectedDate('');
                  setDatePreset('all');
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
                title="Reset tanggal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-bold text-slate-800">{filteredLogs.length}</span> dari {logs.length} catatan aktivitas
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportToCSV}
              disabled={filteredLogs.length === 0}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor ke CSV</span>
            </button>

            {userRole === 'admin' && filteredLogs.length > 0 && filteredLogs.length < logs.length && onDeleteFilteredLogs && (
              <button
                onClick={() => onDeleteFilteredLogs(filteredLogs.map((l) => l.id))}
                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Hapus hanya log yang tampil sesuai filter saat ini"
              >
                <Trash2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Hapus Log Terfilter ({filteredLogs.length})</span>
              </button>
            )}

            {userRole === 'admin' && logs.length > 0 && (
              <button
                onClick={onClearLogs}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Hapus seluruh riwayat audit log (Khusus Manager/Admin)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Semua Log</span>
              </button>
            )}
          </div>
        </div>

        {/* Log Entries Table */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">Tidak ada catatan aktivitas</p>
              <p className="text-xs text-slate-400 mt-1">
                Ubah filter tanggal atau kata kunci untuk melihat rekaman lainnya.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredLogs.map((log) => {
                const badge = getActionBadge(log.type);
                return (
                  <div
                    key={log.id}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition-colors flex items-start gap-3 shadow-xs group"
                  >
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border shrink-0 ${badge.bg}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800">{log.title}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {log.dateStr}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-slate-600">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {log.timeStr}
                            </span>
                          </div>

                          {userRole === 'admin' && onDeleteSingleLog && (
                            <button
                              type="button"
                              onClick={() => onDeleteSingleLog(log.id, log.title)}
                              className="opacity-60 hover:opacity-100 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer"
                              title="Hapus entri log ini"
                              aria-label={`Hapus log ${log.title}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                        {log.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-500">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>Dilakukan oleh: <strong className="text-slate-700">{log.user}</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>Penyimpanan otomatis tersinkronisasi di LocalStorage peramban</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-700 font-medium cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
