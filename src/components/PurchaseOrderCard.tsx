import React from 'react';
import {
  FileText,
  Maximize2,
  Printer,
  Calendar,
  User,
  Building,
  CheckCircle2,
  Info,
  Crown,
  Lock,
} from 'lucide-react';
import { ProcurementItem, PurchaseOrderInfo, Vendor, UserRole } from '../types';
import { formatNumberIndo, formatRupiah } from '../utils/formatters';
import { BarcodeRenderer } from './BarcodeRenderer';
import { UnikmaLogo } from './UnikmaLogo';

interface PurchaseOrderCardProps {
  items: ProcurementItem[];
  poInfo: PurchaseOrderInfo;
  vendors?: Vendor[];
  onSelectVendor?: (vendor: Vendor) => void;
  onPreviewFullscreen: () => void;
  onPrintPO: () => void;
  onNavigateToVendors?: () => void;
  userRole?: UserRole;
  onApprovePO?: () => void;
}

export const PurchaseOrderCard: React.FC<PurchaseOrderCardProps> = ({
  items,
  poInfo,
  vendors = [],
  onSelectVendor,
  onPreviewFullscreen,
  onPrintPO,
  onNavigateToVendors,
  userRole = 'admin',
  onApprovePO,
}) => {
  const totalBiaya = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);

  const canManageVendorPO = userRole === 'admin';
  const isOwner = userRole === 'owner';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Surat Pesanan Preview (Cols 2) */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Surat Pesanan / Purchase Order (PO)</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                poInfo.status === 'Disetujui'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}
            >
              Status: {poInfo.status}
            </span>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
              {poInfo.poNumber}
            </span>
          </div>
        </div>

        {/* Paper Document Preview */}
        <div className="p-4 sm:p-5 flex-1 bg-gradient-to-b from-white to-slate-50/50">
          <div className="border border-slate-300 rounded-lg p-4 bg-white shadow-xs text-[11px]">
            {/* Kop Surat */}
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <UnikmaLogo size={38} />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900 tracking-wider">
                    UNIVERSITAS KOMPUTAMA CILACAP (UNIKMA)
                  </div>
                  <div className="text-[10px] text-amber-700 font-semibold italic">
                    Ideologies, Digital-Economist, Adaptive, Leadership
                  </div>
                  <div className="text-[9px] text-slate-500 font-normal">
                    Jl. Majenang - Cimanggu No.99, Cilacap • Telp: 0815-6855-909 • info@unikmacilacap.ac.id
                  </div>
                </div>
              </div>
              <div className="hidden sm:block">
                <BarcodeRenderer
                  value={poInfo.poNumber}
                  width={1}
                  height={25}
                  fontSize={9}
                  className="scale-90 origin-right"
                />
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 my-3 text-[11px] text-slate-700">
              <div className="flex">
                <span className="w-20 text-slate-500 font-medium">No. PO</span>
                <span className="font-mono font-bold text-slate-900">: {poInfo.poNumber}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-slate-500 font-medium">Tanggal</span>
                <span>: {poInfo.date}</span>
              </div>
              <div className="flex items-center">
                <span className="w-20 text-slate-500 font-medium shrink-0">Penyedia</span>
                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                  <span className="text-slate-900 font-semibold truncate">: {poInfo.vendor}</span>
                  {vendors.length > 0 && onSelectVendor && canManageVendorPO ? (
                    <select
                      value={vendors.find((v) => v.name === poInfo.vendor)?.id || ''}
                      onChange={(e) => {
                        const selected = vendors.find((v) => v.id === e.target.value);
                        if (selected) onSelectVendor(selected);
                      }}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded px-1 py-0.5 text-slate-700 cursor-pointer font-medium focus:outline-none"
                      title="Ganti vendor rekanan untuk PO ini (Manager/Admin)"
                    >
                      <option value="" disabled>Ganti Vendor...</option>
                      {vendors.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.code} - {v.name}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </div>
              </div>
              <div className="flex">
                <span className="w-20 text-slate-500 font-medium">PIC</span>
                <span className="font-medium">: {poInfo.pic}</span>
              </div>
            </div>

            {/* Items Table in PO */}
            <div className="border border-slate-300 rounded overflow-hidden my-3">
              <table className="w-full text-[10px] text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                  <tr>
                    <th className="py-1 px-2 w-7 text-center">No</th>
                    <th className="py-1 px-2">Nama Barang/Jasa</th>
                    <th className="py-1 px-2 text-center w-14">Jumlah</th>
                    <th className="py-1 px-2 text-right w-24">Harga Satuan</th>
                    <th className="py-1 px-2 text-right w-24">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-3 text-center text-slate-400">
                        Belum ada item dalam daftar pesanan
                      </td>
                    </tr>
                  ) : (
                    items.map((item, i) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-1 px-2 text-center text-slate-500">{i + 1}</td>
                        <td className="py-1 px-2 font-medium text-slate-800">{item.name}</td>
                        <td className="py-1 px-2 text-center font-mono">{item.quantity}</td>
                        <td className="py-1 px-2 text-right font-mono">
                          {formatNumberIndo(item.unitPrice)}
                        </td>
                        <td className="py-1 px-2 text-right font-mono font-semibold">
                          {formatNumberIndo(item.quantity * item.unitPrice)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-300 font-bold text-slate-900">
                  <tr>
                    <td colSpan={4} className="py-1.5 px-2 text-right">
                      Total Biaya
                    </td>
                    <td className="py-1.5 px-2 text-right font-mono text-blue-900">
                      {formatRupiah(totalBiaya)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Footer Signature */}
            <div className="flex items-end justify-between pt-2 mt-2 text-[10px]">
              <div className="text-slate-500 italic">
                Terima kasih atas kerjasamanya.
              </div>
              <div className="text-center">
                <div className="text-slate-600">Cilacap, {poInfo.date}</div>
                <div className="text-slate-600 font-medium">Pejabat Pengadaan</div>
                {/* Simulated Signature */}
                <div className="py-1">
                  <div className="inline-block font-serif italic text-blue-900 text-sm font-bold tracking-widest border-b border-slate-700 pb-0.5 px-4">
                    Muhamad Ngafifudin
                  </div>
                </div>
                <div className="text-[9px] text-slate-500">NIP. 19880921 201503 1 002</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons with Role-Based Approval */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            {/* Owner Approval Badge / Button */}
            {isOwner && poInfo.status !== 'Disetujui' && onApprovePO && (
              <button
                type="button"
                onClick={onApprovePO}
                className="px-3.5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Crown className="w-4 h-4 text-slate-950" />
                <span>Beri Persetujuan PO (Owner Approval)</span>
              </button>
            )}

            {poInfo.status === 'Disetujui' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>PO Disetujui Pimpinan / Rektorat</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPreviewFullscreen}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Preview Fullscreen</span>
            </button>
            <button
              onClick={onPrintPO}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Download PO</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Pengadaan (Col 1) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold text-slate-800 pb-2.5 mb-3 border-b border-slate-100 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Info Pengadaan</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Jumlah Item
              </span>
              <span className="font-bold text-slate-800">{items.length}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 flex items-center gap-1.5">
                <span className="text-slate-400 font-bold text-[11px]">Rp</span>
                Total Estimasi
              </span>
              <span className="font-bold text-slate-900">{formatRupiah(totalBiaya)}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Status PO
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  poInfo.status === 'Disetujui'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    poInfo.status === 'Disetujui' ? 'bg-emerald-500' : 'bg-blue-600 animate-pulse'
                  }`}
                />
                {poInfo.status}
              </span>
            </div>

            {poInfo.status === 'Disetujui' && (
              <div className="p-2.5 bg-emerald-50/80 rounded-lg border border-emerald-200 text-[11px] text-emerald-900">
                <div className="font-bold flex items-center gap-1 text-emerald-800">
                  <Crown className="w-3 h-3 text-amber-500" />
                  <span>Disetujui oleh:</span>
                </div>
                <div className="font-semibold mt-0.5">
                  {poInfo.approver || 'Dr. H. M. Komaruddin, M.Kom.'}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">
                  Rektorat / Pimpinan Yayasan
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informational Callout */}
        <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200/70 rounded-lg text-[11px] text-blue-800 flex items-start gap-2 leading-relaxed">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            {userRole === 'owner'
              ? 'Sebagai Owner/Pimpinan, Anda berwenang memberikan persetujuan akhir (approval) sebelum Purchase Order diterbitkan ke rekanan penyedia.'
              : userRole === 'karyawan'
              ? 'Item yang Anda ajukan akan divalidasi oleh Manager Pengadaan dan diverifikasi oleh Rektorat.'
              : 'Surat Pesanan (PO) dapat dicetak dan diterbitkan setelah disetujui pimpinan.'}
          </span>
        </div>
      </div>
    </div>
  );
};
