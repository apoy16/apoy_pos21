import React, { useState, useMemo } from 'react';
import {
  Store,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Star,
  FileCheck,
  Edit,
  Trash2,
  ExternalLink,
  X,
  Check,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Lock,
} from 'lucide-react';
import { Vendor, ProcurementCategory, PurchaseOrderInfo, UserRole } from '../types';
import { UnikmaLogo } from './UnikmaLogo';

interface VendorManagementViewProps {
  vendors: Vendor[];
  onAddVendor: (vendor: Omit<Vendor, 'id' | 'code' | 'totalTransactions' | 'joinedDate'>) => void;
  onUpdateVendor: (id: string, updates: Partial<Vendor>) => void;
  onDeleteVendor: (id: string, name: string) => void;
  onAssignVendorToPO: (vendor: Vendor) => void;
  currentPOVendorName?: string;
  onNavigateToPO: () => void;
  userRole?: UserRole;
}

const CATEGORIES: (ProcurementCategory | 'Multi-Kategori')[] = [
  'Multi-Kategori',
  'Perangkat IT',
  'Perlengkapan Kantor',
  'Jasa & Pemeliharaan',
  'Peralatan Laboratorium',
  'Sarana & Prasarana',
  'Konsumsi & Kegiatan',
];

export const VendorManagementView: React.FC<VendorManagementViewProps> = ({
  vendors,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor,
  onAssignVendorToPO,
  currentPOVendorName,
  onNavigateToPO,
  userRole = 'admin',
}) => {
  const canManageVendor = userRole === 'admin';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [detailVendor, setDetailVendor] = useState<Vendor | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'Perangkat IT' as ProcurementCategory | 'Multi-Kategori',
    picName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Cilacap',
    npwp: '',
    nib: '',
    bankName: 'Bank Jateng',
    bankAccount: '',
    bankHolder: '',
    status: 'Terverifikasi' as Vendor['status'],
    rating: 5,
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && v.status !== selectedStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          v.name.toLowerCase().includes(q) ||
          v.code.toLowerCase().includes(q) ||
          v.picName.toLowerCase().includes(q) ||
          v.phone.includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.address.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [vendors, selectedCategory, selectedStatus, search]);

  const openAddModal = () => {
    setEditingVendor(null);
    setFormData({
      name: '',
      category: 'Perangkat IT',
      picName: '',
      phone: '',
      email: '',
      address: '',
      city: 'Cilacap',
      npwp: '',
      nib: '',
      bankName: 'Bank Jateng',
      bankAccount: '',
      bankHolder: '',
      status: 'Terverifikasi',
      rating: 5,
      notes: '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      category: vendor.category,
      picName: vendor.picName,
      phone: vendor.phone,
      email: vendor.email,
      address: vendor.address,
      city: vendor.city,
      npwp: vendor.npwp || '',
      nib: vendor.nib || '',
      bankName: vendor.bankName || 'Bank Jateng',
      bankAccount: vendor.bankAccount || '',
      bankHolder: vendor.bankHolder || '',
      status: vendor.status,
      rating: vendor.rating,
      notes: vendor.notes || '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Nama rekanan/perusahaan wajib diisi';
    if (!formData.picName.trim()) errs.picName = 'Nama PIC wajib diisi';
    if (!formData.phone.trim()) errs.phone = 'Nomor telepon/WA wajib diisi';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Format email perusahaan tidak valid';
    }
    if (!formData.address.trim()) errs.address = 'Alamat kantor wajib diisi';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingVendor) {
      onUpdateVendor(editingVendor.id, formData);
    } else {
      onAddVendor(formData);
    }
    setIsFormModalOpen(false);
  };

  const getStatusBadge = (status: Vendor['status']) => {
    switch (status) {
      case 'Terverifikasi':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Terverifikasi</span>
          </span>
        );
      case 'Aktif':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            <span>Mitra Aktif</span>
          </span>
        );
      case 'Dalam Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Dalam Review</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <AlertTriangle className="w-3 h-3 text-slate-500" />
            <span>Nonaktif</span>
          </span>
        );
    }
  };

  // Metrics
  const totalVerified = vendors.filter((v) => v.status === 'Terverifikasi').length;
  const totalTransactionsAll = vendors.reduce((sum, v) => sum + (v.totalTransactions || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b254e] via-[#0f346e] to-[#0284c7] rounded-2xl text-white p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-blue-950/80 border border-blue-400/40 p-1 flex items-center justify-center shrink-0 shadow-inner">
                <UnikmaLogo size={34} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20 text-cyan-200 font-bold">
                  DATABASE REKANAN KAMPUS
                </span>
                <div className="text-[11px] text-amber-300 font-medium italic mt-0.5">
                  Universitas Komputama Cilacap (UNIKMA)
                </div>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Manajemen Vendor & Suplier Pengadaan
            </h1>
            <p className="text-xs text-blue-100 mt-1 leading-relaxed">
              Registrasi rekanan resmi, verifikasi legalitas izin usaha (NIB/NPWP), penilaian kinerja, serta integrasi penugasan langsung ke dokumen Surat Pesanan (Purchase Order).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {canManageVendor ? (
              <button
                onClick={openAddModal}
                className="px-4 py-2.5 bg-white text-blue-900 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Daftarkan Vendor Baru</span>
              </button>
            ) : (
              <span className="px-3.5 py-2 bg-blue-900/60 border border-blue-400/40 text-blue-100 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan-300" />
                <span>
                  {userRole === 'owner'
                    ? 'Akses Owner: Monitoring Legalitas Rekanan'
                    : 'Akses Karyawan: Direktori Rekanan'}
                </span>
              </span>
            )}
            <button
              onClick={onNavigateToPO}
              className="px-4 py-2.5 bg-blue-700/80 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 border border-blue-400/40 cursor-pointer"
            >
              <span>Lihat Surat Pesanan (PO)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Total Mitra Terdaftar</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{vendors.length} Rekanan</div>
            <div className="text-[11px] text-blue-600 font-medium mt-1">Wilayah Cilacap & Nasional</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Vendor Terverifikasi</div>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">{totalVerified} Vendor</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Legalitas NIB & NPWP Sah</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Akumulasi Transaksi PO</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalTransactionsAll} Order</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Tercatat di sistem UNIKMA</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Vendor Terpilih di PO</div>
            <div className="text-sm font-bold text-slate-900 truncate max-w-[170px] mt-1" title={currentPOVendorName}>
              {currentPOVendorName || 'Belum Ditugaskan'}
            </div>
            <div className="text-[11px] text-blue-600 font-medium mt-1 flex items-center gap-1">
              <span>Siap cetak dokumen PO</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama vendor, kode (e.g. VND-001), PIC, atau alamat..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-white text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">Semua Bidang Usaha</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-white text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">Semua Status</option>
            <option value="Terverifikasi">Terverifikasi</option>
            <option value="Aktif">Aktif</option>
            <option value="Dalam Review">Dalam Review</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            <Store className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="font-bold text-sm text-slate-700">Tidak ada vendor yang sesuai kriteria</h3>
            <p className="text-xs text-slate-500 mt-1">
              Gunakan kata kunci pencarian lain atau klik "Daftarkan Vendor Baru".
            </p>
          </div>
        ) : (
          filteredVendors.map((vendor) => {
            const isAssigned = currentPOVendorName?.toLowerCase().includes(vendor.name.toLowerCase());

            return (
              <div
                key={vendor.id}
                className={`bg-white rounded-xl border shadow-xs transition-all flex flex-col justify-between overflow-hidden group ${
                  isAssigned
                    ? 'border-blue-500 ring-2 ring-blue-100 shadow-md'
                    : 'border-slate-200/90 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                {/* Card Top */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                        {vendor.code}
                      </span>
                      {getStatusBadge(vendor.status)}
                    </div>
                    {/* Rating */}
                    <div className="flex items-center gap-0.5 text-amber-500 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < vendor.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                    {vendor.name}
                  </h3>
                  <div className="text-[11px] font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-[10px]">
                      {vendor.category}
                    </span>
                    <span>• {vendor.city}</span>
                  </div>

                  {/* Contact Info List */}
                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">PIC: <strong className="text-slate-800">{vendor.picName}</strong></span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-[11px]">{vendor.phone}</span>
                      </div>
                      <a
                        href={`https://wa.me/${vendor.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-emerald-600 hover:text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0"
                      >
                        Chat WA
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate text-[11px] text-blue-600">{vendor.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1 text-[11px] text-slate-500">{vendor.address}</span>
                    </div>
                  </div>

                  {/* Bank & Legal Summary */}
                  {vendor.bankAccount && (
                    <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-150 text-[11px] text-slate-600 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        <span>{vendor.bankName}</span>
                      </span>
                      <span className="font-mono font-semibold text-slate-800">{vendor.bankAccount}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions Bottom */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDetailVendor(vendor)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-blue-700 hover:bg-white rounded transition-colors cursor-pointer"
                      title="Lihat detail legalitas vendor"
                    >
                      Detail
                    </button>
                    {canManageVendor && (
                      <>
                        <button
                          onClick={() => openEditModal(vendor)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded transition-colors cursor-pointer"
                          title="Edit data vendor (Manager/Admin)"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteVendor(vendor.id, vendor.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded transition-colors cursor-pointer"
                          title="Hapus vendor (Manager/Admin)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Assign to PO Button (Only Manager/Admin can reassign) */}
                  {userRole === 'admin' ? (
                    <button
                      onClick={() => onAssignVendorToPO(vendor)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAssigned
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-xs'
                      }`}
                    >
                      {isAssigned ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Aktif di PO</span>
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Pilih untuk PO</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg ${
                        isAssigned
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isAssigned ? '✓ Terpilih di PO' : 'Mitra Terdaftar'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Tambah / Edit Vendor */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
            <div className="bg-[#0b1f42] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-950 p-1 border border-blue-400/40 flex items-center justify-center shrink-0">
                  <UnikmaLogo size={28} />
                </div>
                <div>
                  <h2 className="font-bold text-sm tracking-wide">
                    {editingVendor ? 'Edit Data Rekanan Vendor' : 'Daftarkan Vendor / Suplier Baru'}
                  </h2>
                  <p className="text-[11px] text-blue-200/80">
                    Database Pengadaan Universitas Komputama Cilacap (UNIKMA)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-900/60 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Row 1: Nama & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Perusahaan / Rekanan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: PT Intramall Solusi Mandiri"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                      formErrors.name
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                    }`}
                  />
                  {formErrors.name && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori / Bidang Usaha <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as ProcurementCategory | 'Multi-Kategori',
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: PIC & Kontak */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama PIC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.picName}
                    onChange={(e) => setFormData({ ...formData, picName: e.target.value })}
                    placeholder="Nama Penanggung Jawab"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  {formErrors.picName && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.picName}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    No. Telepon / WA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Contoh: 0812-xxxx-xxxx"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  {formErrors.phone && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Resmi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@perusahaan.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  {formErrors.email && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.email}</p>}
                </div>
              </div>

              {/* Row 3: Alamat & Kota */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alamat Kantor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Alamat domisili operasional vendor"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  {formErrors.address && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.address}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kota / Wilayah
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Cilacap / Majenang / Lainnya"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Row 4: Legalitas (NPWP & NIB) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NPWP Perusahaan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.npwp}
                    onChange={(e) => setFormData({ ...formData, npwp: e.target.value })}
                    placeholder="00.000.000.0-000.000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIB / Nomor Induk Berusaha (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.nib}
                    onChange={(e) => setFormData({ ...formData, nib: e.target.value })}
                    placeholder="912000xxxxxxx"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 font-mono"
                  />
                </div>
              </div>

              {/* Row 5: Rekening Bank */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Bank
                  </label>
                  <select
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    <option value="Bank Jateng">Bank Jateng</option>
                    <option value="BRI">BRI</option>
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BNI">BNI</option>
                    <option value="BSI">BSI</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    placeholder="Nomor rekening transfer"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Atas Nama Rekening
                  </label>
                  <input
                    type="text"
                    value={formData.bankHolder}
                    onChange={(e) => setFormData({ ...formData, bankHolder: e.target.value })}
                    placeholder="Nama pemilik rekening"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Row 6: Status & Catatan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Verifikasi
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as Vendor['status'] })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Dalam Review">Dalam Review</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catatan / Spesialisasi Produk
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Keterangan kontrak, garansi produk, dll."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg shadow-sm"
                >
                  {editingVendor ? 'Simpan Perubahan' : 'Daftarkan Rekanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detail Vendor */}
      {detailVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
            <div className="bg-[#0b1f42] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-950 p-1 border border-blue-400/40 flex items-center justify-center shrink-0">
                  <UnikmaLogo size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">
                    Profil Rekanan Terverifikasi UNIKMA
                  </h3>
                  <p className="text-[11px] text-blue-200/80">Kode Mitra: {detailVendor.code}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailVendor(null)}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-900/60 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">{detailVendor.name}</h2>
                  <p className="text-slate-500 font-medium">{detailVendor.category} • {detailVendor.city}</p>
                </div>
                {getStatusBadge(detailVendor.status)}
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Penanggung Jawab (PIC)</span>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">{detailVendor.picName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">No. Telepon / WhatsApp</span>
                  <p className="font-mono text-slate-800 text-xs mt-0.5">{detailVendor.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Email Resmi</span>
                  <p className="text-blue-600 text-xs mt-0.5">{detailVendor.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Tanggal Terdaftar</span>
                  <p className="text-slate-800 text-xs mt-0.5">{detailVendor.joinedDate}</p>
                </div>
              </div>

              {/* Legalitas & Bank */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Legalitas & Rekening</h4>
                <div className="grid grid-cols-2 gap-3 text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">NPWP</span>
                    <span className="font-mono text-[11px] font-bold">{detailVendor.npwp || 'Belum diisi'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">NIB (Nomor Induk Berusaha)</span>
                    <span className="font-mono text-[11px] font-bold">{detailVendor.nib || 'Belum diisi'}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Rekening Bank Rekanan</span>
                      <span className="font-bold text-slate-800">{detailVendor.bankName} - {detailVendor.bankAccount}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">A.N. {detailVendor.bankHolder}</span>
                  </div>
                </div>
              </div>

              {detailVendor.notes && (
                <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200/80 text-blue-900 text-[11px]">
                  <strong>Catatan Khusus:</strong> {detailVendor.notes}
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                {canManageVendor ? (
                  <button
                    type="button"
                    onClick={() => {
                      const vendorToDelete = detailVendor;
                      setDetailVendor(null);
                      onDeleteVendor(vendorToDelete.id, vendorToDelete.name);
                    }}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title={`Hapus rekanan ${detailVendor.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Rekanan</span>
                  </button>
                ) : (
                  <span className="text-slate-400 text-xs italic flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Perubahan legalitas dikelola Manager/Admin</span>
                  </span>
                )}

                <div className="flex items-center gap-2">
                  {canManageVendor && (
                    <button
                      type="button"
                      onClick={() => {
                        const v = detailVendor;
                        setDetailVendor(null);
                        openEditModal(v);
                      }}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Data</span>
                    </button>
                  )}
                  {userRole === 'admin' ? (
                    <button
                      type="button"
                      onClick={() => {
                        onAssignVendorToPO(detailVendor);
                        setDetailVendor(null);
                      }}
                      className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Tugaskan ke PO</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDetailVendor(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs cursor-pointer"
                    >
                      Tutup
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
