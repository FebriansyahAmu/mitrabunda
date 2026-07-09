// Helper format & masking lokal id-ID.

const dtfTanggal = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dtfTanggalRingkas = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatTanggal(iso: string): string {
  return dtfTanggal.format(new Date(iso));
}

export function formatTanggalRingkas(iso: string): string {
  return dtfTanggalRingkas.format(new Date(iso));
}

export function formatAngka(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

/** Mask NIK: tampilkan 4 digit awal + 2 akhir. */
export function maskNik(nik: string): string {
  const s = nik.replace(/\s/g, "");
  if (s.length < 6) return "••••";
  return `${s.slice(0, 4)}${"•".repeat(Math.max(4, s.length - 6))}${s.slice(-2)}`;
}

/** Mask No. BPJS: tampilkan 4 digit terakhir. */
export function maskBpjs(bpjs: string | null | undefined): string {
  if (!bpjs) return "—";
  const s = bpjs.replace(/\s/g, "");
  if (s.length < 4) return "••••";
  return `••••${s.slice(-4)}`;
}

function atMidnight(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** Selisih hari dari `from` (default: hari ini) menuju HPL. Bisa negatif jika lewat. */
export function hariMenujuHpl(hplIso: string, from: Date = new Date()): number {
  const ms = atMidnight(new Date(hplIso)) - atMidnight(from);
  return Math.round(ms / 86_400_000);
}

/** Estimasi usia kehamilan (minggu) dari HPL. HPL = HPHT + 280 hari. */
export function usiaKehamilanMinggu(hplIso: string, from: Date = new Date()): number {
  const sisaHari = hariMenujuHpl(hplIso, from);
  const minggu = Math.round((280 - sisaHari) / 7);
  return Math.max(0, Math.min(42, minggu));
}
