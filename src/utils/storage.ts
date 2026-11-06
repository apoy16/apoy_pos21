import { ActivityLog, ProcurementItem, PurchaseOrderInfo, Vendor, KatalogItem } from '../types';
import { formatShortDate } from './formatters';

const STORAGE_KEYS = {
  ITEMS: 'unikma_procurement_items_v1',
  LOGS: 'unikma_procurement_logs_v1',
  PO_INFO: 'unikma_procurement_po_v1',
  VENDORS: 'unikma_procurement_vendors_v1',
  CATALOG: 'unikma_procurement_catalog_v1',
};

export const INITIAL_ITEMS: ProcurementItem[] = [
  {
    id: 'item-1',
    barcode: 'BRG-2026-001',
    name: 'Laptop ASUS ROG',
    category: 'Perangkat IT',
    quantity: 2,
    unitPrice: 12500000,
    notes: 'Untuk laboratorium komputasi grafis dan riset informatika UNIKMA Cilacap',
    addedAt: '2026-09-21T09:30:00Z',
    status: 'Dalam Proses',
  },
  {
    id: 'item-2',
    barcode: 'BRG-2026-002',
    name: 'Printer Epson L3210',
    category: 'Perlengkapan Kantor',
    quantity: 1,
    unitPrice: 2750000,
    notes: 'Kebutuhan administrasi sekretariat prodi',
    addedAt: '2026-09-21T09:45:00Z',
    status: 'Dalam Proses',
  },
  {
    id: 'item-3',
    barcode: 'BRG-2026-003',
    name: 'Mouse Logitech',
    category: 'Perangkat IT',
    quantity: 5,
    unitPrice: 150000,
    notes: 'Penggantian mouse lab komputer 3 yang rusak',
    addedAt: '2026-09-21T09:50:00Z',
    status: 'Dalam Proses',
  },
  {
    id: 'item-4',
    barcode: 'BRG-2026-004',
    name: 'Kabel UTP Cat6',
    category: 'Perangkat IT',
    quantity: 10,
    unitPrice: 45000,
    notes: 'Per roll 10m untuk maintenance jaringan antar gedung',
    addedAt: '2026-09-21T10:00:00Z',
    status: 'Dalam Proses',
  },
  {
    id: 'item-5',
    barcode: 'BRG-2026-005',
    name: 'Jasa Instalasi Jaringan',
    category: 'Jasa & Pemeliharaan',
    quantity: 1,
    unitPrice: 1500000,
    notes: 'Termasuk sertifikasi terminasi patch panel & uji bandwidth',
    addedAt: '2026-09-21T10:10:00Z',
    status: 'Dalam Proses',
  },
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: new Date().toISOString(),
    timeStr: '10:15',
    dateStr: formatShortDate(),
    type: 'edit',
    title: 'Perubahan Nama Item',
    description: 'Admin mengubah nama "Laptop ASUS" menjadi "Laptop ASUS ROG"',
    user: 'Muhamad Ngafifudin (Admin)',
    itemId: 'item-1',
  },
  {
    id: 'log-2',
    timestamp: new Date().toISOString(),
    timeStr: '10:12',
    dateStr: formatShortDate(),
    type: 'barcode',
    title: 'Pencetakan Barcode',
    description: 'Barcode #BRG-2026-001 dicetak untuk verifikasi inventaris',
    user: 'Muhamad Ngafifudin (Admin)',
    itemId: 'item-1',
  },
  {
    id: 'log-3',
    timestamp: new Date().toISOString(),
    timeStr: '10:05',
    dateStr: formatShortDate(),
    type: 'tambah',
    title: 'Penambahan Jasa',
    description: 'Item "Jasa Instalasi Jaringan" ditambahkan ke daftar pengajuan',
    user: 'Muhamad Ngafifudin (Admin)',
    itemId: 'item-5',
  },
  {
    id: 'log-4',
    timestamp: new Date().toISOString(),
    timeStr: '09:58',
    dateStr: formatShortDate(),
    type: 'edit',
    title: 'Penyesuaian Kuantitas',
    description: 'Item "Mouse Logitech" jumlah diubah dari 3 menjadi 5',
    user: 'Muhamad Ngafifudin (Admin)',
    itemId: 'item-3',
  },
  {
    id: 'log-5',
    timestamp: new Date().toISOString(),
    timeStr: '09:45',
    dateStr: formatShortDate(),
    type: 'tambah',
    title: 'Item Baru',
    description: 'Item "Printer Epson L3210" ditambahkan ke keranjang',
    user: 'Muhamad Ngafifudin (Admin)',
    itemId: 'item-2',
  },
];

export const INITIAL_PO_INFO: PurchaseOrderInfo = {
  poNumber: 'PO-20260921-001',
  date: '21 September 2026',
  vendor: 'Intramall / Unit Pengadaan UNIKMA Cilacap',
  pic: 'Muhamad Ngafifudin',
  department: 'Biro Administrasi Umum & Sarpras UNIKMA Cilacap',
  approver: 'Muhamad Ngafifudin',
  status: 'Dalam Proses',
  notes: 'Pengadaan Semester Gasal TA 2026/2027 Universitas Komputama Cilacap (UNIKMA)',
};

export function loadStoredItems(): ProcurementItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) return INITIAL_ITEMS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_ITEMS;
  } catch (err) {
    console.error('Failed to load items from storage:', err);
    return INITIAL_ITEMS;
  }
}

export function saveStoredItems(items: ProcurementItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save items to storage:', err);
  }
}

export function loadStoredLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) return INITIAL_LOGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_LOGS;
  } catch (err) {
    console.error('Failed to load logs from storage:', err);
    return INITIAL_LOGS;
  }
}

export function saveStoredLogs(logs: ActivityLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save logs to storage:', err);
  }
}

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'vnd-1',
    code: 'VND-001',
    name: 'PT Intramall Solusi Mandiri',
    category: 'Multi-Kategori',
    picName: 'Hendra Pratama, S.Kom',
    phone: '0812-2233-4455',
    email: 'sales@intramall.co.id',
    address: 'Jl. Jenderal Sudirman No. 45',
    city: 'Cilacap',
    npwp: '01.345.678.9-522.000',
    nib: '9120003456781',
    bankName: 'Bank Jateng',
    bankAccount: '102-3344-556',
    bankHolder: 'PT Intramall Solusi Mandiri',
    status: 'Terverifikasi',
    rating: 5,
    totalTransactions: 14,
    joinedDate: '2024-02-10',
    notes: 'Penyedia utama e-katalog IT hardware & software lisensi kampus',
  },
  {
    id: 'vnd-2',
    code: 'VND-002',
    name: 'CV Cilacap Komputer Nusantara',
    category: 'Perangkat IT',
    picName: 'Dedi Kurniawan',
    phone: '0857-4122-8899',
    email: 'dedik@cilacapkomputer.id',
    address: 'Jl. Katamso No. 12',
    city: 'Cilacap',
    npwp: '02.456.789.1-522.000',
    nib: '9120007891234',
    bankName: 'BCA',
    bankAccount: '046-1234-890',
    bankHolder: 'CV Cilacap Komputer Nusantara',
    status: 'Terverifikasi',
    rating: 5,
    totalTransactions: 8,
    joinedDate: '2024-05-18',
    notes: 'Distributor resmi printer Epson, PC Desktop AIO, dan networking switch',
  },
  {
    id: 'vnd-3',
    code: 'VND-003',
    name: 'CV Majenang Sinar ATK & Percetakan',
    category: 'Perlengkapan Kantor',
    picName: 'Ibu Siti Rahayu',
    phone: '0813-9088-7711',
    email: 'sinar_atk@majenang.net',
    address: 'Jl. Diponegoro No. 88, Majenang',
    city: 'Cilacap',
    npwp: '03.789.123.4-522.000',
    nib: '9120004561239',
    bankName: 'BRI',
    bankAccount: '0134-01-002345-50-1',
    bankHolder: 'Siti Rahayu CV Sinar ATK',
    status: 'Terverifikasi',
    rating: 4,
    totalTransactions: 12,
    joinedDate: '2023-09-01',
    notes: 'Suplier kertas HVS, map arsip, buku register, dan percetakan ijazah/blanko',
  },
  {
    id: 'vnd-4',
    code: 'VND-004',
    name: 'PT Media Sarana Edukasi Lab',
    category: 'Peralatan Laboratorium',
    picName: 'Bambang Susilo, M.Si',
    phone: '0821-3456-7890',
    email: 'info@mediasaranaedukasi.com',
    address: 'Kawasan Industri Cilacap Blok B-4',
    city: 'Cilacap',
    npwp: '04.112.233.4-522.000',
    nib: '9120008899112',
    bankName: 'Mandiri',
    bankAccount: '139-00-1122334-5',
    bankHolder: 'PT Media Sarana Edukasi',
    status: 'Terverifikasi',
    rating: 5,
    totalTransactions: 6,
    joinedDate: '2024-01-15',
    notes: 'Peralatan lab mikroskop, instrumen kimia, glassware bersertifikasi ISO',
  },
  {
    id: 'vnd-5',
    code: 'VND-005',
    name: 'CV Karya Mandiri Teknik & Instalasi',
    category: 'Jasa & Pemeliharaan',
    picName: 'Agus Salim',
    phone: '0878-3344-5566',
    email: 'karyamandiricilacap@gmail.com',
    address: 'Jl. Raya Cimanggu No. 15, Cimanggu',
    city: 'Cilacap',
    npwp: '05.223.344.5-522.000',
    nib: '9120005544332',
    bankName: 'Bank Jateng',
    bankAccount: '202-8877-665',
    bankHolder: 'CV Karya Mandiri Teknik',
    status: 'Aktif',
    rating: 4,
    totalTransactions: 5,
    joinedDate: '2024-03-22',
    notes: 'Jasa instalasi jaringan FO, sertifikasi kabel UTP LAN, maintenance AC kampus',
  },
  {
    id: 'vnd-6',
    code: 'VND-006',
    name: 'Katering Berkah UNIKMA & Event Service',
    category: 'Konsumsi & Kegiatan',
    picName: 'Hj. Nurjanah',
    phone: '0815-4422-1100',
    email: 'kateringberkah@gmail.com',
    address: 'Jl. Majenang - Cimanggu No. 102',
    city: 'Cilacap',
    npwp: '06.334.455.6-522.000',
    bankName: 'BRI',
    bankAccount: '0134-01-009876-50-8',
    bankHolder: 'Hj. Nurjanah',
    status: 'Aktif',
    rating: 5,
    totalTransactions: 9,
    joinedDate: '2023-11-05',
    notes: 'Penyedia konsumsi seminar, rapat senat, wisuda dan snack box kegiatan kampus',
  },
];

export function loadStoredVendors(): Vendor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VENDORS);
    if (!raw) return INITIAL_VENDORS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_VENDORS;
  } catch (err) {
    console.error('Failed to load vendors from storage:', err);
    return INITIAL_VENDORS;
  }
}

export function saveStoredVendors(vendors: Vendor[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
  } catch (err) {
    console.error('Failed to save vendors to storage:', err);
  }
}

export function loadStoredPO(): PurchaseOrderInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PO_INFO);
    if (!raw) return INITIAL_PO_INFO;
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_PO_INFO;
  }
}

export function saveStoredPO(po: PurchaseOrderInfo): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PO_INFO, JSON.stringify(po));
  } catch (err) {
    console.error('Failed to save PO to storage:', err);
  }
}

export const INITIAL_CATALOG: KatalogItem[] = [
  {
    id: 'cat-1',
    name: 'PC Desktop All-in-One Core i5 16GB SSD 512GB',
    category: 'Perangkat IT',
    defaultPrice: 11200000,
    specs: 'Intel Core i5 Gen 13, 16GB DDR4, SSD 512GB NVMe, Display 23.8" FHD IPS',
    unit: 'Unit',
    brand: 'Lenovo',
    sku: 'KAT-IT-001',
    lastUpdated: '2026-09-20',
  },
  {
    id: 'cat-2',
    name: 'Proyektor Laser Epson EB-L210W WXGA 4500 Lumens',
    category: 'Perangkat IT',
    defaultPrice: 14850000,
    specs: 'Laser Light Source, 4500 lumens, resolusi WXGA, HDMI/VGA/Wireless',
    unit: 'Unit',
    brand: 'Epson',
    sku: 'KAT-IT-002',
    lastUpdated: '2026-09-18',
  },
  {
    id: 'cat-3',
    name: 'Access Point WiFi 6 Dual Band Gigabit',
    category: 'Perangkat IT',
    defaultPrice: 2350000,
    specs: 'Support 802.11ax, speed up to 3Gbps, PoE powered, manageable via Cloud',
    unit: 'Unit',
    brand: 'Ruijie Reyee',
    sku: 'KAT-IT-003',
    lastUpdated: '2026-09-15',
  },
  {
    id: 'cat-4',
    name: 'Kertas HVS PaperOne A4 80gr (Dus / 5 Rim)',
    category: 'Perlengkapan Kantor',
    defaultPrice: 265000,
    specs: 'Ketebalan 80gr, warna super putih 98% brightness, 500 lembar/rim',
    unit: 'Dus',
    brand: 'PaperOne',
    sku: 'KAT-ATK-001',
    lastUpdated: '2026-09-19',
  },
  {
    id: 'cat-5',
    name: 'Spidol Whiteboard Snowman Boardmarker (Lusin)',
    category: 'Perlengkapan Kantor',
    defaultPrice: 95000,
    specs: 'Isi 12 pcs, tinta hitam pekat, mudah dihapus tanpa bekas di papan',
    unit: 'Lusin',
    brand: 'Snowman',
    sku: 'KAT-ATK-002',
    lastUpdated: '2026-09-10',
  },
  {
    id: 'cat-6',
    name: 'Jasa Pemeliharaan & Kalibrasi Mikroskop Lab Biologi',
    category: 'Jasa & Pemeliharaan',
    defaultPrice: 3500000,
    specs: 'Cleaning lensa optik, kalibrasi fokus mikro, penggantian lampu LED 20 unit',
    unit: 'Paket',
    brand: 'Layanan Resmi',
    sku: 'KAT-JAS-001',
    lastUpdated: '2026-09-12',
  },
  {
    id: 'cat-7',
    name: 'Mikroskop Binokuler Olympus CX23 LED',
    category: 'Peralatan Laboratorium',
    defaultPrice: 19800000,
    specs: 'Plan Achromat 4X, 10X, 40X, 100X Oil, LED illumination 0.5W, anti-fungus',
    unit: 'Unit',
    brand: 'Olympus',
    sku: 'KAT-LAB-001',
    lastUpdated: '2026-09-08',
  },
  {
    id: 'cat-8',
    name: 'Kursi Kuliah Lipat Chitose dengan Meja Tulis',
    category: 'Sarana & Prasarana',
    defaultPrice: 420000,
    specs: 'Rangka besi pipa chrome, dudukan busa cetak anti kempes, meja melamin',
    unit: 'Unit',
    brand: 'Chitose',
    sku: 'KAT-SAR-001',
    lastUpdated: '2026-09-14',
  },
  {
    id: 'cat-9',
    name: 'Paket Konsumsi Seminar & Rapat Dosen (Prasmanan)',
    category: 'Konsumsi & Kegiatan',
    defaultPrice: 45000,
    specs: 'Nasi, 2 menu lauk utama, sayur, buah potong, puding, air mineral kemasan',
    unit: 'Porsi',
    brand: 'Katering UNIKMA',
    sku: 'KAT-KON-001',
    lastUpdated: '2026-09-21',
  },
];

export function loadStoredCatalog(): KatalogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATALOG);
    if (!raw) return INITIAL_CATALOG;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_CATALOG;
  } catch (err) {
    console.error('Failed to load catalog from storage:', err);
    return INITIAL_CATALOG;
  }
}

export function saveStoredCatalog(catalog: KatalogItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(catalog));
  } catch (err) {
    console.error('Failed to save catalog to storage:', err);
  }
}
