"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Mock: belum ada auth BE. Langsung masuk ke dashboard.
    setTimeout(() => router.push("/dashboard"), 400);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Stethoscope className="size-6" aria-hidden />
        </div>
        <CardTitle className="text-xl">MITRA BUNDA</CardTitle>
        <CardDescription>
          Masuk untuk mengakses dashboard navigasi maternal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="nama@faskes.go.id"
              defaultValue="direktur@rsud.go.id"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              defaultValue="password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Memproses…" : "Masuk"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Mode demo — autentikasi masih mock. Tekan Masuk untuk lanjut.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
