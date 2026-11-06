import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Layers,
  Barcode,
  History,
  Store,
  X,
  Sparkles,
  ShieldCheck,
  Crown,
  Briefcase,
  Users,
  ChevronRight,
} from 'lucide-react';
import { AuthUser } from '../types';
import { getRoleBadgeInfo } from '../utils/auth';
import { UnikmaLogo } from './UnikmaLogo';

export type TabType = 'pengajuan' | 'dashboard' | 'katalog' | 'penerimaan' | 'vendor' | 'riwayat';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  cartItemCount: number;
  vendorCount?: number;
  catalogCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  currentUser?: AuthUser;
  onOpenLoginModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  cartItemCount,
  vendorCount,
  catalogCount,
  isOpenMobile = false,
  onCloseMobile,
  currentUser,
  onOpenLoginModal,
}) => {
  const roleInfo = currentUser ? getRoleBadgeInfo(currentUser.role) : null;

  const menuItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number; desc: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      desc: currentUser?.role === 'owner' ? 'Ringkasan & Approval Eksekutif' : 'Ringkasan & Analitik Pagu',
    },
    {
      id: 'pengajuan',
      label: 'Pengajuan / Transaksi',
      icon: <FileSpreadsheet className="w-4 h-4 shrink-0" />,
      badge: cartItemCount,
      desc: currentUser?.role === 'karyawan' ? 'Input Permohonan Pengadaan' : 'Keranjang & Surat Pesanan',
    },
    {
      id: 'katalog',
      label: 'Manajemen Katalog',
      icon: <Layers className="w-4 h-4 shrink-0" />,
      badge: catalogCount,
      desc: 'Standar Barang Kampus',
    },
    {
      id: 'vendor',
      label: 'Manajemen Vendor',
      icon: <Store className="w-4 h-4 shrink-0" />,
      badge: vendorCount,
      desc: currentUser?.role === 'admin' ? 'Kelola Rekanan & Legalitas' : 'Daftar Rekanan Resmi UNIKMA',
    },
    {
      id: 'penerimaan',
      label: 'Penerimaan & Barcode',
      icon: <Barcode className="w-4 h-4 shrink-0" />,
      desc: currentUser?.role === 'admin' ? 'Verifikasi Fisik & BAST' : 'Cek Status & Label Aset',
    },
    {
      id: 'riwayat',
      label: 'Riwayat Aktivitas',
      icon: <History className="w-4 h-4 shrink-0" />,
      desc: 'Audit Log & Filter Tanggal',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 top-16 bg-black/60 backdrop-blur-xs z-25 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Fixed Sidebar: Positioned fixed at top-16 left-0 bottom-0, never scrolls with page */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 lg:w-72 bg-[#091b38] text-slate-300 flex flex-col justify-between border-r border-blue-950/60 z-30 select-none overflow-y-auto overflow-x-hidden transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ height: 'calc(100vh - var(--topbar-height, 64px))' }}
      >
        {/* Top Section / Header inside Sidebar */}
        <div className="p-3.5 pb-2 border-b border-blue-900/40">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Modul Pengadaan</span>
            </span>
            {isOpenMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="py-3 px-3 space-y-1.5 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left group ${
                  isActive
                    ? 'bg-[#008ba3] text-white shadow-md shadow-cyan-950/40'
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-950/80 text-cyan-300 group-hover:text-white group-hover:bg-blue-900'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <div className="min-w-0 truncate">
                    <div className="truncate whitespace-nowrap font-bold">{item.label}</div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-cyan-100' : 'text-slate-400'}`}>
                      {item.desc}
                    </div>
                  </div>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ml-2 shrink-0 ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-cyan-500 text-slate-950 font-black'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Current User Session Widget with Role Badge */}
        {currentUser && roleInfo && (
          <div className="p-3 mx-3 mb-2 rounded-xl bg-blue-950/60 border border-blue-800/40 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                <span>Hak Akses Login</span>
              </span>
              {onOpenLoginModal && (
                <button
                  onClick={onOpenLoginModal}
                  className="text-[10px] text-cyan-300 hover:text-white underline cursor-pointer"
                >
                  Ganti
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${roleInfo.cardBg}`}
              >
                {currentUser.avatarInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white font-bold truncate text-[11px]">{currentUser.name}</div>
                <div className={`text-[9px] font-mono font-bold uppercase truncate inline-block px-1.5 py-0.2 rounded border mt-0.5 ${roleInfo.color}`}>
                  {roleInfo.label}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info with Official Logo */}
        <div className="p-3.5 border-t border-blue-950/80 bg-[#06142a]/90">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#091b38] border border-cyan-500/30 flex items-center justify-center p-1 shrink-0 shadow-sm">
              <UnikmaLogo size={34} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white tracking-wide truncate">
                UNIKMA CILACAP
              </div>
              <div className="text-[10px] text-amber-300 italic truncate font-medium">
                Ideologies, Digital-Economist...
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                Jl. Majenang - Cimanggu No.99
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
