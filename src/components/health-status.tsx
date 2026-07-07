"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

type HealthResponse = { status: "ok" | "error"; database: "up" | "down" };

export function HealthStatus() {
  const t = useTranslations("dashboard");
  const { data, isPending } = useQuery({
    queryKey: ["health"],
    queryFn: () => api.get<HealthResponse>("/api/health"),
    refetchInterval: 30_000,
  });

  if (isPending) {
    return (
      <span className="text-muted-foreground text-sm">
        {t("checkingDatabase")}
      </span>
    );
  }

  const up = data?.database === "up";

  return (
    <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
      <span
        className={`size-2 rounded-full ${up ? "bg-emerald-500" : "bg-destructive"}`}
      />
      {up ? t("databaseUp") : t("databaseDown")}
    </span>
  );
}
