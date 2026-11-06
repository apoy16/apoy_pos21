import React, { useState } from 'react';
import { X, Printer, Barcode as BarcodeIcon, Tag, Check, Copy } from 'lucide-react';
import { ProcurementItem } from '../types';
import { formatRupiah } from '../utils/formatters';
import { BarcodeRenderer } from './BarcodeRenderer';
import { UnikmaLogo } from './UnikmaLogo';

interface BarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ProcurementItem | null;
  allItems?: ProcurementItem[];
  onLogPrintBarcode: (barcodeStr: string) => void;
}

export const BarcodeModal: React.FC<BarcodeModalProps> = ({
  isOpen,
  onClose,
  item,
  allItems = [],
  onLogPrintBarcode,
}) => {
  const [printAll, setPrintAll] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || (!item && allItems.length === 0)) return null;

  const targetItems = printAll ? allItems : item ? [item] : allItems;

  const handlePrint = () => {
    if (item) {
      onLogPrintBarcode(item.barcode);
    } else if (allItems.length > 0) {
      onLogPrintBarcode('Semua Item (' + allItems.length + ' label)');
    }
    window.print();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-400/30 p-1 flex items-center justify-center">
              <UnikmaLogo size={24} />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide">
                Label Barcode Inventaris UNIKMA Cilacap
              </h2>
              <p className="text-[11px] text-slate-400">
                Standar Identifikasi Aset & Pengadaan Universitas Komputama Cilacap
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {allItems.length > 1 && (
              <button
                onClick={() => setPrintAll(!printAll)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  printAll
                    ? 'bg-teal-600 text-white border-teal-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                {printAll ? 'Cetak Satuan' : 'Cetak Semua (' + allItems.length + ')'}
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Label</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {targetItems.map((target) => (
              <div
                key={target.id}
                className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-between text-center relative group hover:border-blue-400 transition-colors shadow-xs"
              >
                {/* Sticker Header */}
                <div className="w-full border-b border-slate-200 pb-2 mb-2 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 tracking-wider">
                    <UnikmaLogo size={16} />
                    <span>UNIKMA CILACAP</span>
                  </div>
                  <span className="text-slate-500 font-mono">{target.category}</span>
                </div>

                <div className="font-bold text-xs text-slate-800 line-clamp-1 mb-1">
                  {target.name}
                </div>

                {/* Barcode Graphic */}
                <div className="my-2 bg-white px-2 py-1 rounded">
                  <BarcodeRenderer
                    value={target.barcode}
                    width={1.4}
                    height={44}
                    fontSize={11}
                  />
                </div>

                {/* Sticker Footer */}
                <div className="w-full border-t border-slate-100 pt-2 mt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Est: {formatRupiah(target.unitPrice)}</span>
                  <button
                    onClick={() => copyCode(target.barcode)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 p-0.5 rounded cursor-pointer"
                    title="Salin kode barcode"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{target.barcode}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between no-print">
          <span>Format: CODE128 • Kompatibel dengan semua jenis barcode scanner laser/CCD</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-200 font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
