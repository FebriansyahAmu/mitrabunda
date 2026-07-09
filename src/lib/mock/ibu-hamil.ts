import type { RiskLevel, StatusAlur } from "@/lib/dto/common";

export interface IbuHamilRaw {
  id: string;
  nama: string;
  nik: string;
  bpjs: string | null;
  puskesmasId: string;
  /** Offset HPL dari hari ini (hari) — deterministik terhadap tanggal saat dijalankan. */
  hplOffsetHari: number;
  levelRisiko: RiskLevel;
  statusAlur: StatusAlur;
  nakesPenanggungJawab: string;
  rencanaTempatBersalin: string;
}

export const ibuHamilRaw: IbuHamilRaw[] = [
  {
    id: "ibu-001",
    nama: "Siti Aisyah",
    nik: "7105041207990001",
    bpjs: "0001234567801",
    puskesmasId: "pkm-tutuyan",
    hplOffsetHari: 8,
    levelRisiko: "tinggi",
    statusAlur: "administrasi",
    nakesPenanggungJawab: "Bd. Rahmawati",
    rencanaTempatBersalin: "RSUD Bolmong Timur",
  },
  {
    id: "ibu-002",
    nama: "Nurhaliza Damopolii",
    nik: "7105044503980002",
    bpjs: "0001234567802",
    puskesmasId: "pkm-kotabunan",
    hplOffsetHari: 5,
    levelRisiko: "sangat-tinggi",
    statusAlur: "rujukan",
    nakesPenanggungJawab: "Bd. Selvi Mokodongan",
    rencanaTempatBersalin: "RSUD Bolmong Timur",
  },
  {
    id: "ibu-003",
    nama: "Rina Mokodompit",
    nik: "7105046008010003",
    bpjs: null,
    puskesmasId: "pkm-nuangan",
    hplOffsetHari: 21,
    levelRisiko: "sedang",
    statusAlur: "skrining",
    nakesPenanggungJawab: "Bd. Hasna Paputungan",
    rencanaTempatBersalin: "Puskesmas Nuangan",
  },
  {
    id: "ibu-004",
    nama: "Fatimah Paputungan",
    nik: "7105042209000004",
    bpjs: "0001234567804",
    puskesmasId: "pkm-tutuyan",
    hplOffsetHari: 27,
    levelRisiko: "tinggi",
    statusAlur: "pendampingan",
    nakesPenanggungJawab: "Bd. Rahmawati",
    rencanaTempatBersalin: "RSUD Bolmong Timur",
  },
  {
    id: "ibu-005",
    nama: "Yuliana Mamonto",
    nik: "7105041106020005",
    bpjs: "0001234567805",
    puskesmasId: "pkm-kotabunan",
    hplOffsetHari: 14,
    levelRisiko: "rendah",
    statusAlur: "perencanaan",
    nakesPenanggungJawab: "Bd. Selvi Mokodongan",
    rencanaTempatBersalin: "Puskesmas Kotabunan",
  },
  {
    id: "ibu-006",
    nama: "Dewi Sugeha",
    nik: "7105045504990006",
    bpjs: "0001234567806",
    puskesmasId: "pkm-nuangan",
    hplOffsetHari: 44,
    levelRisiko: "rendah",
    statusAlur: "intake",
    nakesPenanggungJawab: "Bd. Hasna Paputungan",
    rencanaTempatBersalin: "Puskesmas Nuangan",
  },
  {
    id: "ibu-007",
    nama: "Marlina Korompot",
    nik: "7105041508970007",
    bpjs: "0001234567807",
    puskesmasId: "pkm-modayag",
    hplOffsetHari: 58,
    levelRisiko: "sedang",
    statusAlur: "pendampingan",
    nakesPenanggungJawab: "Bd. Yuni Korompot",
    rencanaTempatBersalin: "RSUD Bolmong Timur",
  },
  {
    id: "ibu-008",
    nama: "Indah Manoppo",
    nik: "7105040101960008",
    bpjs: "0001234567808",
    puskesmasId: "pkm-tutuyan",
    hplOffsetHari: -6,
    levelRisiko: "tinggi",
    statusAlur: "nifas",
    nakesPenanggungJawab: "Bd. Rahmawati",
    rencanaTempatBersalin: "RSUD Bolmong Timur",
  },
];
