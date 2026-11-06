import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  CheckCircle2,
  Crown,
  Briefcase,
  Users,
  ArrowRight,
  Info,
  KeyRound,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { authenticateUser, getRegisteredUsers, getRoleBadgeInfo } from '../utils/auth';
import { UnikmaLogo } from './UnikmaLogo';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: AuthUser) => void;
  onClose?: () => void;
  canClose?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  onClose,
  canClose = false,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage('Username akun wajib diisi.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);

    // Simulate authentic server verification delay
    setTimeout(() => {
      const result = authenticateUser(username, password);
      setIsLoading(false);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(
          result.error || 'Autentikasi gagal. Silakan periksa kembali username dan kata sandi Anda.'
        );
      }
    }, 250);
  };

  // Helper to prefill username for convenience, but STILL REQUIRES typing the password!
  const handleSelectAccountToFill = (accUsername: string) => {
    setUsername(accUsername);
    setPassword('');
    setErrorMessage(null);
  };

  const registeredUsersList = getRegisteredUsers();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-150">
        {/* Header Branding */}
        <div className="bg-[#17326b] text-white p-6 relative overflow-hidden border-b-2 border-[#008ba3]">
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 p-1.5 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <UnikmaLogo size={46} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 px-2 py-0.5 rounded font-bold tracking-wider">
                    Sistem Autentikasi Pengadaan
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Login Sungguhan</span>
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
                  Masuk Akun Pengadaan UNIKMA
                </h2>
                <p className="text-xs text-blue-200/90 mt-0.5 font-medium">
                  Universitas Komputama Cilacap • Kampus Majenang / Cimanggu
                </p>
              </div>
            </div>

            {canClose && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
                aria-label="Tutup"
              >
                ✕
              </button>
            )}
          </div>
          {/* Background ambient lighting */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
        </div>

        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Real Login Form (Username & Password verification) */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#008ba3]" />
                <span>Formulir Autentikasi Kredensial</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                Wajib mengisi username & kata sandi
              </span>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2.5 animate-in shake">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username / Email Akun <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Contoh: admin / owner / karyawan"
                  className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 font-medium text-slate-900 bg-white shadow-2xs"
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Kata Sandi (Password) <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  Sesuai akun yang terdaftar
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Masukkan kata sandi akun Anda"
                  className="w-full pl-10 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 font-mono text-slate-900 bg-white shadow-2xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <span>Simpan sesi aktif di perangkat ini</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#17326b] hover:bg-[#112652] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Memverifikasi Kredensial...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-cyan-300" />
                    <span>Verifikasi & Masuk ke Sistem</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Official Registered Accounts Directory (Informational, No Auto-Bypass) */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xs text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Daftar Akun Terdaftar Kampus UNIKMA</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                Klik baris untuk mengisi username
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sistem menggunakan pembatasan login dan kata sandi sungguhan. Berikut adalah daftar akun terdaftar dan kata sandi bawaan awalnya (dapat Anda ganti setelah login):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {registeredUsersList.map(({ user }) => {
                const badge = getRoleBadgeInfo(user.role);
                const isSelected = username.toLowerCase() === user.username.toLowerCase();
                const defaultPass = `${user.role}123`;

                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectAccountToFill(user.username)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/60 shadow-xs ring-2 ring-cyan-400/30'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase border ${badge.color}`}>
                          {user.role}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                          @{user.username}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-slate-900 line-clamp-1">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                        {user.department}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-600 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Kata Sandi Bawaan:</span>
                        <code className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                          {defaultPass}
                        </code>
                      </div>
                      <div className="text-[9px] text-[#008ba3] font-bold mt-1 text-center">
                        {isSelected ? '✓ Username Terpilih' : 'Klik untuk isi username'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role Permissions Matrix Explainer */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-[11px] text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Matriks Batasan Hak Akses (Role-Based Access Control)</span>
            </div>
            <div className="space-y-1.5 text-[11px] leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-900 w-28 shrink-0">1. Manager/Admin:</span>
                <span className="text-slate-600">
                  Akses operasional penuh: tambah/edit/hapus item & katalog, kelola rekanan vendor, alokasi vendor ke PO, penerimaan fisik BAST, dan reset sistem.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-900 w-28 shrink-0">2. Owner:</span>
                <span className="text-slate-600">
                  Akses eksekutif: supervisi anggaran, analitik dashboard, audit log lengkap, dan <strong>Persetujuan Resmi (Approval PO)</strong>. Dibatasi dari pengubahan harga atau penghapusan data.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-900 w-28 shrink-0">3. Karyawan:</span>
                <span className="text-slate-600">
                  Akses pemohon pengadaan: membuat usulan barang dan katalog. <strong>Terkunci dari:</strong> ubah harga satuan, hapus item, kelola vendor, approval PO, dan reset template.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
