import React, { useState } from 'react';
import {
  ShoppingCart,
  Info,
  Pencil,
  Check,
  X,
  Trash2,
  Barcode as BarcodeIcon,
  Coins,
  ChevronUp,
  ChevronDown,
  AlertOctagon,
  Lock,
  ShieldCheck,
  Crown,
  Users,
} from 'lucide-react';
import { ProcurementItem, UserRole } from '../types';
import { formatNumberIndo, formatRupiah, terbilang } from '../utils/formatters';

interface TabelPengadaanProps {
  items: ProcurementItem[];
  onUpdateItem: (id: string, updates: Partial<ProcurementItem>, logDesc?: string) => void;
  onDeleteItem: (id: string, name: string) => void;
  onDeleteMultipleItems?: (ids: string[], names: string[]) => void;
  onClearAllItems?: () => void;
  onViewBarcode: (item: ProcurementItem) => void;
  userRole?: UserRole;
}

export const TabelPengadaan: React.FC<TabelPengadaanProps> = ({
  items,
  onUpdateItem,
  onDeleteItem,
  onDeleteMultipleItems,
  onClearAllItems,
  onViewBarcode,
  userRole = 'admin',
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // RBAC Permission checks
  const canEdit = userRole === 'admin';
  const canDelete = userRole === 'admin';

  const startEditName = (item: ProcurementItem) => {
    if (!canEdit) return;
    setEditingId(item.id);
    setEditName(item.name);
  };

  const cancelEditName = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEditName = (item: ProcurementItem) => {
    if (!canEdit) return;
    if (!editName.trim() || editName.trim() === item.name) {
      cancelEditName();
      return;
    }
    const oldName = item.name;
    const newName = editName.trim();
    onUpdateItem(
      item.id,
      { name: newName },
      `Admin mengubah nama "${oldName}" menjadi "${newName}"`
    );
    setEditingId(null);
  };

  const handleQuantityChange = (item: ProcurementItem, newQty: number) => {
    if (!canEdit) return;
    if (newQty < 1 || newQty === item.quantity) return;
    const oldQty = item.quantity;
    onUpdateItem(
      item.id,
      { quantity: newQty },
      `Item "${item.name}" jumlah diubah dari ${oldQty} menjadi ${newQty}`
    );
  };

  const handlePriceChange = (item: ProcurementItem, newPriceStr: string) => {
    if (!canEdit) return;
    const raw = Number(newPriceStr.replace(/\D/g, ''));
    if (isNaN(raw) || raw < 0 || raw === item.unitPrice) return;
    onUpdateItem(
      item.id,
      { unitPrice: raw },
      `Item "${item.name}" estimasi harga diubah menjadi ${formatRupiah(raw)}`
    );
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    if (!canDelete) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (!canDelete) return;
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handleDeleteSelected = () => {
    if (!canDelete || selectedIds.length === 0 || !onDeleteMultipleItems) return;
    const selectedNames = items
      .filter((i) => selectedIds.includes(i.id))
      .map((i) => i.name);
    onDeleteMultipleItems(selectedIds, selectedNames);
    setSelectedIds([]);
  };

  const isAllSelected = canDelete && items.length > 0 && selectedIds.length === items.length;
  const isSomeSelected = canDelete && selectedIds.length > 0 && selectedIds.length < items.length;

  const grandTotal = items.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-[#0b254e] text-white px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600/40 flex items-center justify-center text-blue-200">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">
              Daftar Pengadaan (Keranjang / Purchase Order)
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Role badge in header */}
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border bg-white/10 text-cyan-200 border-white/15">
            {userRole === 'admin' ? 'Akses Manager' : userRole === 'owner' ? 'Akses Owner' : 'Akses Karyawan'}
          </span>

          {canDelete && items.length > 0 && onClearAllItems && (
            <button
              onClick={onClearAllItems}
              className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white px-2.5 py-1 rounded-lg border border-red-400/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Kosongkan seluruh isi keranjang pengadaan (Hanya Manager/Admin)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan Semua</span>
            </button>
          )}

          <span className="text-xs bg-white/10 text-blue-100 px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{items.length} Item</span>
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Info Banner & Multi-Delete Action Bar */}
        {selectedIds.length > 0 && canDelete ? (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-red-900 font-semibold">
              <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
              <span>{selectedIds.length} item telah dipilih untuk dikelola</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1 text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-md font-medium transition-colors cursor-pointer"
              >
                Batal Pilih
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded-md font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Terpilih ({selectedIds.length})</span>
              </button>
            </div>
          </div>
        ) : (
          /* Role-Specific Guidance Banner */
          <div
            className={`flex items-start gap-3 p-3 rounded-lg text-xs leading-relaxed border ${
              userRole === 'admin'
                ? 'bg-blue-50/70 border-blue-200/80 text-blue-900'
                : userRole === 'owner'
                ? 'bg-amber-50/80 border-amber-200/90 text-amber-900'
                : 'bg-emerald-50/80 border-emerald-200/90 text-emerald-900'
            }`}
          >
            {userRole === 'admin' ? (
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            ) : userRole === 'owner' ? (
              <Crown className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <Users className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div>
              {userRole === 'admin' && (
                <span>
                  <strong>Akses Manager / Admin:</strong> Anda memiliki hak penuh untuk mengedit nama, jumlah, mengoreksi harga satuan, menghapus item dari keranjang, dan mengalokasikan rekanan PO.
                </span>
              )}
              {userRole === 'owner' && (
                <span>
                  <strong>Akses Owner / Pimpinan:</strong> Mode tinjauan & persetujuan eksekutif. Anda dapat memantau permohonan barang, total pagu biaya, serta melakukan <strong>Approval Dokumen PO</strong>.
                </span>
              )}
              {userRole === 'karyawan' && (
                <span>
                  <strong>Akses Karyawan / Staf:</strong> Anda dapat mengajukan permohonan item baru dari form atau katalog. Perubahan harga satuan resmi dan penghapusan item dibatasi untuk otoritas Manager / Admin.
                </span>
              )}
            </div>
          </div>
        )}

        {/* Items Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                {/* Select All Checkbox (Only active for Admin) */}
                {canDelete && (
                  <th className="py-2.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isSomeSelected;
                      }}
                      onChange={handleSelectAll}
                      disabled={items.length === 0}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      title="Pilih Semua Item"
                    />
                  </th>
                )}
                <th className="py-2.5 px-2 w-10 text-center">No</th>
                <th className="py-2.5 px-3 min-w-[220px]">Nama Barang/Jasa</th>
                <th className="py-2.5 px-3 w-28 text-center">Jumlah</th>
                <th className="py-2.5 px-3 w-36 text-right">Estimasi Harga (Rp)</th>
                <th className="py-2.5 px-3 w-36 text-right">Total (Rp)</th>
                <th className="py-2.5 px-3 w-20 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={canDelete ? 7 : 6} className="py-10 text-center text-slate-400">
                    <p className="text-sm font-medium">Keranjang pengadaan masih kosong</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {userRole === 'owner'
                        ? 'Belum ada pengajuan barang yang dimasukkan oleh unit/staf.'
                        : 'Silakan isi formulir di sebelah kiri untuk menambahkan item pengadaan baru.'}
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  const lineTotal = item.quantity * item.unitPrice;
                  const isEditingThis = editingId === item.id;
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors group ${
                        isSelected
                          ? 'bg-red-50/40 hover:bg-red-50/60'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Checkbox (Admin Only) */}
                      {canDelete && (
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(item.id)}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                      )}

                      {/* No */}
                      <td className="py-3 px-2 text-center text-slate-500 font-medium">
                        {idx + 1}
                      </td>

                      {/* Nama Barang/Jasa */}
                      <td className="py-3 px-3">
                        {isEditingThis && canEdit ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditName(item);
                                if (e.key === 'Escape') cancelEditName();
                              }}
                              autoFocus
                              className="w-full px-2 py-1 text-xs border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                            />
                            <button
                              onClick={() => saveEditName(item)}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                              title="Simpan Nama"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={cancelEditName}
                              className="p-1 bg-slate-300 text-slate-700 rounded hover:bg-slate-400 cursor-pointer"
                              title="Batal"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between group/name">
                            <div className="min-w-0 pr-2">
                              <span className="font-semibold text-slate-800 break-words">
                                {item.name}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.2 rounded">
                                  {item.barcode}
                                </span>
                                <span className="text-[10px] text-blue-700 font-medium">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              {canEdit && (
                                <button
                                  onClick={() => startEditName(item)}
                                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                                  title="Edit nama item (Manager)"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                onClick={() => onViewBarcode(item)}
                                className="p-1 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded cursor-pointer"
                                title="Lihat Barcode"
                              >
                                <BarcodeIcon className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Jumlah (Quantity Stepper vs Static) */}
                      <td className="py-3 px-3 text-center">
                        {canEdit ? (
                          <div className="inline-flex items-center border border-slate-300 rounded-md bg-white shadow-2xs">
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                              title="Kurangi jumlah"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-mono font-bold text-slate-800 w-8 text-center text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              className="px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                              title="Tambah jumlah"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono font-bold text-slate-800 px-2 py-1 bg-slate-100 rounded text-xs">
                            {item.quantity} unit
                          </span>
                        )}
                      </td>

                      {/* Estimasi Harga (Rp) */}
                      <td className="py-3 px-3 text-right">
                        {canEdit ? (
                          <div className="inline-block relative">
                            <input
                              type="text"
                              defaultValue={formatNumberIndo(item.unitPrice)}
                              key={item.unitPrice}
                              onBlur={(e) => handlePriceChange(item, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                              className="w-28 text-right py-1 px-2 border border-slate-300 rounded-md focus:border-blue-500 focus:outline-none font-mono text-slate-700 hover:border-slate-400"
                              title="Klik untuk ubah estimasi harga satuan (Khusus Manager)"
                            />
                          </div>
                        ) : (
                          <span className="font-mono font-medium text-slate-700">
                            {formatNumberIndo(item.unitPrice)}
                          </span>
                        )}
                      </td>

                      {/* Total (Rp) */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                        {formatNumberIndo(lineTotal)}
                      </td>

                      {/* Aksi Hapus / Status Lock */}
                      <td className="py-3 px-3 text-center">
                        {canDelete ? (
                          <button
                            type="button"
                            onClick={() => onDeleteItem(item.id, item.name)}
                            className="p-1.5 text-red-500 hover:text-white hover:bg-red-600 rounded-md transition-colors cursor-pointer"
                            title={`Hapus "${item.name}"`}
                            aria-label={`Hapus ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span
                            className="inline-flex p-1.5 text-slate-400 bg-slate-100 rounded cursor-not-allowed"
                            title="Hanya Manager / Admin yang dapat menghapus item"
                          >
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Total Biaya Pengadaan Banner */}
        <div className="bg-[#f0f6ff] border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">
                Total Biaya Pengadaan
              </div>
              <div className="text-xl font-black text-slate-900 tracking-tight">
                {formatRupiah(grandTotal)}
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block max-w-sm">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Terbilang:
            </div>
            <div className="text-xs italic text-blue-800 font-medium line-clamp-2">
              "{terbilang(grandTotal)}"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
