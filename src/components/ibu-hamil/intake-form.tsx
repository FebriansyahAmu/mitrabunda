"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarClock,
  Check,
  Loader2,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { MotionItem, MotionStagger } from "@/components/motion/animated";
import { DatePicker } from "@/components/shared/date-picker";
import { HplCountdown } from "@/components/shared/hpl-countdown";
import { PageHeader } from "@/components/shared/page-header";
import { RiskBadge } from "@/components/shared/risk-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cekNik } from "@/app/(dashboard)/ibu-hamil/_actions/cek-nik";
import {
  FAKTOR_RISIKO,
  RIWAYAT_PERSALINAN,
  estimasiRisiko,
} from "@/lib/options";
import {
  STEP_FIELDS,
  intakeSchema,
  type IntakeInput,
} from "@/lib/validation/ibu-hamil";
import { formatTanggal, hariMenujuHpl, usiaKehamilanMinggu } from "@/lib/format";
import { RISK_LABEL } from "@/lib/dto/common";
import type { PuskesmasDTO } from "@/lib/dto/puskesmas";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Data Ibu", desc: "Identitas & kontak", icon: UserRound },
  { title: "Kehamilan", desc: "Faskes & perkiraan lahir", icon: CalendarClock },
  { title: "Risiko & Rencana", desc: "Faktor & tempat bersalin", icon: ShieldCheck },
];

type NikStatus = { status: "idle" | "checking" | "ok" | "dup"; nama?: string };

function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/** Pilihan tunggal berbentuk pill (pengganti dropdown untuk opsi pendek). */
function PillGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-input text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function IntakeForm({ puskesmas }: { puskesmas: PuskesmasDTO[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [nik, setNik] = useState<NikStatus>({ status: "idle" });

  const form = useForm<IntakeInput>({
    resolver: zodResolver(intakeSchema),
    mode: "onTouched",
    defaultValues: {
      nama: "",
      nik: "",
      bpjs: "",
      telepon: "",
      alamat: "",
      puskesmasId: "",
      hpl: "",
      riwayatPersalinan: "",
      nakesPenanggungJawab: "",
      faktorRisiko: [],
      rencanaTempatBersalin: "",
    },
  });
  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const values = watch();
  const faktor = values.faktorRisiko ?? [];
  const estimasi = estimasiRisiko(faktor.length);
  const hplValid = /^\d{4}-\d{2}-\d{2}$/.test(values.hpl ?? "");
  const usia = hplValid ? usiaKehamilanMinggu(values.hpl) : null;
  const sisa = hplValid ? hariMenujuHpl(values.hpl) : null;
  const puskesmasNama = puskesmas.find((p) => p.id === values.puskesmasId)?.nama;

  const rencanaOptions = [
    "RSUD Bolaang Mongondow Timur",
    ...puskesmas.map((p) => p.nama),
  ];

  const nikReg = register("nik");
  const StepIcon = STEPS[step].icon;

  async function handleNik(value: string) {
    if (!/^\d{16}$/.test(value)) {
      setNik({ status: "idle" });
      return;
    }
    setNik({ status: "checking" });
    const res = await cekNik(value);
    if (res.duplikat) {
      setNik({ status: "dup", nama: res.nama });
      setError("nik", {
        type: "manual",
        message: `NIK sudah terdaftar atas nama ${res.nama}`,
      });
    } else {
      setNik({ status: "ok" });
      clearErrors("nik");
    }
  }

  async function next() {
    const ok = await trigger(STEP_FIELDS[step]);
    if (!ok) return;
    if (step === 0 && nik.status === "dup") {
      toast.error("NIK sudah terdaftar", {
        description: `Atas nama ${nik.nama}`,
      });
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function onSubmit(data: IntakeInput) {
    if (nik.status === "dup") {
      setStep(0);
      return;
    }
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 800)); // mock simpan
      toast.success("Data ibu hamil tersimpan", { description: data.nama });
      router.push("/ibu-hamil");
    });
  }

  return (
    <MotionStagger className="space-y-6">
      <MotionItem>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="mb-2 -ml-2"
          render={<Link href="/ibu-hamil" />}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Ibu Hamil
        </Button>
        <PageHeader
          title="Tambah Ibu Hamil"
          description="Isi data bertahap. Sistem memvalidasi tiap langkah dan memeriksa duplikasi NIK otomatis."
        />
      </MotionItem>

      <MotionItem className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Form */}
        <div className="space-y-4">
          {/* Stepper */}
          <ol className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li key={s.title} className="flex flex-1 items-center gap-2">
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                      done
                        ? "border-primary bg-primary text-primary-foreground"
                        : active
                          ? "border-primary text-primary"
                          : "border-input text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="size-4" aria-hidden /> : i + 1}
                  </div>
                  <div className="hidden min-w-0 sm:block">
                    <div
                      className={cn(
                        "truncate text-sm font-medium",
                        active || done
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {s.title}
                    </div>
                  </div>
                  {i < STEPS.length - 1 ? (
                    <div
                      className={cn(
                        "h-px flex-1",
                        done ? "bg-primary" : "bg-border",
                      )}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>

          <Card className="overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="pt-6 pb-8">
                {/* Section header */}
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <StepIcon className="size-5" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">
                      Langkah {step + 1} dari {STEPS.length}
                    </p>
                    <h2 className="text-base font-semibold">
                      {STEPS[step].title}
                    </h2>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    {step === 0 ? (
                      <>
                        <Field
                          label="Nama Lengkap"
                          htmlFor="nama"
                          required
                          error={errors.nama?.message}
                          className="sm:col-span-2"
                        >
                          <Input
                            id="nama"
                            placeholder="Nama ibu"
                            {...register("nama")}
                            aria-invalid={!!errors.nama}
                          />
                        </Field>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label htmlFor="nik" className="text-sm font-medium">
                            NIK <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id="nik"
                            inputMode="numeric"
                            maxLength={16}
                            placeholder="16 digit"
                            {...nikReg}
                            onBlur={(e) => {
                              nikReg.onBlur(e);
                              handleNik(e.target.value);
                            }}
                            aria-invalid={!!errors.nik}
                          />
                          {errors.nik ? (
                            <p className="text-xs text-destructive">
                              {errors.nik.message}
                            </p>
                          ) : nik.status === "checking" ? (
                            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Loader2 className="size-3 animate-spin" />
                              Memeriksa NIK…
                            </p>
                          ) : nik.status === "ok" ? (
                            <p className="inline-flex items-center gap-1 text-xs text-risk-rendah">
                              <Check className="size-3" /> NIK tersedia
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              Nomor Induk Kependudukan, 16 digit.
                            </p>
                          )}
                        </div>

                        <Field
                          label="No. BPJS"
                          htmlFor="bpjs"
                          error={errors.bpjs?.message}
                          hint="13 digit (opsional)"
                        >
                          <Input
                            id="bpjs"
                            inputMode="numeric"
                            maxLength={13}
                            placeholder="13 digit"
                            {...register("bpjs")}
                            aria-invalid={!!errors.bpjs}
                          />
                        </Field>

                        <Field
                          label="No. Telepon"
                          htmlFor="telepon"
                          required
                          error={errors.telepon?.message}
                        >
                          <Input
                            id="telepon"
                            inputMode="tel"
                            placeholder="08xx-xxxx-xxxx"
                            {...register("telepon")}
                            aria-invalid={!!errors.telepon}
                          />
                        </Field>

                        <Field
                          label="Alamat"
                          htmlFor="alamat"
                          required
                          error={errors.alamat?.message}
                          className="sm:col-span-2"
                        >
                          <Textarea
                            id="alamat"
                            rows={2}
                            placeholder="Alamat domisili"
                            {...register("alamat")}
                            aria-invalid={!!errors.alamat}
                          />
                        </Field>
                      </>
                    ) : null}

                    {step === 1 ? (
                      <>
                        <Field
                          label="Puskesmas"
                          required
                          error={errors.puskesmasId?.message}
                          className="sm:col-span-2"
                        >
                          <Controller
                            control={control}
                            name="puskesmasId"
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="h-auto w-full py-2">
                                  <MapPin
                                    className="size-4 text-muted-foreground"
                                    aria-hidden
                                  />
                                  <SelectValue>
                                    {(v: string) =>
                                      v ? (
                                        (puskesmas.find((p) => p.id === v)
                                          ?.nama ?? v)
                                      ) : (
                                        <span className="text-muted-foreground">
                                          Pilih Puskesmas
                                        </span>
                                      )
                                    }
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {puskesmas.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                      <span className="flex flex-col">
                                        <span className="font-medium">
                                          {p.nama}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {p.wilayahKerja}
                                        </span>
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </Field>

                        <Field
                          label="Hari Perkiraan Lahir (HPL)"
                          htmlFor="hpl"
                          required
                          error={errors.hpl?.message}
                          hint={
                            hplValid
                              ? `≈ ${usia} minggu · ${sisa! >= 0 ? `H-${sisa}` : `H+${Math.abs(sisa!)}`}`
                              : undefined
                          }
                        >
                          <Controller
                            control={control}
                            name="hpl"
                            render={({ field }) => (
                              <DatePicker
                                id="hpl"
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Pilih tanggal HPL"
                                invalid={!!errors.hpl}
                              />
                            )}
                          />
                        </Field>

                        <Field
                          label="Riwayat Persalinan"
                          required
                          error={errors.riwayatPersalinan?.message}
                          className="sm:col-span-2"
                        >
                          <Controller
                            control={control}
                            name="riwayatPersalinan"
                            render={({ field }) => (
                              <PillGroup
                                options={RIWAYAT_PERSALINAN}
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </Field>

                        <Field
                          label="Nakes Penanggung Jawab"
                          htmlFor="nakes"
                          required
                          error={errors.nakesPenanggungJawab?.message}
                          className="sm:col-span-2"
                        >
                          <Input
                            id="nakes"
                            placeholder="Bidan / dokter penanggung jawab"
                            {...register("nakesPenanggungJawab")}
                            aria-invalid={!!errors.nakesPenanggungJawab}
                          />
                        </Field>
                      </>
                    ) : null}

                    {step === 2 ? (
                      <>
                        <div className="space-y-2 sm:col-span-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                              Faktor Risiko
                            </label>
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                              Estimasi: <RiskBadge level={estimasi} />
                            </span>
                          </div>
                          <Controller
                            control={control}
                            name="faktorRisiko"
                            render={({ field }) => (
                              <div className="flex flex-wrap gap-2">
                                {FAKTOR_RISIKO.map((f) => {
                                  const active = field.value.includes(f);
                                  return (
                                    <button
                                      key={f}
                                      type="button"
                                      aria-pressed={active}
                                      onClick={() =>
                                        field.onChange(
                                          active
                                            ? field.value.filter((x) => x !== f)
                                            : [...field.value, f],
                                        )
                                      }
                                      className={cn(
                                        "rounded-full border px-3 py-1 text-sm transition-colors",
                                        active
                                          ? "border-primary bg-primary/10 text-primary"
                                          : "border-input text-muted-foreground hover:bg-muted hover:text-foreground",
                                      )}
                                    >
                                      {f}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          />
                          <p className="text-xs text-muted-foreground">
                            Estimasi ini hanya pratinjau; skoring risiko final
                            dihitung sistem.
                          </p>
                        </div>

                        <Field
                          label="Rencana Tempat Bersalin"
                          required
                          error={errors.rencanaTempatBersalin?.message}
                          className="sm:col-span-2"
                        >
                          <Controller
                            control={control}
                            name="rencanaTempatBersalin"
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <Building2
                                    className="size-4 text-muted-foreground"
                                    aria-hidden
                                  />
                                  <SelectValue>
                                    {(v: string) =>
                                      v ? (
                                        v
                                      ) : (
                                        <span className="text-muted-foreground">
                                          Pilih tempat bersalin
                                        </span>
                                      )
                                    }
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {rencanaOptions.map((r) => (
                                    <SelectItem key={r} value={r}>
                                      {r}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </Field>
                      </>
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </CardContent>

              <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prev}
                  disabled={step === 0}
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Kembali
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button type="button" onClick={next}>
                    Lanjut
                    <ArrowRight className="size-4" aria-hidden />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        Menyimpan…
                      </>
                    ) : (
                      <>
                        <Check className="size-4" aria-hidden />
                        Simpan Data
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Pratinjau */}
        <div>
          <Card className="lg:sticky lg:top-20">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Pratinjau Data</h2>
                <RiskBadge level={estimasi} />
              </div>

              <dl className="space-y-3 text-sm">
                <PreviewRow icon={UserRound} label="Nama">
                  {values.nama || <Kosong />}
                </PreviewRow>
                <PreviewRow icon={MapPin} label="Puskesmas">
                  {puskesmasNama || <Kosong />}
                </PreviewRow>
                <PreviewRow icon={CalendarClock} label="HPL">
                  {hplValid ? (
                    <span className="flex items-center gap-2">
                      {formatTanggal(values.hpl)}
                      <HplCountdown hari={sisa as number} />
                    </span>
                  ) : (
                    <Kosong />
                  )}
                </PreviewRow>
                <PreviewRow icon={CalendarClock} label="Usia Kehamilan">
                  {usia != null ? `${usia} minggu` : <Kosong />}
                </PreviewRow>
                <PreviewRow icon={ShieldCheck} label="Faktor Risiko">
                  {faktor.length > 0 ? (
                    `${faktor.length} faktor · ${RISK_LABEL[estimasi]}`
                  ) : (
                    <Kosong />
                  )}
                </PreviewRow>
              </dl>
            </CardContent>
          </Card>
        </div>
      </MotionItem>
    </MotionStagger>
  );
}

function PreviewRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof UserRound;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="truncate font-medium">{children}</dd>
      </div>
    </div>
  );
}

function Kosong() {
  return <span className="font-normal text-muted-foreground">—</span>;
}
