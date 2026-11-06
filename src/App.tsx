import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  FileText,
  RotateCcw,
  Plus,
} from 'lucide-react';
import {
  ActivityLog,
  ProcurementItem,
  PurchaseOrderInfo,
  Vendor,
  AuthUser,
  UserRole,
  KatalogItem,
} from './types';
import {
  loadStoredItems,
  saveStoredItems,
  loadStoredLogs,
  saveStoredLogs,
  loadStoredPO,
  saveStoredPO,
  loadStoredVendors,
  saveStoredVendors,
  loadStoredCatalog,
  saveStoredCatalog,
  INITIAL_ITEMS,
  INITIAL_LOGS,
  INITIAL_VENDORS,
  INITIAL_CATALOG,
} from './utils/storage';
import {
  getSavedAuthUser,
  saveAuthUser,
  REGISTERED_USERS,
  Permissions,
} from './utils/auth';
import { formatShortDate, formatShortTime } from './utils/formatters';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { FormTambahItem } from './components/FormTambahItem';
import { TabelPengadaan } from './components/TabelPengadaan';
import { PurchaseOrderCard } from './components/PurchaseOrderCard';
import { PurchaseOrderModal } from './components/PurchaseOrderModal';
import { LogAktivitasPanel } from './components/LogAktivitasPanel';
import { RiwayatAktivitasFullModal } from './components/RiwayatAktivitasFullModal';
import { BarcodeModal } from './components/BarcodeModal';
import { DashboardView } from './components/DashboardView';
import { KatalogView } from './components/KatalogView';
import { PenerimaanBarcodeView } from './components/PenerimaanBarcodeView';
import { VendorManagementView } from './components/VendorManagementView';
import { ConfirmDeleteModal, DeleteModalState } from './components/ConfirmDeleteModal';
import { LoginModal } from './components/LoginModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('pengajuan');
  const [items, setItems] = useState<ProcurementItem[]>(() => loadStoredItems());
  const [logs, setLogs] = useState<ActivityLog[]>(() => loadStoredLogs());
  const [poInfo, setPoInfo] = useState<PurchaseOrderInfo>(() => loadStoredPO());
  const [vendors, setVendors] = useState<Vendor[]>(() => loadStoredVendors());
  const [catalog, setCatalog] = useState<KatalogItem[]>(() => loadStoredCatalog());

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [barcodeModalItem, setBarcodeModalItem] = useState<ProcurementItem | null>(null);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);

  // Reusable in-app deletion confirmation modal (works reliably inside iframes)
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    type: 'item',
    title: '',
    message: '',
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Current logged in user (Admin, Owner, Karyawan) - null if not authenticated
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(
    () => getSavedAuthUser()
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Persist session to local storage
  useEffect(() => {
    saveAuthUser(currentUser);
  }, [currentUser]);

  // Persist to local storage
  useEffect(() => {
    saveStoredItems(items);
  }, [items]);

  useEffect(() => {
    saveStoredLogs(logs);
  }, [logs]);

  useEffect(() => {
    saveStoredPO(poInfo);
  }, [poInfo]);

  useEffect(() => {
    saveStoredVendors(vendors);
  }, [vendors]);

  useEffect(() => {
    saveStoredCatalog(catalog);
  }, [catalog]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to add activity log
  const addLog = (
    type: ActivityLog['type'],
    title: string,
    description: string,
    itemId?: string
  ) => {
    const userString = currentUser
      ? `${currentUser.name} (${currentUser.roleLabel.split(' ')[0]})`
      : 'Sistem UNIKMA';

    const newLog: ActivityLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      timeStr: formatShortTime(),
      dateStr: formatShortDate(),
      type,
      title,
      description,
      user: userString,
      itemId,
    };

    setLogs((prev) => [newLog, ...prev]);
  };

  // Auth & Session Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    addLog(
      'status',
      'Sesi Login Berhasil',
      `Pengguna "${user.name}" berhasil login dengan kredensial sah [${user.roleLabel}]`
    );
    showToast(`Selamat datang, ${user.name} (${user.roleLabel})`);
  };

  const handleLogout = () => {
    const oldName = currentUser?.name || 'Pengguna';
    saveAuthUser(null);
    setCurrentUser(null);
    setIsLoginModalOpen(false);
    setIsChangePasswordOpen(false);
    addLog(
      'status',
      'Sesi Diakhiri (Logout)',
      `Pengguna "${oldName}" telah keluar dari sistem pengadaan.`
    );
    showToast('Sesi telah diakhiri. Silakan masukkan username dan kata sandi untuk masuk.');
  };

  const handleApprovePO = () => {
    if (!currentUser || (currentUser.role !== 'owner' && currentUser.role !== 'admin')) {
      showToast('Hanya Owner / Pimpinan Universitas atau Manager yang berhak menyetujui PO.');
      return;
    }

    setPoInfo((prev) => ({
      ...prev,
      status: 'Disetujui',
      approver: currentUser.name,
    }));

    addLog(
      'status',
      'Persetujuan PO Resmi',
      `Surat Pesanan #${poInfo.poNumber} disetujui secara resmi oleh ${currentUser.name} (${currentUser.roleLabel})`
    );
    showToast(`Surat Pesanan #${poInfo.poNumber} berhasil disetujui.`);
  };

  // Add Item Handler
  const handleAddItem = (
    itemData: Omit<ProcurementItem, 'id' | 'barcode' | 'addedAt' | 'status'>
  ) => {
    const nextSeq = items.length + 1;
    const barcodeCode = `BRG-2026-${String(nextSeq).padStart(3, '0')}`;
    const newItem: ProcurementItem = {
      ...itemData,
      id: 'item-' + Date.now(),
      barcode: barcodeCode,
      addedAt: new Date().toISOString(),
      status: 'Dalam Proses',
    };

    setItems((prev) => [...prev, newItem]);
    addLog('tambah', 'Penambahan Item', `Item "${newItem.name}" ditambahkan ke keranjang`, newItem.id);
    showToast(`"${newItem.name}" berhasil ditambahkan ke keranjang pengadaan.`);
  };

  // Update Item Handler
  const handleUpdateItem = (
    id: string,
    updates: Partial<ProcurementItem>,
    logDesc?: string
  ) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;

    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...updates } : it))
    );

    const description =
      logDesc || `Perubahan data pada item "${updates.name || target.name}"`;
    addLog('edit', 'Perubahan Data Item', description, id);
    showToast('Perubahan berhasil disimpan.');
  };

  // Delete Item Handlers (Single, Batch, and Clear All)
  const handleRequestDeleteItem = (id: string, name: string) => {
    const target = items.find((i) => i.id === id);
    setDeleteModal({
      isOpen: true,
      type: 'item',
      title: 'Hapus Item Pengadaan',
      message: `Apakah Anda yakin ingin menghapus item ini dari keranjang pengadaan? Data kode barcode "${target?.barcode || id}" dan estimasi biaya akan dihapus dari daftar.`,
      itemName: name,
      data: { id, name, barcode: target?.barcode },
    });
  };

  const handleRequestDeleteMultipleItems = (ids: string[], names: string[]) => {
    setDeleteModal({
      isOpen: true,
      type: 'items_batch',
      title: 'Hapus Beberapa Item Sekaligus',
      message: `Apakah Anda yakin ingin menghapus ${ids.length} item yang telah dipilih dari daftar pengadaan?`,
      itemCount: ids.length,
      data: { ids, names },
    });
  };

  const handleRequestClearAllItems = () => {
    if (items.length === 0) return;
    setDeleteModal({
      isOpen: true,
      type: 'items_batch',
      title: 'Kosongkan Keranjang Pengadaan',
      message: `Apakah Anda yakin ingin menghapus seluruh (${items.length}) item dari keranjang pengadaan? Surat Pesanan (PO) akan otomatis dikosongkan.`,
      itemCount: items.length,
      data: { clearAll: true },
    });
  };

  // Vendor Deletion Handlers
  const handleRequestDeleteVendor = (id: string, name: string) => {
    const target = vendors.find((v) => v.id === id);
    setDeleteModal({
      isOpen: true,
      type: 'vendor',
      title: 'Hapus Rekanan / Suplier',
      message: `Apakah Anda yakin ingin menghapus rekanan "${name}" (${target?.code || ''}) dari sistem UNIKMA? Rekanan tidak akan dapat dialokasikan lagi pada Surat Pesanan.`,
      itemName: `${name} (${target?.city || 'Jawa Tengah'})`,
      data: { id, name, code: target?.code },
    });
  };

  // Catalog Item Deletion Handler
  const handleRequestDeleteCatalogItem = (id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      type: 'catalog',
      title: 'Hapus Item Master Katalog Standar',
      message: `Apakah Anda yakin ingin menghapus item "${name}" dari master katalog standar UNIKMA? Item ini tidak akan lagi muncul sebagai opsi pilihan cepat bagi unit pemohon.`,
      itemName: name,
      data: { id, name },
    });
  };

  // Activity Log Deletion Handlers
  const handleRequestDeleteSingleLog = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      type: 'log',
      title: 'Hapus Catatan Log Audit',
      message: 'Apakah Anda ingin menghapus catatan riwayat aktivitas ini secara permanen dari sistem audit?',
      itemName: title,
      data: { id, title },
    });
  };

  const handleRequestClearFilteredLogs = (ids: string[]) => {
    setDeleteModal({
      isOpen: true,
      type: 'logs_filtered',
      title: 'Hapus Catatan Log Terfilter',
      message: `Apakah Anda yakin ingin menghapus ${ids.length} catatan aktivitas yang sedang ditampilkan berdasarkan filter?`,
      itemCount: ids.length,
      data: { ids },
    });
  };

  const handleRequestClearAllLogs = () => {
    setDeleteModal({
      isOpen: true,
      type: 'logs_all',
      title: 'Reset Seluruh Riwayat Log Audit',
      message: 'Apakah Anda yakin ingin mengosongkan seluruh riwayat perubahan dan aktivitas sistem pengadaan?',
      itemCount: logs.length,
    });
  };

  // Reset to initial mockup state
  const handleRequestResetData = () => {
    setDeleteModal({
      isOpen: true,
      type: 'reset_all',
      title: 'Reset ke Template Default UNIKMA',
      message: 'Apakah Anda yakin ingin mengembalikan seluruh daftar pengadaan, vendor rekanan, master katalog standar, dan log audit ke template bawaan awal kampus Universitas Komputama Cilacap?',
    });
  };

  // Master Confirmation Execution: Executes the confirmed delete operation
  const handleConfirmDelete = () => {
    const { type, data, itemCount } = deleteModal;

    if (type === 'item') {
      const { id, name, barcode } = data;
      setItems((prev) => prev.filter((it) => it.id !== id));
      if (barcodeModalItem?.id === id) {
        setBarcodeModalItem(null);
        setIsBarcodeModalOpen(false);
      }
      addLog('hapus', 'Penghapusan Item', `Item "${name}" (${barcode || id}) dihapus dari keranjang pengadaan`, id);
      showToast(`Item "${name}" berhasil dihapus dari keranjang.`);
    } else if (type === 'items_batch') {
      if (data?.clearAll) {
        const count = items.length;
        setItems([]);
        setBarcodeModalItem(null);
        setIsBarcodeModalOpen(false);
        addLog('hapus', 'Pengosongan Keranjang', `Seluruh item dalam keranjang (${count} item) telah dikosongkan`);
        showToast('Seluruh item dalam keranjang telah dikosongkan.');
      } else {
        const idsToDelete = (data?.ids as string[]) || [];
        setItems((prev) => prev.filter((it) => !idsToDelete.includes(it.id)));
        if (barcodeModalItem && idsToDelete.includes(barcodeModalItem.id)) {
          setBarcodeModalItem(null);
          setIsBarcodeModalOpen(false);
        }
        addLog('hapus', 'Penghapusan Massal', `${idsToDelete.length} item berhasil dihapus dari keranjang pengadaan`);
        showToast(`${idsToDelete.length} item berhasil dihapus.`);
      }
    } else if (type === 'vendor') {
      const { id, name } = data;
      setVendors((prev) => prev.filter((v) => v.id !== id));
      // If deleted vendor was assigned to active PO, reset PO vendor
      if (poInfo.vendorId === id || poInfo.vendor === name) {
        setPoInfo((prev) => ({
          ...prev,
          vendor: 'Belum ditentukan',
          vendorId: undefined,
          vendorPhone: '-',
          vendorAddress: '-',
        }));
      }
      addLog('vendor', 'Penghapusan Rekanan', `Rekanan penyedia "${name}" dihapus dari database rekanan kampus`, id);
      showToast(`Vendor rekanan "${name}" berhasil dihapus.`);
    } else if (type === 'catalog') {
      const { id, name } = data;
      setCatalog((prev) => prev.filter((c) => c.id !== id));
      addLog('katalog', 'Penghapusan Item Katalog', `Item standar "${name}" dihapus dari master acuan katalog kampus`, id);
      showToast(`Item katalog "${name}" berhasil dihapus.`);
    } else if (type === 'log') {
      const { id } = data;
      setLogs((prev) => prev.filter((l) => l.id !== id));
      showToast('Catatan log aktivitas berhasil dihapus.');
    } else if (type === 'logs_filtered') {
      const ids = (data?.ids as string[]) || [];
      setLogs((prev) => prev.filter((l) => !ids.includes(l.id)));
      showToast(`${ids.length} catatan log terfilter berhasil dihapus.`);
    } else if (type === 'logs_all') {
      setLogs([]);
      showToast('Seluruh riwayat audit log telah direset.');
    } else if (type === 'reset_all') {
      setItems(INITIAL_ITEMS);
      setLogs(INITIAL_LOGS);
      setVendors(INITIAL_VENDORS);
      setCatalog(INITIAL_CATALOG);
      addLog('status', 'Reset Sistem', 'Data pengadaan & katalog direset ke template default UNIKMA');
      showToast('Data berhasil dikembalikan ke template awal.');
    }

    // Close modal
    setDeleteModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Catalog Handlers (Create & Update)
  const handleCreateCatalogItem = (
    itemData: Omit<KatalogItem, 'id' | 'lastUpdated'>
  ) => {
    const newItem: KatalogItem = {
      ...itemData,
      id: 'cat-' + Date.now(),
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setCatalog((prev) => [newItem, ...prev]);
    addLog(
      'katalog',
      'Penambahan Item Katalog',
      `Item standar "${newItem.name}" (${newItem.category}) didaftarkan ke katalog kampus`,
      newItem.id
    );
    showToast(`"${newItem.name}" berhasil ditambahkan ke katalog standar.`);
  };

  const handleUpdateCatalogItem = (
    id: string,
    updates: Partial<KatalogItem>
  ) => {
    const target = catalog.find((c) => c.id === id);
    if (!target) return;

    setCatalog((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...updates,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : c
      )
    );

    addLog(
      'katalog',
      'Pembaruan Item Katalog',
      `Spesifikasi/HPS item katalog "${updates.name || target.name}" telah diperbarui`,
      id
    );
    showToast(`Item katalog "${updates.name || target.name}" berhasil diperbarui.`);
  };

  // Update status (e.g. from Penerimaan Barcode)
  const handleUpdateItemStatus = (
    id: string,
    status: ProcurementItem['status'],
    barcode: string
  ) => {
    const target = items.find((it) => it.id === id);
    if (!target) return;

    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status } : it))
    );

    addLog(
      'status',
      'Verifikasi Penerimaan',
      `Item "${target.name}" (${barcode}) status diubah menjadi "${status}"`,
      id
    );
    showToast(`Item "${target.name}" berhasil diverifikasi sebagai ${status}.`);
  };

  // Log Barcode Print
  const handleLogBarcodePrint = (barcodeStr: string) => {
    addLog('barcode', 'Pencetakan Barcode', `Barcode #${barcodeStr} dicetak`, undefined);
    showToast(`Barcode ${barcodeStr} siap dicetak.`);
  };

  // Vendor Handlers
  const handleAddVendor = (
    vendorData: Omit<Vendor, 'id' | 'code' | 'totalTransactions' | 'joinedDate'>
  ) => {
    const nextCode = `VND-${String(vendors.length + 1).padStart(3, '0')}`;
    const newVendor: Vendor = {
      ...vendorData,
      id: 'vnd-' + Date.now(),
      code: nextCode,
      totalTransactions: 0,
      joinedDate: formatShortDate(),
    };
    setVendors((prev) => [newVendor, ...prev]);
    addLog(
      'vendor',
      'Registrasi Vendor Baru',
      `Rekanan "${newVendor.name}" (${newVendor.code}) berhasil didaftarkan`,
      newVendor.id
    );
    showToast(`Vendor "${newVendor.name}" berhasil didaftarkan.`);
  };

  const handleUpdateVendor = (id: string, updates: Partial<Vendor>) => {
    const target = vendors.find((v) => v.id === id);
    if (!target) return;

    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );

    addLog(
      'vendor',
      'Pembaruan Data Rekanan',
      `Data rekanan "${updates.name || target.name}" telah diperbarui`,
      id
    );
    showToast(`Data rekanan "${updates.name || target.name}" diperbarui.`);
  };

  const handleAssignVendorToPO = (vendor: Vendor) => {
    setPoInfo((prev) => ({
      ...prev,
      vendor: vendor.name,
      vendorId: vendor.id,
      vendorPhone: vendor.phone,
      vendorAddress: `${vendor.address}, ${vendor.city}`,
    }));
    addLog(
      'vendor',
      'Penugasan Rekanan PO',
      `Surat Pesanan #${poInfo.poNumber} dialokasikan ke penyedia "${vendor.name}"`,
      vendor.id
    );
    showToast(`Penyedia "${vendor.name}" ditugaskan ke Surat Pesanan (PO).`);
  };

  // Print PO Handler
  const handlePrintPO = () => {
    const printUser = currentUser ? `${currentUser.name} (${currentUser.roleLabel})` : 'Staf Pengadaan';
    addLog(
      'cetak',
      'Pencetakan Purchase Order',
      `Surat Pesanan #${poInfo.poNumber} dicetak oleh ${printUser}`,
      undefined
    );
    showToast(`Surat Pesanan ${poInfo.poNumber} diproses untuk dicetak.`);
  };

  // Filter items by search query if applicable
  const displayItems = searchQuery.trim()
    ? items.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  // Real Authentication Gate: If not logged in, render ONLY the Login Screen (No bypass)
  if (!currentUser) {
    return (
      <div className="h-screen w-full bg-[#091b38] flex items-center justify-center p-4">
        <LoginModal
          isOpen={true}
          onLoginSuccess={handleLoginSuccess}
          canClose={false}
        />
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f1f5f9] flex flex-col text-slate-800 antialiased font-sans">
      {/* Top Navigation Bar (Fixed at Top: position fixed, height: 64px, z-index: 40) */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={currentUser}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onOpenChangePasswordModal={() => setIsChangePasswordOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Layout Container: Fixed Sidebar + Independently Scrollable Main Area */}
      <div className="flex w-full overflow-hidden">
        {/* Left Sidebar (Fixed on the left, stays in place, does not scroll with content) */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'riwayat') {
              setIsLogModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          cartItemCount={items.length}
          vendorCount={vendors.length}
          catalogCount={catalog.length}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          currentUser={currentUser}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
        />

        {/* Main Content Area (Independent scroll: overflow-y: auto and height: calc(100vh - topbar_height)) */}
        <main
          className="ml-0 md:ml-64 lg:ml-72 mt-16 flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 bg-[#edf2f7] scroll-smooth"
          style={{ height: 'calc(100vh - var(--topbar-height, 64px))' }}
        >
          {/* View: Pengajuan (The primary layout matching the screenshot) */}
          {activeTab === 'pengajuan' && (
            <div className="space-y-4 max-w-[1600px] mx-auto">
              {/* Page Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200/80 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shadow-xs">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>Pengajuan / Transaksi</span>
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Kelola pengadaan barang dan jasa dengan mudah dan terintegrasi.
                    </p>
                  </div>
                </div>

                {/* Quick actions right of title */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('vendor')}
                    className="text-xs px-3 py-1.5 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Pilih Vendor Rekanan ({vendors.length})</span>
                  </button>
                  {currentUser.role === 'admin' ? (
                    <button
                      onClick={handleRequestResetData}
                      className="text-xs px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Reset ke data awal screenshot"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Template Data Awal</span>
                    </button>
                  ) : (
                    <span
                      className="text-xs px-2.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-400 rounded-lg font-medium flex items-center gap-1.5 cursor-not-allowed select-none"
                      title="Hanya Manager/Admin yang dapat mereset data sistem"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                      <span className="hidden sm:inline">Reset Dibatasi</span>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setBarcodeModalItem(null);
                      setIsBarcodeModalOpen(true);
                    }}
                    className="text-xs px-3 py-1.5 bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-700 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Cetak Semua Barcode</span>
                  </button>
                </div>
              </div>

              {/* 3-Column Content Layout matching screenshot */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                {/* Column 1: Form Tambah Item (Left, 3.5 cols on XL) */}
                <div className="xl:col-span-3 space-y-4">
                  <FormTambahItem onAddItem={handleAddItem} />
                </div>

                {/* Column 2: Table & PO Preview (Middle, 6 cols on XL) */}
                <div className="xl:col-span-6 space-y-4">
                  {/* Daftar Pengadaan Table with single & batch delete */}
                  <TabelPengadaan
                    items={displayItems}
                    onUpdateItem={handleUpdateItem}
                    onDeleteItem={handleRequestDeleteItem}
                    onDeleteMultipleItems={handleRequestDeleteMultipleItems}
                    onClearAllItems={handleRequestClearAllItems}
                    onViewBarcode={(item) => {
                      setBarcodeModalItem(item);
                      setIsBarcodeModalOpen(true);
                    }}
                    userRole={currentUser.role}
                  />

                  {/* PO Document Preview & Metadata Summary with Vendor Integration */}
                  <PurchaseOrderCard
                    items={items}
                    poInfo={poInfo}
                    vendors={vendors}
                    onSelectVendor={handleAssignVendorToPO}
                    onNavigateToVendors={() => setActiveTab('vendor')}
                    onPreviewFullscreen={() => setIsPOModalOpen(true)}
                    onPrintPO={() => {
                      setIsPOModalOpen(true);
                      handlePrintPO();
                    }}
                    userRole={currentUser.role}
                    onApprovePO={handleApprovePO}
                  />
                </div>

                {/* Column 3: Riwayat Aktivitas & System Status (Right, 2.5 cols on XL) */}
                <div className="xl:col-span-3 space-y-4">
                  <LogAktivitasPanel
                    logs={logs}
                    onOpenFullHistory={() => setIsLogModalOpen(true)}
                    onDeleteLog={handleRequestDeleteSingleLog}
                  />
                </div>
              </div>
            </div>
          )}

          {/* View: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="max-w-[1400px] mx-auto">
              <DashboardView
                items={items}
                logs={logs}
                vendorCount={vendors.length}
                onNavigateToPengajuan={() => setActiveTab('pengajuan')}
                onOpenPO={() => setIsPOModalOpen(true)}
                onOpenLogs={() => setIsLogModalOpen(true)}
                onNavigateToVendors={() => setActiveTab('vendor')}
              />
            </div>
          )}

          {/* View: Manajemen Katalog */}
          {activeTab === 'katalog' && (
            <div className="max-w-[1400px] mx-auto">
              <KatalogView
                catalog={catalog}
                onAddCatalogItem={handleCreateCatalogItem}
                onUpdateCatalogItem={handleUpdateCatalogItem}
                onDeleteCatalogItem={handleRequestDeleteCatalogItem}
                onAddItemToCart={handleAddItem}
                onNavigateToCart={() => setActiveTab('pengajuan')}
                userRole={currentUser.role}
                currentUser={currentUser}
              />
            </div>
          )}

          {/* View: Penerimaan & Barcode */}
          {activeTab === 'penerimaan' && (
            <div className="max-w-[1400px] mx-auto">
              <PenerimaanBarcodeView
                items={items}
                onUpdateItemStatus={handleUpdateItemStatus}
                onOpenBarcodeModal={(item) => {
                  setBarcodeModalItem(item);
                  setIsBarcodeModalOpen(true);
                }}
              />
            </div>
          )}

          {/* View: Manajemen Vendor / Suplier */}
          {activeTab === 'vendor' && (
            <div className="max-w-[1400px] mx-auto">
              <VendorManagementView
                vendors={vendors}
                onAddVendor={handleAddVendor}
                onUpdateVendor={handleUpdateVendor}
                onDeleteVendor={handleRequestDeleteVendor}
                onAssignVendorToPO={handleAssignVendorToPO}
                currentPOVendorName={poInfo.vendor}
                onNavigateToPO={() => setActiveTab('pengajuan')}
                userRole={currentUser.role}
              />
            </div>
          )}
        </main>
      </div>

      {/* Fullscreen Purchase Order Modal */}
      <PurchaseOrderModal
        isOpen={isPOModalOpen}
        onClose={() => setIsPOModalOpen(false)}
        items={items}
        poInfo={poInfo}
        onPrint={handlePrintPO}
      />

      {/* Full Audit Log History Modal with Date Filtering and Individual/Filtered/All Delete */}
      <RiwayatAktivitasFullModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        logs={logs}
        onClearLogs={handleRequestClearAllLogs}
        onDeleteSingleLog={handleRequestDeleteSingleLog}
        onDeleteFilteredLogs={handleRequestClearFilteredLogs}
        userRole={currentUser.role}
      />

      {/* Barcode Sticker Label Modal */}
      <BarcodeModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        item={barcodeModalItem}
        allItems={items}
        onLogPrintBarcode={handleLogBarcodePrint}
      />

      {/* Master Confirmation Delete Modal (100% reliable inside iframes, replaces window.confirm) */}
      <ConfirmDeleteModal
        modalState={deleteModal}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Login & Role Selection Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setIsLoginModalOpen(false)}
        canClose={true}
      />

      {/* Change Password Modal (Real credentials update) */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        currentUser={currentUser}
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={(msg) => {
          showToast(msg);
          addLog(
            'status',
            'Perubahan Kata Sandi',
            `Kata sandi akun "${currentUser.name}" berhasil diubah.`
          );
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
