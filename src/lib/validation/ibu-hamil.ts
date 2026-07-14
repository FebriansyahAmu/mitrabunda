import { z } from "zod";

export const intakeSchema = z.object({
  nama: z.string().trim().min(3, "Nama minimal 3 karakter"),
  nik: z.string().regex(/^\d{16}$/, "NIK harus 16 digit angka"),
  bpjs: z
    .string()
    .regex(/^\d{13}$/, "No. BPJS harus 13 digit")
    .or(z.literal("")),
  telepon: z
    .string()
    .min(9, "Nomor telepon tidak valid")
    .regex(/^[0-9+\-\s]+$/, "Hanya angka dan tanda + -"),
  alamat: z.string().trim().min(5, "Alamat terlalu pendek"),
  puskesmasId: z.string().min(1, "Pilih Puskesmas"),
  hpl: z.string().min(1, "Tanggal HPL wajib diisi"),
  riwayatPersalinan: z.string().min(1, "Pilih riwayat persalinan"),
  nakesPenanggungJawab: z.string().trim().min(3, "Nama nakes wajib diisi"),
  faktorRisiko: z.array(z.string()),
  rencanaTempatBersalin: z.string().min(1, "Pilih rencana tempat bersalin"),
});

export type IntakeInput = z.infer<typeof intakeSchema>;

/** Field yang divalidasi per langkah wizard. */
export const STEP_FIELDS: (keyof IntakeInput)[][] = [
  ["nama", "nik", "bpjs", "telepon", "alamat"],
  ["puskesmasId", "hpl", "riwayatPersalinan", "nakesPenanggungJawab"],
  ["faktorRisiko", "rencanaTempatBersalin"],
];
