"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import {
  createNoteFormSchema,
  type CreateNoteInput,
  type Note,
} from "@/lib/validations/note";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const columnHelper = createColumnHelper<Note>();

export function NotesView() {
  const t = useTranslations("notes");
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const { data: notes, isPending } = useQuery({
    queryKey: ["notes"],
    queryFn: () => api.get<Note[]>("/api/notes"),
  });

  const createNote = useMutation({
    mutationFn: (input: CreateNoteInput) => api.post<Note>("/api/notes", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success(t("created"));
    },
    onError: () => toast.error(t("createError")),
  });

  const deleteNote = useMutation({
    mutationFn: (id: string) => api.delete(`/api/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success(t("deleted"));
    },
    onError: () => toast.error(t("deleteError")),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateNoteInput>({
    resolver: zodResolver(
      createNoteFormSchema({
        titleRequired: t("validation.titleRequired"),
        contentRequired: t("validation.contentRequired"),
      })
    ),
  });

  function onSubmit(values: CreateNoteInput) {
    createNote.mutate(values, { onSuccess: () => reset() });
  }

  const columns = [
    columnHelper.accessor("title", { header: t("columnTitle") }),
    columnHelper.accessor("content", {
      header: t("columnContent"),
      cell: (info) => (
        <span className="text-muted-foreground line-clamp-1">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: t("columnCreated"),
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("deleteAria")}
          onClick={() => deleteNote.mutate(row.original.id)}
        >
          <Trash2 className="text-destructive size-4" />
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data: notes ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("newNote")}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">{t("titleLabel")}</Label>
              <Input id="title" {...register("title")} />
              {errors.title ? (
                <p className="text-destructive text-sm">
                  {errors.title.message}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="content">{t("contentLabel")}</Label>
              <Textarea id="content" rows={3} {...register("content")} />
              {errors.content ? (
                <p className="text-destructive text-sm">
                  {errors.content.message}
                </p>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="border-t-0 bg-transparent">
            <Button type="submit" disabled={createNote.isPending}>
              {createNote.isPending ? t("adding") : t("add")}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{ asc: " ↑", desc: " ↓" }[
                      header.column.getIsSorted() as string
                    ] ?? null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground text-center"
                >
                  {t("loading")}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground text-center"
                >
                  {t("empty")}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
