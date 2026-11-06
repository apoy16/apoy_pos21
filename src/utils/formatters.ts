/**
 * Utility functions for currency, Indonesian number-to-words (terbilang),
 * and dates.
 */

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace(/\s+/g, ' ');
}

export function formatNumberIndo(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value);
}

const satuan = [
  '',
  'Satu',
  'Dua',
  'Tiga',
  'Empat',
  'Lima',
  'Enam',
  'Tujuh',
  'Delapan',
  'Sembilan',
  'Sepuluh',
  'Sebelas',
];

export function terbilang(n: number): string {
  if (n < 0) return 'Minus ' + terbilang(Math.abs(n));
  if (n === 0) return 'Nol Rupiah';

  function bilang(num: number): string {
    let result = '';
    if (num < 12) {
      result = ' ' + satuan[num];
    } else if (num < 20) {
      result = bilang(num - 10) + ' Belas';
    } else if (num < 100) {
      result = bilang(Math.floor(num / 10)) + ' Puluh' + bilang(num % 10);
    } else if (num < 200) {
      result = ' Seratus' + bilang(num - 100);
    } else if (num < 1000) {
      result = bilang(Math.floor(num / 100)) + ' Ratus' + bilang(num % 100);
    } else if (num < 2000) {
      result = ' Seribu' + bilang(num - 1000);
    } else if (num < 1000000) {
      result = bilang(Math.floor(num / 1000)) + ' Ribu' + bilang(num % 1000);
    } else if (num < 1000000000) {
      result = bilang(Math.floor(num / 1000000)) + ' Juta' + bilang(num % 1000000);
    } else if (num < 1000000000000) {
      result = bilang(Math.floor(num / 1000000000)) + ' Miliar' + bilang(num % 1000000000);
    } else {
      result = bilang(Math.floor(num / 1000000000000)) + ' Triliun' + bilang(num % 1000000000000);
    }
    return result;
  }

  return (bilang(Math.floor(n)).trim() + ' Rupiah').replace(/\s+/g, ' ');
}

export function getCurrentDateIndo(): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('id-ID', options).format(new Date());
}

export function getCurrentTimeWIB(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes} WIB`;
}

export function formatShortDate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatShortTime(date: Date = new Date()): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}
