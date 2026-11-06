import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export interface DeleteModalState {
  isOpen: boolean;
  type: 'item' | 'items_batch' | 'vendor' | 'vendors_batch' | 'log' | 'logs_filtered' | 'logs_all' | 'reset_all' | 'catalog';
  title: string;
  message: string;
  itemName?: string;
  itemCount?: number;
  data?: any;
}

interface ConfirmDeleteModalProps {
  modalState: DeleteModalState;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  modalState,
  onConfirm,
  onClose,
}) => {
  const { isOpen, title, message, itemName, itemCount } = modalState;

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        {/* Header decoration bar */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Warning / Trash Icon */}
            <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3
                  id="delete-modal-title"
                  className="font-bold text-base text-slate-900 tracking-tight leading-snug"
                >
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {message}
              </p>

              {/* Item Details Box */}
              {itemName && (
                <div className="mt-3 p-3 bg-red-50/60 rounded-xl border border-red-200/70 text-xs font-medium text-red-950 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="truncate font-semibold">{itemName}</span>
                </div>
              )}

              {itemCount !== undefined && itemCount > 0 && (
                <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                  <span className="font-medium text-slate-500">Jumlah data yang terpengaruh:</span>
                  <span className="font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                    {itemCount} entri
                  </span>
                </div>
              )}

              <p className="text-[11px] text-slate-400 italic mt-3">
                * Aksi penghapusan ini akan dicatat ke dalam Log Audit Aktivitas UNIKMA dan data tersimpan di LocalStorage akan langsung diperbarui.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-md shadow-red-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Ya, Hapus Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
