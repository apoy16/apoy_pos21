import { AuthUser, UserRole } from '../types';

export interface UserCredential {
  user: AuthUser;
  passwordHash: string; // Stored securely in localStorage
  lastPasswordChanged?: string;
}

export const INITIAL_REGISTERED_USERS: UserCredential[] = [
  {
    user: {
      id: 'usr-admin-01',
      username: 'admin',
      name: 'Muhamad Ngafifudin, S.Kom.',
      role: 'admin',
      roleLabel: 'Manager / Admin Pengadaan',
      email: 'ngafifudin@unikmacilacap.ac.id',
      department: 'Biro Administrasi Umum, Sarana & Logistik',
      nip: '19880921 201503 1 002',
      avatarInitials: 'MN',
    },
    passwordHash: 'admin123',
    lastPasswordChanged: '2026-09-01',
  },
  {
    user: {
      id: 'usr-owner-01',
      username: 'owner',
      name: 'Dr. H. M. Komaruddin, M.Kom.',
      role: 'owner',
      roleLabel: 'Owner / Pimpinan Universitas',
      email: 'rektorat@unikmacilacap.ac.id',
      department: 'Rektorat / Dewan Pembina Yayasan',
      nip: '19750412 200212 1 001',
      avatarInitials: 'MK',
    },
    passwordHash: 'owner123',
    lastPasswordChanged: '2026-09-01',
  },
  {
    user: {
      id: 'usr-karyawan-01',
      username: 'karyawan',
      name: 'Rina Agustina, S.Tr.Kom.',
      role: 'karyawan',
      roleLabel: 'Karyawan / Staf Pemohon',
      email: 'rina.staf@unikmacilacap.ac.id',
      department: 'Unit Laboratorium Komputer & Jaringan',
      nip: '19950819 202102 2 004',
      avatarInitials: 'RA',
    },
    passwordHash: 'karyawan123',
    lastPasswordChanged: '2026-09-01',
  },
];

const AUTH_STORAGE_KEY = 'unikma_procurement_auth_session_v3';
const USERS_STORAGE_KEY = 'unikma_procurement_users_db_v3';

/**
 * Get all users and credentials from storage.
 * Seeds with INITIAL_REGISTERED_USERS if first run.
 */
export function getRegisteredUsers(): UserCredential[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_REGISTERED_USERS));
      return INITIAL_REGISTERED_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_REGISTERED_USERS;
  } catch (err) {
    console.error('Failed to read users database:', err);
    return INITIAL_REGISTERED_USERS;
  }
}

/**
 * Save updated user credentials (e.g. after password change)
 */
export function saveRegisteredUsers(users: UserCredential[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users database:', err);
  }
}

/**
 * Real authentication function: checks username and password against database.
 */
export function authenticateUser(
  usernameInput: string,
  passwordInput: string
): { success: boolean; user?: AuthUser; error?: string } {
  const cleanUsername = usernameInput.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  if (!cleanUsername) {
    return { success: false, error: 'Silakan masukkan username atau email Anda.' };
  }
  if (!cleanPassword) {
    return { success: false, error: 'Silakan masukkan kata sandi Anda.' };
  }

  const allUsers = getRegisteredUsers();

  // Find user by username or email
  const matchUser = allUsers.find(
    (u) =>
      u.user.username.toLowerCase() === cleanUsername ||
      u.user.email.toLowerCase() === cleanUsername
  );

  if (!matchUser) {
    return {
      success: false,
      error: `Akun dengan username/email "${usernameInput}" tidak ditemukan di sistem UNIKMA.`,
    };
  }

  // Check exact password
  if (matchUser.passwordHash !== cleanPassword) {
    return {
      success: false,
      error: 'Kata sandi tidak sesuai. Periksa huruf besar/kecil dan pastikan kata sandi benar.',
    };
  }

  return {
    success: true,
    user: matchUser.user,
  };
}

/**
 * Change password for a specific user.
 * Validates old password and enforces minimum 5 characters.
 */
export function changeUserPassword(
  userId: string,
  currentPasswordInput: string,
  newPasswordInput: string
): { success: boolean; error?: string } {
  const allUsers = getRegisteredUsers();
  const userIdx = allUsers.findIndex((u) => u.user.id === userId);

  if (userIdx === -1) {
    return { success: false, error: 'Pengguna tidak ditemukan dalam sistem.' };
  }

  const target = allUsers[userIdx];
  if (target.passwordHash !== currentPasswordInput.trim()) {
    return { success: false, error: 'Kata sandi saat ini yang Anda masukkan salah.' };
  }

  if (newPasswordInput.trim().length < 5) {
    return { success: false, error: 'Kata sandi baru minimal harus 5 karakter.' };
  }

  if (target.passwordHash === newPasswordInput.trim()) {
    return { success: false, error: 'Kata sandi baru tidak boleh sama dengan kata sandi lama.' };
  }

  // Update password in database
  const updatedUsers = [...allUsers];
  updatedUsers[userIdx] = {
    ...target,
    passwordHash: newPasswordInput.trim(),
    lastPasswordChanged: new Date().toISOString().split('T')[0],
  };

  saveRegisteredUsers(updatedUsers);
  return { success: true };
}

/**
 * Retrieve saved user from LocalStorage session.
 * Real authentication: Returns null if user has not logged in!
 */
export function getSavedAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null; // NO auto-login! Requires real login credentials.
    }
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Save active user session to LocalStorage
 */
export function saveAuthUser(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to save auth session:', err);
  }
}

/**
 * Reset all user passwords back to default (for emergency/troubleshooting)
 */
export function resetCredentialsToDefault(): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_REGISTERED_USERS));
}

// Keep export for backwards compatibility where referenced
export const REGISTERED_USERS = INITIAL_REGISTERED_USERS;

/**
 * Role Permission Helpers (Role-Based Access Control)
 */
export const Permissions = {
  canCreateItem: (role: UserRole): boolean => role === 'admin' || role === 'karyawan',
  canEditItem: (role: UserRole): boolean => role === 'admin',
  canDeleteItem: (role: UserRole): boolean => role === 'admin',
  canManageVendors: (role: UserRole): boolean => role === 'admin',
  canManageCatalog: (role: UserRole): boolean => role === 'admin',
  canAssignVendorPO: (role: UserRole): boolean => role === 'admin',
  canApprovePO: (role: UserRole): boolean => role === 'owner' || role === 'admin',
  canVerifyReceipt: (role: UserRole): boolean => role === 'admin',
  canDeleteLogs: (role: UserRole): boolean => role === 'admin',
  canResetSystem: (role: UserRole): boolean => role === 'admin',
  canViewExecutiveMetrics: (role: UserRole): boolean => role === 'owner' || role === 'admin',
};

/**
 * Helper to get role badge style and label
 */
export function getRoleBadgeInfo(role: UserRole) {
  switch (role) {
    case 'admin':
      return {
        label: 'Manager / Admin',
        color: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
        cardBg: 'bg-blue-50 text-blue-900 border-blue-200',
        iconColor: 'text-cyan-400',
        ringColor: 'ring-cyan-400/60',
        desc: 'Akses Penuh: Kelola Item, Estimasi Harga, Rekanan Vendor, BAST & Hapus Data',
      };
    case 'owner':
      return {
        label: 'Owner / Pimpinan',
        color: 'bg-amber-500/25 text-amber-200 border-amber-400/40',
        cardBg: 'bg-amber-50 text-amber-900 border-amber-200',
        iconColor: 'text-amber-400',
        ringColor: 'ring-amber-400/60',
        desc: 'Akses Eksekutif: Pengawasan Pagu Anggaran, Persetujuan (Approval) PO & Audit Log',
      };
    case 'karyawan':
      return {
        label: 'Karyawan / Staf',
        color: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
        cardBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        iconColor: 'text-emerald-400',
        ringColor: 'ring-emerald-400/60',
        desc: 'Akses Pemohon: Pengajuan Barang Baru & Katalog (Dibatasi dari Hapus & Ubah Anggaran)',
      };
  }
}
