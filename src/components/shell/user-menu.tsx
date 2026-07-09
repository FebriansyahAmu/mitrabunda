"use client";

import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currentUser, PERAN_LABEL } from "@/lib/rbac";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="size-9 rounded-full p-0"
            aria-label="Menu pengguna"
          />
        }
      >
        <Avatar className="size-9">
          <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
            {currentUser.inisial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="grid leading-tight">
            <span className="truncate text-sm font-medium">
              {currentUser.nama}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {PERAN_LABEL[currentUser.peran]} · {currentUser.faskes}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/pengaturan" />}>
          <UserRound />
          Profil &amp; Pengaturan
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/" />}>
          <LogOut />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
