import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  ShieldCheck,
  X,
  Phone,
  Home,
  Menu,
  LogOut,
  UserCheck,
  Crown,
  Briefcase,
  Users,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { getCurrentDateIndo, getCurrentTimeWIB } from '../utils/formatters';
import { getRoleBadgeInfo } from '../utils/auth';
import { UnikmaLogo } from './UnikmaLogo';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUser: AuthUser;
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
  onOpenChangePasswordModal: () => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onSwitchRole?: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  currentUser,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
  onOpenChangePasswordModal,
  onOpenLoginModal,
  onLogout,
}) => {
  const [currentDate, setCurrentDate] = useState(getCurrentDateIndo());
  const [currentTime, setCurrentTime] = useState(getCurrentTimeWIB());
  const [showUserMenu, setShowUserMenu] = useState(false);

  const roleInfo = getRoleBadgeInfo(currentUser.role);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(getCurrentDateIndo());
      setCurrentTime(getCurrentTimeWIB());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-[#17326b] text-white border-b-2 border-[#008ba3] shadow-md flex items-center select-none">
      <div className="flex items-center justify-between px-3 sm:px-5 gap-3 w-full h-full">
        {/* Mobile Hamburger Button + Brand */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1.5 text-blue-200 hover:text-white hover:bg-blue-800/60 rounded-lg cursor-pointer transition-colors"
            title={isMobileSidebarOpen ? 'Tutup Menu' : 'Buka Menu'}
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Official Brand Logo of Universitas Komputama Cilacap */}
          <div className="p-0.5 shrink-0 flex items-center justify-center">
            <UnikmaLogo size={38} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-bold text-sm sm:text-base md:text-lg tracking-normal text-white leading-tight">
                Universitas Komputama Cilacap
              </h1>
              <span className="hidden sm:inline-block text-[10px] bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                E-Proc
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-[#a5b8e0] font-medium tracking-tight mt-0.5 line-clamp-1">
              Ideologies, Digital-Economist, Adaptive, Leadership
            </p>
          </div>
        </div>

        {/* Contact Info from Official Banner (Visible on ultra-wide screens) */}
        <div className="hidden 2xl:flex items-center gap-6 border-l border-blue-400/30 pl-5 text-xs text-blue-100">
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-cyan-300 shrink-0" />
            <div>
              <div className="font-semibold text-white leading-none">0815-6855-909</div>
              <div className="text-[10px] text-blue-200/80 mt-0.5">info@unikmacilacap.ac.id</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Home className="w-4 h-4 text-cyan-300 shrink-0" />
            <div>
              <div className="font-semibold text-white leading-none">Kampus UNIKMA</div>
              <div className="text-[10px] text-blue-200/80 mt-0.5">Jl. Majenang - Cimanggu No.99</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xs sm:max-w-md lg:max-w-lg mx-1 sm:mx-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari item, PO, rekanan, atau nomor barcode..."
              className="w-full pl-9 pr-8 py-1.5 sm:py-2 bg-white text-slate-800 text-xs sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-200 shadow-inner placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Info: Live Date, Role Pill & Profile */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Live Date/Time Widget */}
          <div className="hidden xl:flex items-center gap-2 text-xs text-blue-100 bg-blue-900/40 px-3 py-1.5 rounded-lg border border-blue-700/40">
            <Calendar className="w-3.5 h-3.5 text-cyan-300" />
            <div>
              <div className="font-semibold leading-none">{currentDate}</div>
              <div className="text-[10px] text-cyan-200 font-mono mt-0.5">{currentTime}</div>
            </div>
          </div>

          {/* Active Role Indicator Pill */}
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${roleInfo.color}`}
            title={roleInfo.desc}
          >
            {currentUser.role === 'owner' ? (
              <Crown className="w-3 h-3 text-amber-300" />
            ) : currentUser.role === 'admin' ? (
              <Briefcase className="w-3 h-3 text-cyan-300" />
            ) : (
              <Users className="w-3 h-3 text-emerald-300" />
            )}
            <span>{roleInfo.label}</span>
          </span>

          {/* User Profile Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 hover:bg-blue-900/50 rounded-xl transition-colors text-left cursor-pointer border border-transparent hover:border-blue-500/30"
              aria-label="Menu Pengguna"
            >
              <div
                className={`w-8 h-8 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs ring-2 ${roleInfo.ringColor} shadow-sm`}
              >
                {currentUser.avatarInitials}
              </div>
              <div className="hidden md:block max-w-[140px] lg:max-w-[180px]">
                <div className="text-xs font-bold leading-tight text-white flex items-center gap-1 truncate">
                  <span className="truncate">{currentUser.name}</span>
                </div>
                <div className="text-[10px] text-blue-200/90 truncate flex items-center gap-1 font-medium">
                  <span>{currentUser.roleLabel}</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-blue-300 ml-0.5" />
            </button>

            {/* Profile Dropdown Menu */}
            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2.5 z-50 text-slate-800 text-xs animate-in fade-in slide-in-from-top-2"
                onClick={(e) => e.stopPropagation()}
              >
                {/* User Bio Header */}
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${roleInfo.cardBg} font-mono`}
                    >
                      {currentUser.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs truncate">{currentUser.name}</p>
                      <p className="text-slate-500 text-[11px] font-mono truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${roleInfo.color}`}
                    >
                      {roleInfo.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      NIP: {currentUser.nip || '-'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5 font-medium leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {roleInfo.desc}
                  </p>
                </div>

                {/* User Security & Account Actions */}
                <div className="px-2 py-1.5 space-y-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenChangePasswordModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-cyan-50 hover:text-cyan-900 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-[#008ba3]" />
                    <div className="text-left">
                      <div>Ganti Kata Sandi Akun</div>
                      <div className="text-[10px] text-slate-400 font-normal">Ubah password sungguhan akun ini</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenLoginModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <div className="text-left">
                      <div>Ganti Akun (Login Akun Lain)</div>
                      <div className="text-[10px] text-slate-400 font-normal">Wajib verifikasi password akun lain</div>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <div className="text-left">
                      <div>Keluar Akun (Logout)</div>
                      <div className="text-[10px] text-red-400 font-normal">Kunci sesi dan kembali ke portal login</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
