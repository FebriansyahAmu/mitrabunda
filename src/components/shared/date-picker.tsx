"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Pilih tanggal",
  invalid,
}: {
  id?: string;
  value?: string;
  onChange: (iso: string) => void;
  placeholder?: string;
  invalid?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = value ? parseISO(value) : undefined;
  const today = new Date();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-invalid={invalid}
            className={cn(
              "h-8 w-full justify-start gap-2 font-normal",
              !selected && "text-muted-foreground",
            )}
          />
        }
      >
        <CalendarIcon className="size-4 text-muted-foreground" aria-hidden />
        {selected
          ? format(selected, "d MMMM yyyy", { locale: localeId })
          : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            if (d) {
              onChange(format(d, "yyyy-MM-dd"));
              setOpen(false);
            }
          }}
          defaultMonth={selected ?? today}
          captionLayout="dropdown"
          startMonth={new Date(today.getFullYear() - 1, 0)}
          endMonth={new Date(today.getFullYear() + 1, 11)}
          locale={localeId}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
