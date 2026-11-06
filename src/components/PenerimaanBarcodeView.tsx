import React, { useState } from 'react';
import {
  Barcode as BarcodeIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  Printer,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { ProcurementItem } from '../types';
import { formatRupiah } from '../utils/formatters';
import { BarcodeRenderer } from './BarcodeRenderer';
import { UnikmaLogo } from './UnikmaLogo';

interface PenerimaanBarcodeViewProps {
  items: ProcurementItem[];
  onUpdateItemStatus: (id: string, status: ProcurementItem['status'], barcode: string) => void;
  onOpenBarcodeModal: (item: ProcurementItem) => void;
}

export const PenerimaanBarcodeView: React.FC<PenerimaanBarcodeViewProps> = ({
  items,
  onUpdateItemStatus,
  onOpenBarcodeModal,
}) => {
  const [scanInput, setScanInput] = useState('');
  const [searchedItem, setSearchedItem] = useState<ProcurementItem | null>(null);
  const [searchedNotFound, setSearchedNotFound] = useState(false);

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = scanInput.trim().toUpperCase();
    if (!query) return;

    // Search by barcode code or item name
    const found = items.find(
      (it) => it.barcode.toUpperCase() === query || it.id.toUpperCase() === query
    );

    if (found) {
      setSearchedItem(found);
      setSearchedNotFound(false);
    } else {
      setSearchedItem(null);
      setSearchedNotFound(true);
    }
  };

  const handleVerifyReceipt = (item: ProcurementItem) => {
    onUpdateItemStatus(item.id, 'Diterima', item.barcode);
    setSearchedItem({ ...item, status: 'Diterima' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-950 p-1 border border-teal-500/30 flex items-center justify-center shrink-0">
            <UnikmaLogo size={32} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>Penerimaan Fisik & Verifikasi Barcode</span>
            </h2>
            <p className="text-xs text-slate-500">
              Validasi fisik serah terima barang dari penyedia ke gudang logistik Universitas Komputama Cilacap (UNIKMA)
            </p>
          </div>
        </div>
      </div>

      {/* Barcode Scanner Input Simulator */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <form onSubmit={handleScanSubmit} className="max-w-xl mx-auto space-y-3 text-center">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 mx-auto flex items-center justify-center border border-teal-200">
            <BarcodeIcon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            Pindai atau Masukkan Nomor Barcode Aset
          </h3>
          <p className="text-xs text-slate-500">
            Arahkan barcode scanner fisik atau ketik kode inventaris (contoh: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-teal-700 font-bold">BRG-2026-001</code>)
          </p>

          <div className="flex gap-2 pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={scanInput}
                onChange={(e) => {
                  setScanInput(e.target.value);
                  setSearchedNotFound(false);
                }}
                placeholder="Scan / Masukkan kode barcode..."
                className="w-full pl-4 pr-10 py-2.5 text-xs font-mono uppercase bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 font-bold tracking-wider"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Cari Item
            </button>
          </div>

          {searchedNotFound && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Kode barcode "{scanInput}" tidak ditemukan dalam daftar pengadaan saat ini.</span>
            </div>
          )}
        </form>

        {/* Found Item Result Card */}
        {searchedItem && (
          <div className="mt-6 border-t border-slate-100 pt-6 max-w-xl mx-auto">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Item Ditemukan</span>
                </span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    searchedItem.status === 'Diterima'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  Status: {searchedItem.status}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left space-y-1">
                  <h4 className="font-bold text-sm text-slate-900">{searchedItem.name}</h4>
                  <div className="text-xs text-slate-500">
                    Kategori: <strong className="text-slate-700">{searchedItem.category}</strong>
                  </div>
                  <div className="text-xs text-slate-500">
                    Jumlah: <strong className="text-slate-800">{searchedItem.quantity} unit</strong> • Est. Total: {formatRupiah(searchedItem.quantity * searchedItem.unitPrice)}
                  </div>
                </div>

                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                  <BarcodeRenderer
                    value={searchedItem.barcode}
                    width={1.2}
                    height={36}
                    fontSize={10}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onOpenBarcodeModal(searchedItem)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Cetak Label Fisik</span>
                </button>
                {searchedItem.status !== 'Diterima' && (
                  <button
                    type="button"
                    onClick={() => handleVerifyReceipt(searchedItem)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>Konfirmasi Penerimaan Fisik (BAST)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Barcode Table of All Registered Items */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center justify-between">
          <span>Daftar Barcode Aktif Pengadaan ({items.length} Item)</span>
          <span className="text-[11px] text-slate-500 font-normal">Klik tombol cetak untuk mencetak stiker inventaris</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="p-3 border border-slate-200 rounded-lg flex items-center justify-between gap-3 hover:border-teal-400 bg-slate-50/50 transition-colors"
            >
              <div className="min-w-0">
                <div className="font-semibold text-xs text-slate-800 truncate">{it.name}</div>
                <div className="font-mono text-[11px] text-teal-700 font-bold">{it.barcode}</div>
                <div className="text-[10px] text-slate-500">
                  {it.quantity} unit • {it.category}
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1">
                <button
                  onClick={() => {
                    setScanInput(it.barcode);
                    setSearchedItem(it);
                    setSearchedNotFound(false);
                  }}
                  className="px-2 py-1 bg-white border border-slate-200 hover:bg-teal-50 hover:text-teal-700 rounded text-[10px] font-semibold transition-colors"
                >
                  Pilih
                </button>
                <button
                  onClick={() => onOpenBarcodeModal(it)}
                  className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                >
                  <Printer className="w-2.5 h-2.5" />
                  <span>Stiker</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
