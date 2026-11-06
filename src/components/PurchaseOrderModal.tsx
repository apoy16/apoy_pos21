import React from 'react';
import { X, Printer, Download, CheckCircle, FileCheck, Building2 } from 'lucide-react';
import { ProcurementItem, PurchaseOrderInfo } from '../types';
import { formatNumberIndo, formatRupiah, terbilang } from '../utils/formatters';
import { BarcodeRenderer } from './BarcodeRenderer';
import { UnikmaLogo } from './UnikmaLogo';

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ProcurementItem[];
  poInfo: PurchaseOrderInfo;
  onPrint: () => void;
}

export const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  items,
  poInfo,
  onPrint,
}) => {
  if (!isOpen) return null;

  const totalBiaya = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);

  const handlePrintClick = () => {
    window.print();
    onPrint();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header (Non-printable) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-400/40 p-1 flex items-center justify-center">
              <UnikmaLogo size={28} />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide">
                Preview Surat Pesanan (Purchase Order)
              </h2>
              <p className="text-[11px] text-slate-400">
                Dokumen Resmi Pengadaan Barang & Jasa Universitas Komputama Cilacap (UNIKMA)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintClick}
              className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body (Printable Area) */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-slate-100/60 print:bg-white print:p-0">
          <div
            id="printable-po"
            className="bg-white max-w-3xl mx-auto p-8 sm:p-10 shadow-lg print:shadow-none border border-slate-200 print:border-none rounded-xl print:rounded-none text-slate-800"
          >
            {/* Kop Surat Resmi UNIKMA Cilacap */}
            <div className="flex items-center justify-between border-b-4 border-double border-slate-900 pb-4 mb-5">
              <div className="flex items-center gap-4">
                <div className="shrink-0 flex items-center justify-center">
                  <UnikmaLogo size={62} />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-black tracking-wider text-slate-900 uppercase">
                    UNIVERSITAS KOMPUTAMA CILACAP (UNIKMA)
                  </h1>
                  <p className="text-[11px] text-amber-700 font-semibold italic tracking-tight">
                    Ideologies, Digital-Economist, Adaptive, Leadership
                  </p>
                  <p className="text-xs font-bold text-blue-900 tracking-wide uppercase mt-0.5">
                    BIRO ADMINISTRASI UMUM, SARANA & PRASARANA (E-PROCUREMENT)
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Jl. Majenang - Cimanggu No.99, Cilacap, Jawa Tengah • Telp: 0815-6855-909 • info@unikmacilacap.ac.id
                  </p>
                </div>
              </div>
              <div className="text-right hidden sm:block shrink-0">
                <BarcodeRenderer
                  value={poInfo.poNumber}
                  width={1.2}
                  height={34}
                  fontSize={10}
                />
              </div>
            </div>

            {/* Title */}
            <div className="text-center my-4">
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-wide uppercase underline">
                SURAT PESANAN (PURCHASE ORDER)
              </h2>
              <div className="text-xs font-mono font-bold text-blue-950 mt-1">
                NOMOR: {poInfo.poNumber}
              </div>
            </div>

            {/* Metadata Info Box */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-lg p-3.5 my-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex">
                  <span className="w-28 text-slate-500 font-semibold">Tanggal Order</span>
                  <span className="text-slate-900 font-medium">: {poInfo.date}</span>
                </div>
                <div className="flex">
                  <span className="w-28 text-slate-500 font-semibold">Unit Pemohon</span>
                  <span className="text-slate-900 font-medium">: {poInfo.department}</span>
                </div>
                <div className="flex">
                  <span className="w-28 text-slate-500 font-semibold">Status</span>
                  <span className="text-emerald-700 font-bold">: DISAHKAN ({poInfo.status})</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex">
                  <span className="w-28 text-slate-500 font-semibold">Penyedia/Vendor</span>
                  <span className="text-slate-900 font-medium">
                    : <strong className="text-slate-900">{poInfo.vendor}</strong>
                    {poInfo.vendorPhone && (
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">
                        ({poInfo.vendorPhone})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-28 text-slate-500 font-semibold">Penanggung Jawab</span>
                  <span className="text-slate-900 font-medium">: {poInfo.pic}</span>
                </div>
                <div className="flex">
                  <span className="w-28 text-slate-500 font-semibold">Alamat Kirim</span>
                  <span className="text-slate-900 font-medium">: Gudang Logistik UNIKMA, Jl. Majenang - Cimanggu No.99, Cilacap</span>
                </div>
              </div>
            </div>

            {/* Table of Items */}
            <div className="border border-slate-300 rounded-lg overflow-hidden my-5">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[11px] border-b border-slate-300">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">No</th>
                    <th className="py-2.5 px-3">Deskripsi Barang / Jasa</th>
                    <th className="py-2.5 px-3 w-28 text-center">Kode Barcode</th>
                    <th className="py-2.5 px-3 w-16 text-center">Qty</th>
                    <th className="py-2.5 px-3 w-28 text-right">Harga Satuan</th>
                    <th className="py-2.5 px-3 w-32 text-right">Jumlah Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((it, idx) => (
                    <tr key={it.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        <div>{it.name}</div>
                        {it.notes && (
                          <div className="text-[10px] text-slate-500 font-normal italic">
                            Ket: {it.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-600">
                        {it.barcode}
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-800">
                        {it.quantity}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-700">
                        {formatNumberIndo(it.unitPrice)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                        {formatNumberIndo(it.quantity * it.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-slate-400 bg-slate-50 font-bold text-slate-900">
                  <tr>
                    <td colSpan={5} className="py-2.5 px-3 text-right font-bold text-xs">
                      TOTAL NILAI PENGADAAN :
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-blue-900 text-sm">
                      {formatRupiah(totalBiaya)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Terbilang block */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-3 text-xs mb-8">
              <span className="font-semibold text-blue-950">Terbilang : </span>
              <span className="italic font-medium text-blue-900">"{terbilang(totalBiaya)}"</span>
            </div>

            {/* Terms & Signatures */}
            <div className="grid grid-cols-2 gap-8 text-xs pt-4">
              <div>
                <p className="font-bold text-slate-800 mb-1">Syarat & Ketentuan Pengadaan:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                  <li>Barang wajib sesuai spesifikasi teknis dan telah diuji fungsi.</li>
                  <li>Faktur/Invoice & BAST dibuat rangkap 3 disertai stempel resmi.</li>
                  <li>Garansi resmi produk minimal 1 (satu) tahun terhitung saat serah terima.</li>
                </ol>
              </div>

              <div className="text-center flex flex-col items-center justify-between">
                <div>
                  <div className="text-slate-600">Cilacap, {poInfo.date}</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    Pejabat Pengadaan Barang & Jasa UNIKMA Cilacap
                  </div>
                </div>

                {/* Digital Stamp & Signature */}
                <div className="my-3 relative flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-2 border-red-500/50 text-red-600/70 font-bold text-[8px] uppercase flex flex-col items-center justify-center rotate-[-12deg] pointer-events-none select-none text-center leading-tight">
                    <span>* UNIKMA *</span>
                    <span className="text-[7px]">CILACAP</span>
                    <span className="text-[8px] font-mono font-black text-red-700">TERVERIFIKASI</span>
                    <span className="text-[7px]">PENGADAAN</span>
                  </div>
                  <div className="absolute font-serif italic text-blue-950 font-extrabold text-lg select-none">
                    Muhamad Ngafifudin
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-900 underline">
                    {poInfo.pic}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    NIP. 19880921 201503 1 002
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs no-print shrink-0">
          <div className="text-slate-500">
            Tekan <kbd className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-[10px]">Ctrl+P</kbd> atau tombol cetak untuk mencetak fisik atau simpan PDF.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
          >
            Tutup Preview
          </button>
        </div>
      </div>
    </div>
  );
};
