import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  Tag,
  Check,
  ArrowRight,
  Pencil,
  Trash2,
  X,
  Filter,
  SlidersHorizontal,
  Building2,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Barcode,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
  Lock,
} from 'lucide-react';
import { ProcurementCategory, ProcurementItem, KatalogItem, UserRole, AuthUser } from '../types';
import { formatNumberIndo, formatRupiah } from '../utils/formatters';
import { UnikmaLogo } from './UnikmaLogo';

interface KatalogViewProps {
  catalog: KatalogItem[];
  onAddCatalogItem: (item: Omit<KatalogItem, 'id' | 'lastUpdated'>) => void;
  onUpdateCatalogItem: (id: string, updates: Partial<KatalogItem>) => void;
  onDeleteCatalogItem: (id: string, name: string) => void;
  onAddItemToCart: (itemData: Omit<ProcurementItem, 'id' | 'barcode' | 'addedAt' | 'status'>) => void;
  onNavigateToCart: () => void;
  userRole?: UserRole;
  currentUser?: AuthUser;
}

const CATEGORIES: ProcurementCategory[] = [
  'Perangkat IT',
  'Perlengkapan Kantor',
  'Jasa & Pemeliharaan',
  'Peralatan Laboratorium',
  'Sarana & Prasarana',
  'Konsumsi & Kegiatan',
];

const COMMON_UNITS = [
  'Unit',
  'Dus',
  'Rim',
  'Paket',
  'Porsi',
  'Lusin',
  'Rol',
  'Set',
  'Pcs',
  'Batang',
  'Bulan',
];

export const KatalogView: React.FC<KatalogViewProps> = ({
  catalog,
  onAddCatalogItem,
  onUpdateCatalogItem,
  onDeleteCatalogItem,
  onAddItemToCart,
  onNavigateToCart,
  userRole = 'admin',
  currentUser,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'price-asc' | 'price-desc' | 'name-asc'>('latest');
  const [addedIds, setAddedIds] = useState<{ [key: string]: boolean }>({});

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KatalogItem | null>(null);

  // Form State for Adding
  const [formData, setFormData] = useState({
    name: '',
    category: 'Perangkat IT' as ProcurementCategory,
    defaultPrice: '',
    specs: '',
    unit: 'Unit',
    brand: '',
    sku: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Form State for Editing
  const [editFormData, setEditFormData] = useState({
    name: '',
    category: 'Perangkat IT' as ProcurementCategory,
    defaultPrice: '',
    specs: '',
    unit: 'Unit',
    brand: '',
    sku: '',
  });
  const [editFormError, setEditFormError] = useState<string | null>(null);

  const canManageCatalog = userRole === 'admin';

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: catalog.length };
    CATEGORIES.forEach((cat) => {
      counts[cat] = catalog.filter((i) => i.category === cat).length;
    });
    return counts;
  }, [catalog]);

  // Filtered and Sorted items
  const filteredItems = useMemo(() => {
    let result = catalog.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.specs.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.brand && item.brand.toLowerCase().includes(q)) ||
          (item.sku && item.sku.toLowerCase().includes(q))
        );
      }
      return true;
    });

    return result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.defaultPrice - b.defaultPrice;
      if (sortBy === 'price-desc') return b.defaultPrice - a.defaultPrice;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0; // default order
    });
  }, [catalog, selectedCategory, search, sortBy]);

  // Add Item to Cart
  const handleAddToCart = (catItem: KatalogItem) => {
    onAddItemToCart({
      name: catItem.name,
      category: catItem.category,
      quantity: 1,
      unitPrice: catItem.defaultPrice,
      notes: `Standar Katalog UNIKMA [${catItem.sku ? catItem.sku + ' - ' : ''}${catItem.specs}]`,
    });
    setAddedIds((prev) => ({ ...prev, [catItem.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [catItem.id]: false }));
    }, 1500);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    // Generate suggested SKU
    const catCode =
      formData.category === 'Perangkat IT'
        ? 'IT'
        : formData.category === 'Perlengkapan Kantor'
        ? 'ATK'
        : formData.category === 'Jasa & Pemeliharaan'
        ? 'JAS'
        : formData.category === 'Peralatan Laboratorium'
        ? 'LAB'
        : formData.category === 'Sarana & Prasarana'
        ? 'SAR'
        : 'KON';
    const nextNum = String(catalog.length + 1).padStart(3, '0');

    setFormData({
      name: '',
      category: 'Perangkat IT',
      defaultPrice: '',
      specs: '',
      unit: 'Unit',
      brand: '',
      sku: `KAT-${catCode}-${nextNum}`,
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Submit Add Catalog Form
  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Nama barang atau jasa wajib diisi.');
      return;
    }
    const priceNum = parseInt(formData.defaultPrice.replace(/\D/g, ''), 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Standar harga satuan harus berupa nominal angka valid lebih dari 0.');
      return;
    }
    if (!formData.specs.trim()) {
      setFormError('Spesifikasi teknis acuan wajib diisi.');
      return;
    }

    onAddCatalogItem({
      name: formData.name.trim(),
      category: formData.category,
      defaultPrice: priceNum,
      specs: formData.specs.trim(),
      unit: formData.unit.trim() || 'Unit',
      brand: formData.brand.trim() || undefined,
      sku: formData.sku.trim() || undefined,
    });

    setIsAddModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: KatalogItem) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name,
      category: item.category,
      defaultPrice: String(item.defaultPrice),
      specs: item.specs,
      unit: item.unit,
      brand: item.brand || '',
      sku: item.sku || '',
    });
    setEditFormError(null);
  };

  // Submit Edit Catalog Form
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editFormData.name.trim()) {
      setEditFormError('Nama barang atau jasa wajib diisi.');
      return;
    }
    const priceNum = parseInt(editFormData.defaultPrice.replace(/\D/g, ''), 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      setEditFormError('Standar harga satuan harus berupa nominal angka valid.');
      return;
    }
    if (!editFormData.specs.trim()) {
      setEditFormError('Spesifikasi teknis acuan wajib diisi.');
      return;
    }

    onUpdateCatalogItem(editingItem.id, {
      name: editFormData.name.trim(),
      category: editFormData.category,
      defaultPrice: priceNum,
      specs: editFormData.specs.trim(),
      unit: editFormData.unit.trim() || 'Unit',
      brand: editFormData.brand.trim() || undefined,
      sku: editFormData.sku.trim() || undefined,
    });

    setEditingItem(null);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#091b38] p-1.5 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-sm">
              <UnikmaLogo size={36} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Katalog Standar Barang & Jasa UNIKMA</span>
                </h1>
                <span className="text-[11px] font-mono font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full border border-cyan-200">
                  {catalog.length} Item Terdaftar
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Basis data acuan spesifikasi teknis dan Harga Perkiraan Sendiri (HPS) resmi kampus Universitas Komputama Cilacap.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5 shrink-0">
            {canManageCatalog ? (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-3.5 py-2 bg-[#008ba3] hover:bg-[#00758a] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Item Katalog</span>
              </button>
            ) : (
              <div
                className="px-3 py-1.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5"
                title="Hanya Manager / Admin yang dapat menambah & memodifikasi master katalog kampus"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Kelola Katalog (Admin Only)</span>
              </div>
            )}

            <button
              type="button"
              onClick={onNavigateToCart}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Keranjang Pengadaan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>Semua Kategori</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {categoryCounts.all}
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#008ba3] text-white shadow-xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/20 text-white font-bold' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {categoryCounts[cat] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari item katalog, merk, SKU (contoh: KAT-IT), atau spesifikasi teknis..."
            className="w-full pl-9.5 pr-8 py-2 bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 shadow-2xs font-medium placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Urutkan:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-700 shadow-2xs cursor-pointer"
          >
            <option value="latest">Standar Bawaan</option>
            <option value="name-asc">Nama (A - Z)</option>
            <option value="price-asc">Harga Terendah</option>
            <option value="price-desc">Harga Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Role permission info banner for non-admin */}
      {!canManageCatalog && (
        <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Anda login sebagai <strong>{currentUser?.roleLabel || 'Pengguna'}</strong>. Anda dapat mengajukan barang katalog ke keranjang pengadaan. Perubahan dan penghapusan master katalog dibatasi untuk Manager/Admin.
            </span>
          </div>
          <span className="text-[10px] font-mono bg-blue-200/60 px-2 py-0.5 rounded font-bold text-blue-800 shrink-0">
            Katalog Siap Pakai
          </span>
        </div>
      )}

      {/* Grid of Catalog Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">Item Katalog Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tidak ada item katalog yang sesuai dengan filter atau kata kunci &quot;{search}&quot;. Silakan ubah filter atau tambahkan item katalog baru.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            {search || selectedCategory !== 'all' ? (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                }}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Reset Filter Pencarian
              </button>
            ) : null}
            {canManageCatalog && (
              <button
                onClick={handleOpenAddModal}
                className="px-3.5 py-1.5 bg-[#008ba3] hover:bg-[#00758a] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Katalog Baru</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isAdded = addedIds[item.id];
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-cyan-400 transition-all p-4.5 flex flex-col justify-between group relative"
              >
                <div>
                  {/* Top Tags: Category, SKU, and Admin Action Buttons */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
                        {item.category}
                      </span>
                      {item.sku && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono font-semibold border border-slate-200">
                          {item.sku}
                        </span>
                      )}
                      {item.brand && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                          {item.brand}
                        </span>
                      )}
                    </div>

                    {/* Admin Actions: Edit & Delete buttons */}
                    {canManageCatalog && (
                      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                          title="Edit Spesifikasi & Standar Harga"
                          aria-label={`Edit ${item.name}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteCatalogItem(item.id, item.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                          title="Hapus dari Master Katalog Standar"
                          aria-label={`Hapus ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Title & Specs */}
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#008ba3] transition-colors line-clamp-2 mb-1.5">
                    {item.name}
                  </h3>
                  <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 mb-3">
                    <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed font-normal">
                      {item.specs}
                    </p>
                  </div>
                </div>

                {/* Bottom Card Footer: Price & Add to Cart button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Standar HPS / Unit:
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xs sm:text-sm font-mono font-black text-slate-900">
                        {formatRupiah(item.defaultPrice)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        /{item.unit}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      isAdded
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#008ba3] hover:bg-[#00758a] text-white shadow-2xs hover:shadow-sm'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Ditambahkan!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Pengajuan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Tambah Item Katalog Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="bg-[#17326b] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-cyan-500 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight text-white">
                    Tambah Item ke Master Katalog UNIKMA
                  </h3>
                  <p className="text-[10px] text-cyan-200 mt-0.5">
                    Standar barang baru akan dapat langsung digunakan oleh seluruh unit pemohon
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitAdd} className="p-5 overflow-y-auto space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Nama Item */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nama Barang / Jasa Standar <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Laptop Lenovo ThinkPad Core i7 16GB"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-medium text-slate-800"
                  required
                />
              </div>

              {/* Kategori & Satuan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Kategori Pengadaan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value as ProcurementCategory;
                      const catCode =
                        newCat === 'Perangkat IT'
                          ? 'IT'
                          : newCat === 'Perlengkapan Kantor'
                          ? 'ATK'
                          : newCat === 'Jasa & Pemeliharaan'
                          ? 'JAS'
                          : newCat === 'Peralatan Laboratorium'
                          ? 'LAB'
                          : newCat === 'Sarana & Prasarana'
                          ? 'SAR'
                          : 'KON';
                      setFormData({
                        ...formData,
                        category: newCat,
                        sku: `KAT-${catCode}-${String(catalog.length + 1).padStart(3, '0')}`,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-medium text-slate-800 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Satuan Pengukuran <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-medium text-slate-800 bg-white"
                    >
                      {COMMON_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Harga Standar (HPS) & Merk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Standar Biaya HPS (Rp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-xs">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={formData.defaultPrice ? formatNumberIndo(parseInt(formData.defaultPrice.replace(/\D/g, '') || '0', 10)) : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, defaultPrice: raw });
                      }}
                      placeholder="Contoh: 12.500.000"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono font-bold text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Merk / Produsen (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Contoh: Lenovo, Epson, Chitose"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Kode Standar / SKU */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nomor Referensi SKU / Kode Katalog
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Contoh: KAT-IT-008"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-slate-800"
                />
              </div>

              {/* Spesifikasi Teknis */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Spesifikasi Teknis & Acuan Standar Kampus <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  placeholder="Tuliskan rincian spesifikasi minimum, tipe, kelengkapan, dan garansi resmi..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-normal text-slate-800 resize-none leading-relaxed"
                  required
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#008ba3] hover:bg-[#00758a] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan ke Katalog</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Item Katalog */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="bg-[#091b38] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-cyan-500 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                  <Pencil className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight text-white">
                    Perbarui Item Katalog Standar
                  </h3>
                  <p className="text-[10px] text-cyan-200 mt-0.5">
                    ID: {editingItem.id} {editingItem.sku ? `• ${editingItem.sku}` : ''}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitEdit} className="p-5 overflow-y-auto space-y-4 text-xs">
              {editFormError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{editFormError}</span>
                </div>
              )}

              {/* Nama Item */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nama Barang / Jasa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-medium text-slate-800"
                  required
                />
              </div>

              {/* Kategori & Satuan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Kategori Pengadaan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value as ProcurementCategory })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-medium text-slate-800 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Satuan Pengukuran <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editFormData.unit}
                    onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-medium text-slate-800 bg-white"
                  >
                    {COMMON_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Standar HPS & Merk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Standar Biaya HPS (Rp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-xs">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={editFormData.defaultPrice ? formatNumberIndo(parseInt(editFormData.defaultPrice.replace(/\D/g, '') || '0', 10)) : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setEditFormData({ ...editFormData, defaultPrice: raw });
                      }}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono font-bold text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Merk / Produsen
                  </label>
                  <input
                    type="text"
                    value={editFormData.brand}
                    onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* SKU / Kode */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nomor Referensi SKU / Kode Katalog
                </label>
                <input
                  type="text"
                  value={editFormData.sku}
                  onChange={(e) => setEditFormData({ ...editFormData, sku: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-slate-800"
                />
              </div>

              {/* Spesifikasi Teknis */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Spesifikasi Teknis & Acuan Standar Kampus <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={editFormData.specs}
                  onChange={(e) => setEditFormData({ ...editFormData, specs: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-normal text-slate-800 resize-none leading-relaxed"
                  required
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#008ba3] hover:bg-[#00758a] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
