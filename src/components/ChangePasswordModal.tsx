import React, { useState } from 'react';
import { KeyRound, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, X, ShieldCheck } from 'lucide-react';
import { AuthUser } from '../types';
import { changeUserPassword } from '../utils/auth';

interface ChangePasswordModalProps {
  isOpen: boolean;
  currentUser: AuthUser;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSuccess,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!oldPassword.trim()) {
      setError('Silakan masukkan kata sandi Anda saat ini.');
      return;
    }
    if (!newPassword.trim()) {
      setError('Silakan masukkan kata sandi baru.');
      return;
    }
    if (newPassword.trim().length < 5) {
      setError('Kata sandi baru minimal harus 5 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi baru tidak cocok. Periksa kembali.');
      return;
    }

    setLoading(true);
    const result = changeUserPassword(currentUser.id, oldPassword, newPassword);
    setLoading(false);

    if (result.success) {
      onSuccess(`Kata sandi akun ${currentUser.name} (${currentUser.username}) berhasil diperbarui.`);
      onClose();
    } else {
      setError(result.error || 'Gagal mengubah kata sandi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#17326b] text-white px-5 py-4 flex items-center justify-between border-b-2 border-cyan-500">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight text-white">Ganti Kata Sandi Akun</h3>
              <p className="text-[10px] text-cyan-200 font-medium mt-0.5">
                Akun: {currentUser.name} ({currentUser.username})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-[11px] text-blue-900 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              Perubahan kata sandi bersifat permanen dan tersimpan di database lokal sistem. Setelah diganti, kata sandi lama tidak akan berlaku lagi saat login.
            </div>
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Kata Sandi Saat Ini <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showOld ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama Anda"
                className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-slate-800"
                required
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showOld ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Kata Sandi Baru <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 5 karakter"
                className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-slate-800"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Ulangi Kata Sandi Baru <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showNew ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang kata sandi baru"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-slate-800"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#17326b] hover:bg-[#112652] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Simpan Kata Sandi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
