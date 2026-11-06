import React, { useState } from 'react';
import { PlusCircle, HelpCircle, Sparkles } from 'lucide-react';
import { ProcurementCategory, ProcurementItem } from '../types';

interface FormTambahItemProps {
  onAddItem: (itemData: Omit<ProcurementItem, 'id' | 'barcode' | 'addedAt' | 'status'>) => void;
}

const CATEGORIES: ProcurementCategory[] = [
  'Perangkat IT',
  'Perlengkapan Kantor',
  'Jasa & Pemeliharaan',
  'Peralatan Laboratorium',
  'Sarana & Prasarana',
  'Konsumsi & Kegiatan',
];

const PRESETS = [
  { name: 'Monitor LED 24 Inch IPS', cat: 'Perangkat IT' as ProcurementCategory, price: 1850000, qty: 3 },
  { name: 'Kertas HVS A4 80gr (Box)', cat: 'Perlengkapan Kantor' as ProcurementCategory, price: 245000, qty: 5 },
  { name: 'Proyektor Epson EB-E01', cat: 'Perangkat IT' as ProcurementCategory, price: 4950000, qty: 1 },
];

export const FormTambahItem: React.FC<FormTambahItemProps> = ({ onAddItem }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProcurementCategory | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Nama barang/jasa wajib diisi';
    if (!category) errs.category = 'Kategori wajib dipilih';
    const numPrice = Number(unitPrice.replace(/\D/g, ''));
    if (!unitPrice || isNaN(numPrice) || numPrice <= 0) {
      errs.unitPrice = 'Estimasi harga harus lebih dari 0';
    }
    if (quantity < 1) {
      errs.quantity = 'Jumlah minimal 1';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !category) return;

    const parsedPrice = Number(unitPrice.replace(/\D/g, ''));
    onAddItem({
      name: name.trim(),
      category: category as ProcurementCategory,
      quantity,
      unitPrice: parsedPrice,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setName('');
    setCategory('');
    setQuantity(1);
    setUnitPrice('');
    setNotes('');
    setErrors({});
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (!rawVal) {
      setUnitPrice('');
      return;
    }
    const formatted = new Intl.NumberFormat('id-ID').format(Number(rawVal));
    setUnitPrice(formatted);
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setName(preset.name);
    setCategory(preset.cat);
    setUnitPrice(new Intl.NumberFormat('id-ID').format(preset.price));
    setQuantity(preset.qty);
    setNotes('Rekomendasi kebutuhan unit UNIKMA Cilacap');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <PlusCircle className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">
            Tambah Item Pengadaan
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Nama Barang/Jasa */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Barang/Jasa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Laptop ASUS ROG / Jasa Instalasi Jaringan"
            className={`w-full px-3 py-2 text-xs rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
              errors.name
                ? 'border-red-400 focus:ring-red-200 bg-red-50/20'
                : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
            }`}
          />
          {errors.name && <p className="text-[11px] text-red-500 mt-0.5">{errors.name}</p>}
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProcurementCategory)}
            className={`w-full px-3 py-2 text-xs rounded-lg border bg-white transition-colors focus:outline-none focus:ring-2 ${
              errors.category
                ? 'border-red-400 focus:ring-red-200 bg-red-50/20'
                : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
            }`}
          >
            <option value="">Pilih Kategori</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-[11px] text-red-500 mt-0.5">{errors.category}</p>}
        </div>

        {/* Jumlah & Estimasi Harga Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jumlah <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estimasi Harga (Rp) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={unitPrice}
                onChange={handlePriceChange}
                placeholder="0"
                className={`w-full pl-3 pr-8 py-2 text-xs rounded-lg border transition-colors focus:outline-none focus:ring-2 font-mono ${
                  errors.unitPrice
                    ? 'border-red-400 focus:ring-red-200 bg-red-50/20'
                    : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                }`}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold select-none">
                Rp
              </span>
            </div>
            {errors.unitPrice && (
              <p className="text-[11px] text-red-500 mt-0.5">{errors.unitPrice}</p>
            )}
          </div>
        </div>

        {/* Catatan (Opsional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Catatan <span className="text-slate-400 text-[11px] font-normal">(Opsional)</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tambahkan catatan jika ada..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah ke Daftar</span>
        </button>
      </form>

      {/* Preset Suggestions */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Rekomendasi Cepat:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-[11px] px-2 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-600 rounded border border-slate-200 transition-colors text-left"
            >
              + {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
