"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

type HealthResponse = { status: "ok" | "error"; database: "up" | "down" };

export function HealthStatus() {
  const { data, isPending } = useQuery({
    queryKey: ["health"],
    queryFn: () => api.get<HealthResponse>("/api/health"),
    refetchInterval: 30_000,
  });

  if (isPending) {
    return (
      <span className="text-muted-foreground text-sm">
        Checking database...
      </span>
    );
  }

  const up = data?.database === "up";

  return (
    <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
      <span
        className={`size-2 rounded-full ${up ? "bg-emerald-500" : "bg-destructive"}`}
      />
      Database {up ? "up" : "down"}
    </span>
  );
}
