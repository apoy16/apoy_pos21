import React from 'react';
import {
  TrendingUp,
  Package,
  Layers,
  FileCheck,
  Coins,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  Printer,
  PlusCircle,
} from 'lucide-react';
import { ProcurementItem, ActivityLog } from '../types';
import { formatNumberIndo, formatRupiah, terbilang } from '../utils/formatters';
import { UnikmaLogo } from './UnikmaLogo';

interface DashboardViewProps {
  items: ProcurementItem[];
  logs: ActivityLog[];
  vendorCount?: number;
  onNavigateToPengajuan: () => void;
  onOpenPO: () => void;
  onOpenLogs: () => void;
  onNavigateToVendors?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  items,
  logs,
  vendorCount = 0,
  onNavigateToPengajuan,
  onOpenPO,
  onOpenLogs,
  onNavigateToVendors,
}) => {
  const totalBiaya = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
  const totalItemCount = items.reduce((sum, it) => sum + it.quantity, 0);

  // Group by category
  const categoryStats = items.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.quantity * curr.unitPrice;
    return acc;
  }, {} as Record<string, number>);

  const budgetLimit = 50000000; // Rp 50.000.000 pagu anggaran semester
  const budgetUsagePercent = Math.min(100, Math.round((totalBiaya / budgetLimit) * 100));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0b254e] via-[#0f346e] to-[#0284c7] rounded-2xl text-white p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-950/90 border border-blue-400/40 p-1.5 flex items-center justify-center shrink-0 shadow-md">
              <UnikmaLogo size={38} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20 text-cyan-200 font-bold">
                DASHBOARD EKSEKUTIF PENGADAAN KAMPUS
              </span>
              <div className="text-[11px] text-amber-300 font-medium italic mt-0.5">
                Ideologies, Digital-Economist, Adaptive, Leadership
              </div>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Universitas Komputama Cilacap (UNIKMA)
          </h1>
          <p className="text-xs text-blue-100 mt-1 leading-relaxed">
            Sistem pengadaan terpadu kampus Cimanggu / Majenang, Jawa Tengah. Monitoring efisiensi anggaran, pencetakan Surat Pesanan (PO), serta tracking barcode aset logistik.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={onNavigateToPengajuan}
              className="px-4 py-2 bg-white text-blue-900 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>Kelola Pengajuan & Keranjang</span>
            </button>
            {onNavigateToVendors && (
              <button
                onClick={onNavigateToVendors}
                className="px-4 py-2 bg-amber-500/90 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Kelola Vendor ({vendorCount})</span>
              </button>
            )}
            <button
              onClick={onOpenPO}
              className="px-4 py-2 bg-blue-700/80 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-blue-400/40 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Purchase Order</span>
            </button>
          </div>
        </div>
        {/* Subtle Watermark */}
        <div className="absolute right-6 -bottom-6 opacity-10 text-9xl font-black select-none pointer-events-none">
          UNIKMA
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Nilai */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Nilai Pengajuan</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900">{formatRupiah(totalBiaya)}</div>
          <div className="mt-2 text-[11px] text-blue-700 font-medium">
            {budgetUsagePercent}% dari pagu anggaran semester
          </div>
        </div>

        {/* Total Item */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Jenis Barang & Jasa</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900">{items.length} Macam</div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium">
            Total unit fisik: {totalItemCount} unit
          </div>
        </div>

        {/* Pagu Anggaran */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Sisa Pagu Anggaran</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {formatRupiah(Math.max(0, budgetLimit - totalBiaya))}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Pagu maksimal: {formatRupiah(budgetLimit)}
          </div>
        </div>

        {/* Log Aktivitas */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Audit Trail</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900">{logs.length} Aktivitas</div>
          <button
            onClick={onOpenLogs}
            className="mt-2 text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Buka log audit</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribusi Anggaran per Kategori */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-sm p-5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center justify-between">
            <span>Alokasi Anggaran Berdasarkan Kategori</span>
            <span className="text-slate-400 font-mono text-[11px]">UNIKMA E-Proc</span>
          </h3>

          <div className="space-y-4">
            {Object.entries(categoryStats).map(([cat, amount]) => {
              const pct = totalBiaya > 0 ? Math.round((amount / totalBiaya) * 100) : 0;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{cat}</span>
                    <span className="font-mono text-slate-900 font-bold">
                      {formatRupiah(amount)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#0284c7] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Verifikasi dan SOP Kampus */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>SOP Verifikasi Pengadaan</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>Unit pengusul memasukkan daftar barang/jasa beserta estimasi harga.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>Sistem mengenerate kode barcode unik (CODE128) per item.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>Purchase Order (PO) disahkan pejabat pengadaan dan dicetak resmi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <span>Barang datang diverifikasi via scan barcode dan disahkan BAST.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 italic">
            * Seluruh transaksi tercatat otomatis di Log Audit untuk kepatuhan akuntabilitas publik.
          </div>
        </div>
      </div>
    </div>
  );
};
