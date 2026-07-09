import {
  LayoutDashboard,
  Users,
  Radar,
  Building2,
  ShieldCheck,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { Peran } from "./rbac";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Peran yang boleh melihat item ini. Undefined = semua peran. */
  roles?: Peran[];
}

export const navMain: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Ibu Hamil", href: "/ibu-hamil", icon: Users },
  { title: "Tracking H-30", href: "/tracking", icon: Radar },
  { title: "Master Faskes", href: "/faskes", icon: Building2 },
];

export const navSecondary: NavItem[] = [
  {
    title: "Pengguna & Peran",
    href: "/pengaturan/pengguna",
    icon: ShieldCheck,
    roles: ["direktur"],
  },
  { title: "Pengaturan", href: "/pengaturan", icon: Settings },
];

/** Peta label breadcrumb per segmen rute. */
export const SEGMENT_LABEL: Record<string, string> = {
  "dashboard": "Dashboard",
  "ibu-hamil": "Ibu Hamil",
  "tracking": "Tracking H-30",
  "faskes": "Master Faskes",
  "pengaturan": "Pengaturan",
  "pengguna": "Pengguna & Peran",
  "baru": "Tambah Baru",
};
