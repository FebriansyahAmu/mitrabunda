"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  type Column,
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HplCountdown } from "@/components/shared/hpl-countdown";
import { RiskBadge } from "@/components/shared/risk-badge";
import { StatusPill } from "@/components/shared/status-pill";
import type { IbuHamilDTO } from "@/lib/dto/ibu-hamil";
import { formatTanggalRingkas } from "@/lib/format";

function SortButton({
  column,
  children,
}: {
  column: Column<IbuHamilDTO, unknown>;
  children: ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 h-7"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      <ArrowUpDown className="ml-1 size-3.5 opacity-60" aria-hidden />
    </Button>
  );
}

export function IbuTable({
  data,
  getHref,
  pageSize = 7,
}: {
  data: IbuHamilDTO[];
  getHref?: (ibu: IbuHamilDTO) => string;
  pageSize?: number;
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "hariMenujuHpl", desc: false },
  ]);

  const columns = useMemo<ColumnDef<IbuHamilDTO>[]>(() => {
    const cols: ColumnDef<IbuHamilDTO>[] = [
      {
        accessorKey: "nama",
        header: ({ column }) => <SortButton column={column}>Nama</SortButton>,
        cell: ({ row }) => (
          <div className="min-w-0">
            {getHref ? (
              <Link
                href={getHref(row.original)}
                className="font-medium hover:text-primary hover:underline"
              >
                {row.original.nama}
              </Link>
            ) : (
              <div className="font-medium">{row.original.nama}</div>
            )}
            <div className="text-xs text-muted-foreground">
              NIK {row.original.nikMasked}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "puskesmasNama",
        header: "Puskesmas",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.puskesmasNama}</span>
        ),
      },
      {
        accessorKey: "usiaKehamilanMinggu",
        header: "Usia",
        cell: ({ row }) => (
          <span className="tabular-nums">
            {row.original.usiaKehamilanMinggu} mgg
          </span>
        ),
      },
      {
        accessorKey: "hariMenujuHpl",
        header: ({ column }) => <SortButton column={column}>HPL</SortButton>,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <HplCountdown hari={row.original.hariMenujuHpl} />
            <span className="text-xs text-muted-foreground">
              {formatTanggalRingkas(row.original.hpl)}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "levelRisiko",
        header: "Risiko",
        cell: ({ row }) => <RiskBadge level={row.original.levelRisiko} />,
      },
      {
        accessorKey: "statusAlur",
        header: "Status",
        cell: ({ row }) => <StatusPill status={row.original.statusAlur} />,
      },
    ];

    if (getHref) {
      cols.push({
        id: "aksi",
        header: "",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            render={
              <Link
                href={getHref(row.original)}
                aria-label={`Detail ${row.original.nama}`}
              />
            }
          >
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        ),
      });
    }

    return cols;
  }, [getHref]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  Tidak ada data yang cocok dengan filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          Menampilkan {table.getRowModel().rows.length} dari {data.length} ibu
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" aria-hidden />
            <span className="sr-only sm:not-sr-only">Sebelumnya</span>
          </Button>
          <span className="text-xs tabular-nums text-muted-foreground">
            {table.getState().pagination.pageIndex + 1} /{" "}
            {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only sm:not-sr-only">Berikutnya</span>
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
