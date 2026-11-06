export type ProcurementCategory =
  | 'Perangkat IT'
  | 'Perlengkapan Kantor'
  | 'Jasa & Pemeliharaan'
  | 'Peralatan Laboratorium'
  | 'Sarana & Prasarana'
  | 'Konsumsi & Kegiatan';

export interface ProcurementItem {
  id: string;
  barcode: string;
  name: string;
  category: ProcurementCategory;
  quantity: number;
  unitPrice: number;
  notes?: string;
  addedAt: string;
  status: 'Dalam Proses' | 'Disetujui' | 'Diterima' | 'Ditolak';
}

export interface KatalogItem {
  id: string;
  name: string;
  category: ProcurementCategory;
  defaultPrice: number;
  specs: string;
  unit: string;
  brand?: string;
  sku?: string;
  lastUpdated?: string;
}

export type ActionType = 'tambah' | 'edit' | 'hapus' | 'cetak' | 'barcode' | 'status' | 'vendor' | 'katalog';

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO string
  timeStr: string; // "10:15"
  dateStr: string; // "2026-09-21"
  type: ActionType;
  title: string;
  description: string;
  user: string;
  itemId?: string;
}

export interface Vendor {
  id: string;
  code: string;
  name: string;
  category: ProcurementCategory | 'Multi-Kategori';
  picName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  npwp?: string;
  nib?: string;
  bankName?: string;
  bankAccount?: string;
  bankHolder?: string;
  status: 'Aktif' | 'Terverifikasi' | 'Dalam Review' | 'Nonaktif';
  rating: number; // 1-5
  totalTransactions: number;
  joinedDate: string;
  notes?: string;
}

export interface PurchaseOrderInfo {
  poNumber: string;
  date: string;
  vendor: string;
  vendorId?: string;
  vendorPhone?: string;
  vendorAddress?: string;
  pic: string;
  department: string;
  approver: string;
  status: 'Dalam Proses' | 'Disetujui' | 'Selesai';
  notes?: string;
}

export type UserRole = 'admin' | 'owner' | 'karyawan';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  email: string;
  department: string;
  nip?: string;
  avatarInitials: string;
}

